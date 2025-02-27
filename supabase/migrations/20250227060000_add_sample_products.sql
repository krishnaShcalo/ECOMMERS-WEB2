-- Delete existing products if any
DELETE FROM products;

-- Insert sample products
INSERT INTO products (name, description, price, condition, stock, category, images, created_at)
VALUES
  (
    'Lenovo Ideapad 1 15.6" Laptop',
    'AMD Ryzen 7 5700U processor. 16GB Memory. 512GB SSD. AMD Radeon Graphics. Windows 11 Home. Full HD Touchscreen Display. Cloud Gray color.',
    639.99,
    'new',
    50,
    'electronics',
    ARRAY['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6555/6555683_sd.jpg'],
    NOW()
  ),
  (
    'MacBook Air 13.3"',
    'Apple M1 chip. 8GB Memory. 256GB SSD. Retina display. Space Gray.',
    899.99,
    'new',
    30,
    'electronics',
    ARRAY['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5721/5721600_sd.jpg'],
    NOW()
  ),
  (
    'HP Pavilion 15.6" Gaming Laptop',
    'Intel Core i5. 8GB Memory. NVIDIA GeForce GTX 1650. 512GB SSD. Shadow Black.',
    699.99,
    'new',
    25,
    'electronics',
    ARRAY['https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6477/6477889_sd.jpg'],
    NOW()
  ); 