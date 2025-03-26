/*
  # Add functions for retrieving top items
  
  1. Changes
    - Add function to get top foods by search count
    - Add function to get top restaurants by visit count
    - Initialize counts to 0 where they are NULL

  2. Security
    - Functions are created with SECURITY DEFINER
    - Functions return a limited number of results (top 5)
    - Results are ordered by counts in descending order

  3. Notes
    - Using COALESCE to handle NULL values
    - Limiting results to 5 items for performance
*/

-- Initialize NULL counts to 0
UPDATE foods SET searches = 0 WHERE searches IS NULL;
UPDATE restaurants SET visits = 0 WHERE visits IS NULL;

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