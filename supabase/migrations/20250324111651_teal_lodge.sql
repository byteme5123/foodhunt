/*
  # Update restaurant_foods functions

  1. Changes
    - Drop and recreate get_random_restaurant_food function with correct return type
    - Add safety checks for existing objects

  2. Functions
    - Update get_random_restaurant_food function to return proper record types
*/

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_random_restaurant_food();

-- Recreate the function with proper return type
CREATE OR REPLACE FUNCTION get_random_restaurant_food()
RETURNS TABLE (
  foods foods,
  restaurants restaurants
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    f,
    r
  FROM restaurant_foods rf
  JOIN foods f ON f.id = rf.food_id
  JOIN restaurants r ON r.id = rf.restaurant_id
  ORDER BY random()
  LIMIT 1;
$$;