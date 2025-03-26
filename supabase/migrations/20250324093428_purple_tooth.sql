/*
  # Add sample data for foods and restaurants

  1. Changes
    - Add food variations for all existing foods
    - Add restaurant-food relationships with prices
    - Add latitude/longitude for restaurants for distance calculation

  2. Data Added
    - Multiple variations for each food type
    - Price and availability information
    - Geographic coordinates for restaurants
*/

-- Add latitude and longitude to restaurants if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN latitude numeric;
    ALTER TABLE restaurants ADD COLUMN longitude numeric;
  END IF;
END $$;

-- Update restaurant coordinates
UPDATE restaurants
SET 
  latitude = CASE name
    WHEN 'Momo Central' THEN 27.7172
    WHEN 'Thakali Kitchen' THEN 27.7271
    WHEN 'Newari Bhansa Ghar' THEN 27.6747
    WHEN 'Himalayan Curry House' THEN 27.7216
    WHEN 'Dal Bhat Power' THEN 27.7107
    WHEN 'Sherpa Kitchen' THEN 27.6781
  END,
  longitude = CASE name
    WHEN 'Momo Central' THEN 85.3240
    WHEN 'Thakali Kitchen' THEN 85.3366
    WHEN 'Newari Bhansa Ghar' THEN 85.3206
    WHEN 'Himalayan Curry House' THEN 85.3612
    WHEN 'Dal Bhat Power' THEN 85.3159
    WHEN 'Sherpa Kitchen' THEN 85.3136
  END;

-- Add food variations for each food
INSERT INTO food_variations (food_id, name, description, image_url)
SELECT 
  f.id,
  'Chicken Momo',
  'Tender chicken dumplings with aromatic spices',
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800'
FROM foods f
WHERE f.name = 'Buff Momo'
UNION ALL
SELECT 
  f.id,
  'Veg Momo',
  'Mixed vegetable dumplings with Nepali spices',
  'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800'
FROM foods f
WHERE f.name = 'Buff Momo'
UNION ALL
SELECT 
  f.id,
  'Mushroom Thakali Set',
  'Vegetarian Thakali set with mushroom curry',
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'
FROM foods f
WHERE f.name = 'Thakali Set'
UNION ALL
SELECT 
  f.id,
  'Chicken Thakali Set',
  'Traditional Thakali set with chicken curry',
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'
FROM foods f
WHERE f.name = 'Thakali Set'
UNION ALL
SELECT 
  f.id,
  'Sweet Sel Roti',
  'Traditional sweet ring bread made with rice flour',
  'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800'
FROM foods f
WHERE f.name = 'Sel Roti'
UNION ALL
SELECT 
  f.id,
  'Spicy Sel Roti',
  'Spicy variation of the traditional ring bread',
  'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800'
FROM foods f
WHERE f.name = 'Sel Roti'
UNION ALL
SELECT 
  f.id,
  'Buff Choila',
  'Spicy grilled buffalo meat with traditional spices',
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'
FROM foods f
WHERE f.name = 'Choila'
UNION ALL
SELECT 
  f.id,
  'Chicken Choila',
  'Grilled chicken with Newari spices',
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'
FROM foods f
WHERE f.name = 'Choila';

-- Add restaurant-food relationships
INSERT INTO restaurant_foods (restaurant_id, food_id, price)
SELECT 
  r.id,
  f.id,
  CASE f.name
    WHEN 'Buff Momo' THEN 250
    WHEN 'Thakali Set' THEN 450
    WHEN 'Sel Roti' THEN 100
    WHEN 'Choila' THEN 350
    WHEN 'Yomari' THEN 200
    WHEN 'Dhido' THEN 300
    WHEN 'Samay Baji' THEN 400
    WHEN 'Aloo Tama' THEN 250
  END as price
FROM restaurants r
CROSS JOIN foods f
WHERE 
  (r.name = 'Momo Central' AND f.name IN ('Buff Momo', 'Sel Roti')) OR
  (r.name = 'Thakali Kitchen' AND f.name IN ('Thakali Set', 'Dhido', 'Aloo Tama')) OR
  (r.name = 'Newari Bhansa Ghar' AND f.name IN ('Choila', 'Samay Baji')) OR
  (r.name = 'Himalayan Curry House' AND f.name IN ('Buff Momo', 'Aloo Tama')) OR
  (r.name = 'Dal Bhat Power' AND f.name IN ('Thakali Set', 'Dhido')) OR
  (r.name = 'Sherpa Kitchen' AND f.name IN ('Yomari', 'Thakali Set', 'Aloo Tama'));