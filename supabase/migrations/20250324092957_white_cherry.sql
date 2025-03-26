/*
  # Add food variations and restaurant-food relationships

  1. New Tables
    - `food_variations`: Stores different variations of foods
      - `id` (uuid, primary key)
      - `food_id` (uuid, foreign key to foods)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
    
    - `restaurant_foods`: Links restaurants with the foods they serve
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurants)
      - `food_id` (uuid, foreign key to foods)
      - `price` (numeric)
      - `is_available` (boolean)

  2. Security
    - Enable RLS on new tables
    - Add policies for public read access
*/

-- Create food variations table
CREATE TABLE IF NOT EXISTS food_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid REFERENCES foods(id),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create restaurant_foods table
CREATE TABLE IF NOT EXISTS restaurant_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id),
  food_id uuid REFERENCES foods(id),
  price numeric NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE food_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_foods ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Public read access for food variations"
  ON food_variations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for restaurant foods"
  ON restaurant_foods
  FOR SELECT
  TO public
  USING (true);

-- Insert sample food variations
INSERT INTO food_variations (food_id, name, description, image_url)
SELECT 
  f.id,
  'Chicken Momo',
  'Classic Nepali dumplings filled with spiced chicken',
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800'
FROM foods f
WHERE f.name = 'Buff Momo'
UNION ALL
SELECT 
  f.id,
  'Veg Momo',
  'Vegetarian dumplings filled with spiced vegetables',
  'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800'
FROM foods f
WHERE f.name = 'Buff Momo';

-- Insert sample restaurant_foods
INSERT INTO restaurant_foods (restaurant_id, food_id, price)
SELECT 
  r.id,
  f.id,
  250
FROM restaurants r
CROSS JOIN foods f
WHERE f.name = 'Buff Momo'
  AND r.name IN ('Momo Central', 'Thakali Kitchen');