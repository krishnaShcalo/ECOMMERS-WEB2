/*
  # Insert sample products

  1. Sample Data
    - Adds a variety of products across different categories
    - Includes mix of new, used, and refurbished items
    - Realistic prices and stock levels
    - Sample images from placeholder service
*/

INSERT INTO products (name, description, price, condition, stock, category, images, created_at)
VALUES
  (
    'MacBook Pro M2',
    'Latest model MacBook Pro with M2 chip, 16GB RAM, and 512GB SSD. Features a stunning Retina display and incredible battery life.',
    1299.99,
    'new',
    10,
    'electronics',
    ARRAY['https://placehold.co/600x400/png?text=MacBook+Pro+M2'],
    NOW() - INTERVAL '1 day'
  ),
  (
    'Refurbished iPhone 13',
    'Professionally refurbished iPhone 13 in excellent condition. 128GB storage, includes charger and 1-year warranty.',
    699.99,
    'refurbished',
    5,
    'electronics',
    ARRAY['https://placehold.co/600x400/png?text=iPhone+13'],
    NOW() - INTERVAL '2 days'
  ),
  (
    'Used Gaming PC',
    'Custom-built gaming PC with RTX 3070, Ryzen 5600X, 32GB RAM. Minor wear but in great working condition.',
    899.99,
    'used',
    1,
    'electronics',
    ARRAY['https://placehold.co/600x400/png?text=Gaming+PC'],
    NOW() - INTERVAL '3 days'
  ),
  (
    'Ergonomic Office Chair',
    'High-quality office chair with lumbar support, adjustable armrests, and breathable mesh back.',
    299.99,
    'new',
    15,
    'home',
    ARRAY['https://placehold.co/600x400/png?text=Office+Chair'],
    NOW() - INTERVAL '4 days'
  ),
  (
    'Vintage Leather Jacket',
    'Genuine leather jacket from the 90s. Some natural wear adds character. Size: Medium.',
    149.99,
    'used',
    1,
    'clothing',
    ARRAY['https://placehold.co/600x400/png?text=Leather+Jacket'],
    NOW() - INTERVAL '5 days'
  ),
  (
    'Smart LED TV 55"',
    '4K Ultra HD Smart LED TV with HDR. Refurbished to factory specifications. Includes wall mount.',
    549.99,
    'refurbished',
    3,
    'electronics',
    ARRAY['https://placehold.co/600x400/png?text=Smart+TV'],
    NOW() - INTERVAL '6 days'
  ),
  (
    'Wireless Earbuds',
    'True wireless earbuds with active noise cancellation and 24-hour battery life with charging case.',
    79.99,
    'new',
    20,
    'electronics',
    ARRAY['https://placehold.co/600x400/png?text=Wireless+Earbuds'],
    NOW() - INTERVAL '7 days'
  ),
  (
    'Modern Coffee Table',
    'Minimalist coffee table with tempered glass top and solid wood base. Minor assembly required.',
    199.99,
    'new',
    8,
    'home',
    ARRAY['https://placehold.co/600x400/png?text=Coffee+Table'],
    NOW() - INTERVAL '8 days'
  ),
  (
    'Designer Handbag',
    'Gently used luxury designer handbag. Authentic with original dust bag. Some minor wear on handles.',
    399.99,
    'used',
    1,
    'clothing',
    ARRAY['https://placehold.co/600x400/png?text=Designer+Handbag'],
    NOW() - INTERVAL '9 days'
  ),
  (
    'Robot Vacuum',
    'Smart robot vacuum with mapping technology and self-emptying base. Professionally refurbished.',
    299.99,
    'refurbished',
    4,
    'home',
    ARRAY['https://placehold.co/600x400/png?text=Robot+Vacuum'],
    NOW() - INTERVAL '10 days'
  );