/*
  # Fix top foods function
  
  1. Changes
    - Drop all versions of get_top_foods function to resolve conflicts
    - Recreate function with a single, clear signature
    - Ensure proper permissions are set

  2. Security
    - Function is created with SECURITY DEFINER
    - Results are ordered by searches in descending order
*/

-- Drop all versions of the function
DROP FUNCTION IF EXISTS get_top_foods();
DROP FUNCTION IF EXISTS get_top_foods(limit_count integer);

-- Recreate function with single signature
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_top_foods() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_foods() TO anon;