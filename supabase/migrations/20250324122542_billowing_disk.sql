/*
  # Add serving size, prep time, and spice level to foods table

  1. Changes
    - Add new columns to foods table:
      - serving_size (text)
      - prep_time (text)
      - spice_level (text)
    - Add sample data for existing foods
*/

-- Add new columns
ALTER TABLE foods ADD COLUMN IF NOT EXISTS serving_size text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS prep_time text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS spice_level text;

-- Update existing foods with sample data
UPDATE foods
SET 
  serving_size = CASE name
    WHEN 'Momo' THEN '2-3 People'
    WHEN 'Dal Bhat' THEN '2-3 People'
    WHEN 'Sel Roti' THEN '3-4 People'
    WHEN 'Thakali Set' THEN '2-3 People'
    ELSE '2-3 People'
  END,
  prep_time = CASE name
    WHEN 'Momo' THEN '30-45 minutes'
    WHEN 'Dal Bhat' THEN '45-60 minutes'
    WHEN 'Sel Roti' THEN '30-45 minutes'
    WHEN 'Thakali Set' THEN '45-60 minutes'
    ELSE '30-45 minutes'
  END,
  spice_level = CASE name
    WHEN 'Momo' THEN 'Medium Hot'
    WHEN 'Dal Bhat' THEN 'Medium'
    WHEN 'Sel Roti' THEN 'Mild'
    WHEN 'Thakali Set' THEN 'Medium Hot'
    ELSE 'Medium'
  END
WHERE serving_size IS NULL;