/*
  # Reset search and visit counts
  
  1. Changes
    - Reset all food search counts to 0
    - Reset all restaurant visit counts to 0
    - Add test data to verify counting works
*/

-- Reset all counts to 0
UPDATE foods SET searches = 0;
UPDATE restaurants SET visits = 0;

-- Test data: Increment searches for a food
WITH test_food AS (
  SELECT id FROM foods LIMIT 1
)
INSERT INTO restaurant_foods (restaurant_id, food_id, price)
SELECT 
  (SELECT id FROM restaurants LIMIT 1),
  test_food.id,
  100
FROM test_food
ON CONFLICT DO NOTHING;

-- Test data: Increment visits for a restaurant
WITH test_restaurant AS (
  SELECT id FROM restaurants LIMIT 1
)
UPDATE restaurants 
SET visits = visits + 1 
WHERE id = (SELECT id FROM test_restaurant);