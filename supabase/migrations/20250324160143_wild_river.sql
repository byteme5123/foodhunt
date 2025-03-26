/*
  # Add Menu Data

  1. Changes
    - Add sample menu categories and link foods to restaurants
    - Add sample menu items with prices
    - Add sample vlogger features

  2. Data
    - Menu categories for restaurants
    - Restaurant-food relationships with prices
    - Sample vlogger content
*/

-- Insert sample menu categories
INSERT INTO menu_categories (restaurant_id, name, description)
SELECT 
  r.id,
  c.category_name,
  'Delicious ' || c.category_name || ' dishes'
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Appetizers'),
    ('Main Course'),
    ('Desserts'),
    ('Beverages'),
    ('Specials')
) AS c(category_name);

-- Link existing foods to restaurants with prices
INSERT INTO restaurant_foods (restaurant_id, food_id, price)
SELECT 
  r.id,
  f.id,
  FLOOR(RANDOM() * (800 - 200 + 1) + 200)::numeric -- Random price between 200 and 800
FROM restaurants r
CROSS JOIN foods f
WHERE NOT EXISTS (
  SELECT 1 
  FROM restaurant_foods rf 
  WHERE rf.restaurant_id = r.id AND rf.food_id = f.id
)
LIMIT 50; -- Limit to avoid too many combinations

-- Insert sample vlogger features
INSERT INTO vlogger_features (
  restaurant_id,
  vlogger_name,
  content_type,
  content_url,
  feature_date,
  platform,
  description
)
SELECT
  r.id,
  'Food Explorer Nepal',
  'image',
  'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80',
  CURRENT_DATE - (FLOOR(RANDOM() * 30))::integer,
  'Instagram',
  'Exploring the authentic tastes of ' || r.name
FROM restaurants r
LIMIT 5;