/*
  # Add Random Food Function
  
  1. New Functions
    - `get_random_restaurant_food`: Returns a random food with its restaurant information
  
  2. Description
    - Creates a PostgreSQL function to fetch a random food and its associated restaurant
    - Uses ORDER BY RANDOM() for random selection
*/

CREATE OR REPLACE FUNCTION get_random_restaurant_food()
RETURNS TABLE (
  foods json,
  restaurants json
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', f.id,
      'name', f.name,
      'category', f.category,
      'image_url', f.image_url
    ) as foods,
    json_build_object(
      'name', r.name
    ) as restaurants
  FROM restaurant_foods rf
  JOIN foods f ON rf.food_id = f.id
  JOIN restaurants r ON rf.restaurant_id = r.id
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$;