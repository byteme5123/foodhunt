/*
  # Add Coordinates to Restaurants

  1. Changes
    - Add latitude and longitude columns to restaurants table
    - Update existing restaurants with real coordinates
    - Remove map_url column as we're using coordinates instead

  2. Security
    - No changes to RLS policies needed
*/

-- Add coordinate columns if they don't exist
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS longitude numeric;

-- Remove map_url column as we're using coordinates
ALTER TABLE restaurants DROP COLUMN IF EXISTS map_url;

-- Update existing restaurants with real coordinates
UPDATE restaurants
SET 
  latitude = CASE name
    WHEN 'Thamel House Restaurant' THEN 27.7172
    WHEN 'Bajeko Sekuwa' THEN 27.7007
    WHEN 'Newa Lahana' THEN 27.6747
    WHEN 'Bhojan Griha' THEN 27.7089
    WHEN 'Krishnarpan' THEN 27.7062
    WHEN 'Thakali Kitchen' THEN 27.7154
    ELSE NULL
  END,
  longitude = CASE name
    WHEN 'Thamel House Restaurant' THEN 85.3240
    WHEN 'Bajeko Sekuwa' THEN 85.3502
    WHEN 'Newa Lahana' THEN 85.3206
    WHEN 'Bhojan Griha' THEN 85.3245
    WHEN 'Krishnarpan' THEN 85.3415
    WHEN 'Thakali Kitchen' THEN 85.3123
    ELSE NULL
  END;