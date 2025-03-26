/*
  # Update search and visits tracking

  1. Changes
    - Add trigger to increment food searches count
    - Add trigger to increment restaurant visits count
    - Add function to get top foods by searches
    - Add function to get top restaurants by visits

  2. Security
    - Functions are marked as SECURITY DEFINER to ensure they run with necessary privileges
    - All functions are accessible to public
*/

-- Create or replace function to increment food searches
CREATE OR REPLACE FUNCTION increment_food_searches()
RETURNS trigger AS $$
BEGIN
  UPDATE foods 
  SET searches = COALESCE(searches, 0) + 1
  WHERE id = NEW.food_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to increment food searches when a food is viewed
DROP TRIGGER IF EXISTS increment_food_searches_trigger ON restaurant_foods;
CREATE TRIGGER increment_food_searches_trigger
  AFTER INSERT OR UPDATE ON restaurant_foods
  FOR EACH ROW
  EXECUTE FUNCTION increment_food_searches();

-- Create or replace function to get top foods by searches
CREATE OR REPLACE FUNCTION get_top_foods(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  searches integer,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    f.category,
    COALESCE(f.searches, 0) as searches,
    f.image_url
  FROM foods f
  ORDER BY f.searches DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to get top restaurants by visits
CREATE OR REPLACE FUNCTION get_top_restaurants(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  visits integer,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.category,
    COALESCE(r.visits, 0) as visits,
    r.image_url
  FROM restaurants r
  ORDER BY r.visits DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;