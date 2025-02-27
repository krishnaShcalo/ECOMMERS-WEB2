/*
  # Add test orders and data

  1. New Data
    - Add test orders with items for testing order management
    - Add a test user for orders
  
  2. Changes
    - Insert test user
    - Insert test orders with proper UUID format
    - Insert test order items
*/

-- Insert test user if not exists
INSERT INTO auth.users (id, email)
VALUES ('d0d4e97c-30d2-4a2e-8e14-896dd8b89581', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert test user profile
INSERT INTO users (id, role)
VALUES ('d0d4e97c-30d2-4a2e-8e14-896dd8b89581', 'customer')
ON CONFLICT (id) DO NOTHING;

-- Insert test orders
INSERT INTO orders (id, user_id, total, status, created_at)
VALUES
  (
    gen_random_uuid(), 
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    1299.99,
    'pending',
    NOW() - INTERVAL '2 hours'
  ),
  (
    gen_random_uuid(),
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    699.99,
    'processing',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    899.99,
    'shipped',
    NOW() - INTERVAL '3 days'
  );

-- Insert order items for each order
WITH new_orders AS (
  SELECT id, created_at 
  FROM orders 
  WHERE user_id = 'd0d4e97c-30d2-4a2e-8e14-896dd8b89581'
  ORDER BY created_at DESC
  LIMIT 3
),
ordered_products AS (
  SELECT id, price, name,
         ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM products
  WHERE name IN ('MacBook Pro M2', 'Refurbished iPhone 13', 'Used Gaming PC')
)
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  no.id,
  op.id,
  1,
  op.price
FROM new_orders no
JOIN ordered_products op ON op.rn = (
  CASE 
    WHEN no.created_at = (SELECT MAX(created_at) FROM new_orders) THEN 1
    WHEN no.created_at = (SELECT created_at FROM new_orders ORDER BY created_at DESC LIMIT 1 OFFSET 1) THEN 2
    ELSE 3
  END
);