/*
  # Add Voting System

  1. New Tables
    - `food_votes`: Store votes for foods
      - `id` (uuid, primary key)
      - `food_id` (uuid, foreign key)
      - `liked` (boolean)
      - `created_at` (timestamptz)
    
    - `restaurant_votes`: Store votes for restaurants
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key)
      - `liked` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on new tables
    - Add policies for public access
*/

-- Create food votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS food_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  liked boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create restaurant votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS restaurant_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  liked boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'food_votes' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE food_votes ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'restaurant_votes' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE restaurant_votes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_votes' 
    AND policyname = 'Public can vote on foods'
  ) THEN
    CREATE POLICY "Public can vote on foods"
      ON food_votes
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'restaurant_votes' 
    AND policyname = 'Public can vote on restaurants'
  ) THEN
    CREATE POLICY "Public can vote on restaurants"
      ON restaurant_votes
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_food_votes(uuid);
DROP FUNCTION IF EXISTS get_restaurant_votes(uuid);

-- Create or replace functions to get vote counts
CREATE OR REPLACE FUNCTION get_food_votes(p_food_id uuid)
RETURNS TABLE (
  likes bigint,
  dislikes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE liked = true) as likes,
    COUNT(*) FILTER (WHERE liked = false) as dislikes
  FROM food_votes
  WHERE food_id = p_food_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_restaurant_votes(p_restaurant_id uuid)
RETURNS TABLE (
  likes bigint,
  dislikes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE liked = true) as likes,
    COUNT(*) FILTER (WHERE liked = false) as dislikes
  FROM restaurant_votes
  WHERE restaurant_id = p_restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;