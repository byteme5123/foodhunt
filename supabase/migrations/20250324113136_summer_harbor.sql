/*
  # Update search tracking logic
  
  1. Changes
    - Add function to increment food searches when searched
    - Remove old trigger that wasn't correctly tracking searches
    - Add function to track restaurant visits

  2. Security
    - Functions are created with SECURITY DEFINER to ensure they run with necessary privileges
    - Functions are idempotent and safe to run multiple times

  3. Notes
    - Using COALESCE to handle NULL values in counters
    - Functions return void as they are procedural updates
*/

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS increment_food_searches_trigger ON restaurant_foods;

-- Create or replace function to increment food searches
CREATE OR REPLACE FUNCTION increment_food_search(food_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE foods 
  SET searches = COALESCE(searches, 0) + 1
  WHERE id = food_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to increment restaurant visits
CREATE OR REPLACE FUNCTION increment_restaurant_visit(restaurant_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE restaurants 
  SET visits = COALESCE(visits, 0) + 1
  WHERE id = restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_food_search(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_food_search(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_restaurant_visit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_restaurant_visit(uuid) TO anon;