/*
  # Add test orders

  1. New Data
    - Add test orders with items for testing order management
    - Add a test user for orders
  
  2. Changes
    - Insert test user
    - Insert test orders
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
    'ord_001', 
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    1299.99,
    'pending',
    NOW() - INTERVAL '2 hours'
  ),
  (
    'ord_002',
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    699.99,
    'processing',
    NOW() - INTERVAL '1 day'
  ),
  (
    'ord_003',
    'd0d4e97c-30d2-4a2e-8e14-896dd8b89581',
    899.99,
    'shipped',
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  'ord_001',
  id,
  1,
  price
FROM products 
WHERE name = 'MacBook Pro M2'
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  'ord_002',
  id,
  1,
  price
FROM products
WHERE name = 'Refurbished iPhone 13'
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  'ord_003',
  id,
  1,
  price
FROM products
WHERE name = 'Used Gaming PC'
ON CONFLICT DO NOTHING;