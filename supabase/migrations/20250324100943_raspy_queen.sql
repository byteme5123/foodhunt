/*
  # Add Restaurant Features

  1. New Tables
    - `menu_categories`: Store restaurant menu categories
    - `vlogger_features`: Store vlogger features for restaurants

  2. Changes
    - Add menu categories and vlogger features tables
    - Add RLS policies for public read access
*/

-- Create menu categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for menu categories"
  ON menu_categories
  FOR SELECT
  TO public
  USING (true);

-- Create vlogger features table
CREATE TABLE IF NOT EXISTS vlogger_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id),
  vlogger_name text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('image', 'video')),
  content_url text NOT NULL,
  feature_date date NOT NULL,
  platform text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vlogger_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for vlogger features"
  ON vlogger_features
  FOR SELECT
  TO public
  USING (true);