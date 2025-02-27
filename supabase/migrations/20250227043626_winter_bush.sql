/*
  # Initial Schema Setup for Budget Bazaar

  1. New Tables
    - users (extends auth.users)
      - role (text): user role (customer/admin)
      - created_at (timestamp)
    
    - products
      - id (uuid): primary key
      - name (text): product name
      - description (text): product description
      - price (numeric): product price
      - condition (text): new/used/refurbished
      - stock (int): available quantity
      - category (text): product category
      - images (text[]): array of image URLs
      - created_at (timestamp)
    
    - orders
      - id (uuid): primary key
      - user_id (uuid): references users
      - total (numeric): order total
      - status (text): order status
      - created_at (timestamp)
    
    - order_items
      - id (uuid): primary key
      - order_id (uuid): references orders
      - product_id (uuid): references products
      - quantity (int): quantity ordered
      - price (numeric): price at time of order
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for customers and admins
*/

-- Create custom types
CREATE TYPE product_condition AS ENUM ('new', 'used', 'refurbished');

-- Drop and recreate order_status type if needed
DO $$ 
BEGIN
  -- Drop the type if it exists
  DROP TYPE IF EXISTS order_status CASCADE;
  
  -- Create the type
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
EXCEPTION
  WHEN OTHERS THEN
    NULL;  -- Ignore any errors
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  email text,
  full_name TEXT,
  IF NOT EXISTS avatar_url TEXT
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  condition product_condition NOT NULL,
  stock int NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category text NOT NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create addresses table for user shipping/billing addresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text CHECK (type IN ('shipping', 'billing')),
  is_default boolean DEFAULT false,
  first_name text,
  last_name text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
DROP POLICY IF EXISTS "Only admins can update order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;
DROP POLICY IF EXISTS "Admins can view all addresses" ON addresses;
DROP POLICY IF EXISTS "Admins can manage all addresses" ON addresses;

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop and recreate the role column to handle the type dependency
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Now we can safely drop and recreate the type
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Add the role column back
ALTER TABLE users 
ADD COLUMN role user_role NOT NULL DEFAULT 'customer';

-- First, drop existing policies for users table
DROP POLICY IF EXISTS "Enable read access for users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users" ON users;

-- Create simpler, more permissive policies for users table
CREATE POLICY "Enable read for authenticated users"
ON users
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Enable insert for authenticated users"
ON users
FOR INSERT
WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "Enable update for users"
ON users
FOR UPDATE
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Update the handle_new_user trigger to properly set role and JWT claim
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role user_role;
BEGIN
  -- Check if user already exists in public.users
  IF EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
    RETURN new;
  END IF;

  -- Set default role
  default_role := CASE 
    WHEN new.email = 'admin@admin.com' THEN 'admin'
    ELSE 'customer'
  END;

  -- Insert new user
  INSERT INTO public.users (
    id,
    email,
    role,
    first_name,
    last_name
  ) VALUES (
    new.id,
    new.email,
    default_role,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );

  -- Set role in JWT claim
  PERFORM set_claim(new.id, 'role', default_role::text);

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to sync user role to JWT claims
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS trigger AS $$
BEGIN
  -- Update role claim when user role changes
  PERFORM set_claim(NEW.id, 'role', NEW.role::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role changes
DROP TRIGGER IF EXISTS on_user_role_change ON users;
CREATE TRIGGER on_user_role_change
  AFTER UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role();

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT ALL ON users TO anon;

-- Remove the direct admin user insertion since we can't insert into auth.users directly
-- Instead, we'll create a function to set a user as admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION make_user_admin TO authenticated;
GRANT EXECUTE ON FUNCTION make_user_admin TO service_role;

-- Create other policies
-- Product Policies
CREATE POLICY "Anyone can view products"
ON products
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only admins can insert products"
ON products
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update products"
ON products
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete products"
ON products
FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');

-- Order Policies
CREATE POLICY "Users can view own orders"
ON orders
FOR SELECT
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create own orders"
ON orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders"
ON orders
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

-- Order Items Policies
CREATE POLICY "Users can view own order items"
ON order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  )
);

CREATE POLICY "Users can create own order items"
ON order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Only admins can update order items"
ON order_items
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

-- Address Policies
CREATE POLICY "Users can view own addresses"
ON addresses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses"
ON addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON addresses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON addresses
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
ON addresses
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all addresses"
ON addresses
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Verify table structure
DO $$ 
BEGIN
  -- Check if all required columns exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'Missing required column: id';
  END IF;
  
  -- Add more column checks as needed
END $$;

-- Reset and reseed products
TRUNCATE products CASCADE;

-- Reinsert sample products
INSERT INTO products (name, description, price, condition, stock, category, images)
VALUES
  (
    'Lenovo Ideapad 1 15.6" Laptop',
    'AMD Ryzen 7 5700U processor. 16GB Memory. 512GB SSD.',
    639.99,
    'new',
    50,
    'electronics',
    ARRAY['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6555/6555683_sd.jpg']
  );

-- Update users table
ALTER TABLE users 
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS avatar_url;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update orders table
ALTER TABLE orders 
ALTER COLUMN status TYPE order_status USING status::order_status,
ALTER COLUMN status SET DEFAULT 'pending'::order_status;

-- Add indexes if they don't exist
DO $$ 
BEGIN
  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_user_id'
  ) THEN
    CREATE INDEX idx_orders_user_id ON orders(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_status'
  ) THEN
    CREATE INDEX idx_orders_status ON orders(status);
  END IF;
END $$;