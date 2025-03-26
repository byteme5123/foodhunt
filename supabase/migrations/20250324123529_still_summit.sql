/*
  # Add Overview Stats Functions

  1. New Functions
    - get_overview_stats: Returns counts of restaurants, foods, categories
    - get_top_voted_foods: Returns most liked/disliked foods
    - get_top_voted_restaurants: Returns most liked/disliked restaurants
    - get_most_searched_foods: Returns most searched foods

  2. Security
    - Functions are created with SECURITY DEFINER
    - Functions are accessible to public
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_overview_stats();
DROP FUNCTION IF EXISTS get_top_voted_foods(integer);
DROP FUNCTION IF EXISTS get_top_voted_restaurants(integer);
DROP FUNCTION IF EXISTS get_most_searched_foods(integer);

-- Function to get overview stats
CREATE OR REPLACE FUNCTION get_overview_stats()
RETURNS TABLE (
  restaurant_count bigint,
  food_count bigint,
  food_category_count bigint,
  restaurant_category_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM restaurants) as restaurant_count,
    (SELECT COUNT(*) FROM foods) as food_count,
    (SELECT COUNT(DISTINCT category) FROM foods WHERE category IS NOT NULL) as food_category_count,
    (SELECT COUNT(DISTINCT category) FROM restaurants WHERE category IS NOT NULL) as restaurant_category_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get most searched foods
CREATE OR REPLACE FUNCTION get_most_searched_foods(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  image_url text,
  searches bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    f.category,
    f.image_url,
    COALESCE(f.searches, 0) as searches
  FROM foods f
  WHERE COALESCE(f.searches, 0) > 0
  ORDER BY f.searches DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top voted foods
CREATE OR REPLACE FUNCTION get_top_voted_foods(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  image_url text,
  likes bigint,
  dislikes bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH vote_counts AS (
    SELECT 
      food_id,
      COUNT(*) FILTER (WHERE liked = true) as likes,
      COUNT(*) FILTER (WHERE liked = false) as dislikes
    FROM food_votes
    GROUP BY food_id
  )
  SELECT 
    f.id,
    f.name,
    f.category,
    f.image_url,
    COALESCE(vc.likes, 0) as likes,
    COALESCE(vc.dislikes, 0) as dislikes
  FROM foods f
  LEFT JOIN vote_counts vc ON f.id = vc.food_id
  WHERE COALESCE(vc.likes, 0) > 0 OR COALESCE(vc.dislikes, 0) > 0
  ORDER BY COALESCE(vc.likes, 0) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top voted restaurants
CREATE OR REPLACE FUNCTION get_top_voted_restaurants(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  image_url text,
  likes bigint,
  dislikes bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH vote_counts AS (
    SELECT 
      restaurant_id,
      COUNT(*) FILTER (WHERE liked = true) as likes,
      COUNT(*) FILTER (WHERE liked = false) as dislikes
    FROM restaurant_votes
    GROUP BY restaurant_id
  )
  SELECT 
    r.id,
    r.name,
    r.category,
    r.image_url,
    COALESCE(vc.likes, 0) as likes,
    COALESCE(vc.dislikes, 0) as dislikes
  FROM restaurants r
  LEFT JOIN vote_counts vc ON r.id = vc.restaurant_id
  WHERE COALESCE(vc.likes, 0) > 0 OR COALESCE(vc.dislikes, 0) > 0
  ORDER BY COALESCE(vc.likes, 0) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_overview_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_overview_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_top_voted_foods(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_voted_foods(integer) TO anon;
GRANT EXECUTE ON FUNCTION get_top_voted_restaurants(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_voted_restaurants(integer) TO anon;
GRANT EXECUTE ON FUNCTION get_most_searched_foods(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_most_searched_foods(integer) TO anon;