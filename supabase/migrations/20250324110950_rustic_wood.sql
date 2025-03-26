/*
  # Add restaurant foods management

  1. Changes
    - Add price column to restaurant_foods table
    - Add RLS policies for restaurant_foods table
    - Add function to get all restaurants for a food
    - Add function to get all foods for a restaurant

  2. Security
    - Enable RLS on restaurant_foods table
    - Add policies for authenticated users to manage restaurant_foods
*/

-- Add price column to restaurant_foods if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurant_foods' AND column_name = 'price'
  ) THEN
    ALTER TABLE restaurant_foods ADD COLUMN price numeric NOT NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE restaurant_foods ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can manage restaurant_foods"
  ON restaurant_foods
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view restaurant_foods"
  ON restaurant_foods
  FOR SELECT
  TO public
  USING (true);

-- Function to get all restaurants for a food
CREATE OR REPLACE FUNCTION get_food_restaurants(p_food_id uuid)
RETURNS TABLE (
  restaurant_id uuid,
  restaurant_name text,
  price numeric
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    r.id as restaurant_id,
    r.name as restaurant_name,
    rf.price
  FROM restaurants r
  JOIN restaurant_foods rf ON rf.restaurant_id = r.id
  WHERE rf.food_id = p_food_id;
$$;

-- Function to get all foods for a restaurant
CREATE OR REPLACE FUNCTION get_restaurant_foods(p_restaurant_id uuid)
RETURNS TABLE (
  food_id uuid,
  food_name text,
  price numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    f.id as food_id,
    f.name as food_name,
    rf.price
  FROM foods f
  JOIN restaurant_foods rf ON rf.food_id = f.id
  WHERE rf.restaurant_id = p_restaurant_id;
$$;