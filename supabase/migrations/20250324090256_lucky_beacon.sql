/*
  # Initial Schema for NepalEats Platform

  1. New Tables
    - `restaurants`
      - Basic restaurant information
      - Location data for mapping
      - Visit counts and ratings
    - `foods`
      - Food items with search tracking
      - Relationships to restaurants
    - `visits`
      - User visit records
    - `food_reviews`
      - User reviews and ratings for foods
    
  2. Security
    - Enable RLS on all tables
    - Policies for public read access
    - Authenticated user policies for creating/updating
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  image_url text,
  contact_number text,
  website text,
  visits integer DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  searches integer DEFAULT 0,
  restaurant_id uuid REFERENCES restaurants(id),
  is_trending boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  restaurant_id uuid REFERENCES restaurants(id),
  visited_at timestamptz DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Create food reviews table
CREATE TABLE IF NOT EXISTS food_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid REFERENCES foods(id),
  user_id uuid REFERENCES auth.users(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for restaurants"
  ON restaurants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create restaurants"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Public read access for foods"
  ON foods
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can create their own visits"
  ON visits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own visits"
  ON visits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public read access for food reviews"
  ON food_reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON food_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);