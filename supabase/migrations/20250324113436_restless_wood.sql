/*
  # Fix top items functions
  
  1. Changes
    - Drop existing top items functions to resolve conflicts
    - Recreate functions with single, clear signatures
    - Ensure proper permissions are set

  2. Security
    - Functions are created with SECURITY DEFINER
    - Results are ordered by counts in descending order
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS get_top_foods();
DROP FUNCTION IF EXISTS get_top_restaurants();
DROP FUNCTION IF EXISTS get_top_restaurants(limit_count integer);

-- Function to get top foods
CREATE OR REPLACE FUNCTION get_top_foods()
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  searches integer,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.name, f.category, COALESCE(f.searches, 0) as searches, f.image_url
  FROM foods f
  ORDER BY f.searches DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top restaurants
CREATE OR REPLACE FUNCTION get_top_restaurants()
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  visits integer,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.category, COALESCE(r.visits, 0) as visits, r.image_url
  FROM restaurants r
  ORDER BY r.visits DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_top_foods() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_foods() TO anon;
GRANT EXECUTE ON FUNCTION get_top_restaurants() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_restaurants() TO anon;