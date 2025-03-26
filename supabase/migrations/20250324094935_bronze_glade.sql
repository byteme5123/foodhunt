/*
  # Update Food Variations Schema

  1. Changes
    - Add parent_food_id column to food_variations table
    - Link existing variations to their parent foods
    - Add foreign key constraint to ensure data integrity

  2. Security
    - No changes to RLS policies (already exist)
*/

-- Add parent_food_id column to food_variations if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_variations' AND column_name = 'parent_food_id'
  ) THEN
    ALTER TABLE food_variations ADD COLUMN parent_food_id uuid REFERENCES foods(id);
  END IF;
END $$;

-- Update existing variations to link them to parent foods
UPDATE food_variations v
SET parent_food_id = f.id
FROM foods f
WHERE v.food_id = f.id;