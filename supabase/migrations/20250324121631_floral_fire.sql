/*
  # Update Food Details Schema

  1. Changes
    - Remove preparation_tips column
    - Add origin_of_dish column to foods table
    - Update existing data structure

  2. Security
    - No changes to RLS policies (using existing)
*/

-- Remove preparation_tips column and add origin_of_dish
ALTER TABLE foods DROP COLUMN IF EXISTS preparation_tips;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS origin_of_dish text;

-- Update existing foods with sample origin data
UPDATE foods
SET origin_of_dish = CASE name
  WHEN 'Momo' THEN 'Originally from Tibet, momos were introduced to Nepal by Tibetan traders and have since become an integral part of Nepali cuisine.'
  WHEN 'Dal Bhat' THEN 'A staple dish of Nepal, Dal Bhat has been the traditional meal of the Nepali people for centuries, reflecting the agricultural heritage of the region.'
  WHEN 'Sel Roti' THEN 'Originating from the hills of Nepal, Sel Roti has been a traditional homemade ring-shaped bread/doughnut especially popular during Tihar and Dashain festivals.'
  ELSE 'A traditional dish from Nepal with rich cultural heritage.'
END
WHERE origin_of_dish IS NULL;