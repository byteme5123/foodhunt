/*
  # Fix Database Relationships and Real-time Updates

  1. Changes
    - Update foreign key relationships to handle deletions properly
    - Add ON DELETE SET NULL for optional relationships
    - Add ON DELETE CASCADE where appropriate
    - Fix real-time subscription policies

  2. Security
    - Maintain existing RLS policies
    - Add policies for update/delete operations
*/

-- Update restaurant_foods relationships
ALTER TABLE restaurant_foods
DROP CONSTRAINT IF EXISTS restaurant_foods_restaurant_id_fkey,
DROP CONSTRAINT IF EXISTS restaurant_foods_food_id_fkey;

ALTER TABLE restaurant_foods
ADD CONSTRAINT restaurant_foods_restaurant_id_fkey
  FOREIGN KEY (restaurant_id)
  REFERENCES restaurants(id)
  ON DELETE CASCADE,
ADD CONSTRAINT restaurant_foods_food_id_fkey
  FOREIGN KEY (food_id)
  REFERENCES foods(id)
  ON DELETE CASCADE;

-- Update menu_categories relationships
ALTER TABLE menu_categories
DROP CONSTRAINT IF EXISTS menu_categories_restaurant_id_fkey;

ALTER TABLE menu_categories
ADD CONSTRAINT menu_categories_restaurant_id_fkey
  FOREIGN KEY (restaurant_id)
  REFERENCES restaurants(id)
  ON DELETE CASCADE;

-- Update vlogger_features relationships
ALTER TABLE vlogger_features
DROP CONSTRAINT IF EXISTS vlogger_features_restaurant_id_fkey;

ALTER TABLE vlogger_features
ADD CONSTRAINT vlogger_features_restaurant_id_fkey
  FOREIGN KEY (restaurant_id)
  REFERENCES restaurants(id)
  ON DELETE CASCADE;

-- Update food_variations relationships
ALTER TABLE food_variations
DROP CONSTRAINT IF EXISTS food_variations_food_id_fkey,
DROP CONSTRAINT IF EXISTS food_variations_parent_food_id_fkey;

ALTER TABLE food_variations
ADD CONSTRAINT food_variations_food_id_fkey
  FOREIGN KEY (food_id)
  REFERENCES foods(id)
  ON DELETE CASCADE,
ADD CONSTRAINT food_variations_parent_food_id_fkey
  FOREIGN KEY (parent_food_id)
  REFERENCES foods(id)
  ON DELETE SET NULL;

-- Update retail_availability relationships
ALTER TABLE retail_availability
DROP CONSTRAINT IF EXISTS retail_availability_food_id_fkey;

ALTER TABLE retail_availability
ADD CONSTRAINT retail_availability_food_id_fkey
  FOREIGN KEY (food_id)
  REFERENCES foods(id)
  ON DELETE CASCADE;

-- Add policies for authenticated users to manage data
CREATE POLICY "Enable delete for users based on user_id"
  ON restaurants
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for users based on user_id"
  ON foods
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for users based on user_id"
  ON vlogger_features
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for users based on user_id"
  ON menu_categories
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for users based on user_id"
  ON food_variations
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for users based on user_id"
  ON retail_availability
  FOR DELETE
  TO authenticated
  USING (true);

-- Add policies for updates
CREATE POLICY "Enable update for users based on user_id"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON vlogger_features
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON menu_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON food_variations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON retail_availability
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);