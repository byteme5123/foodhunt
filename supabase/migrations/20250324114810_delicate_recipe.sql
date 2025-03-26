/*
  # Add food details and retail information

  1. New Columns
    - Added to foods table:
      - `long_description` (text): Detailed description of the food
      - `preparation_tips` (text): Tips for preparing the dish
      - `cultural_significance` (text): Cultural importance and history
      - `ingredients` (text): Main ingredients used

  2. New Table
    - `retail_availability`
      - `id` (uuid, primary key)
      - `food_id` (uuid, foreign key)
      - `store_name` (text)
      - `product_type` (text)
      - `price_range` (text)
      - `location` (text)
      - `availability_notes` (text)

  3. Security
    - Enable RLS on new table
    - Add policies for public read access
*/

-- Add new columns to foods table
ALTER TABLE foods ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS preparation_tips text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS cultural_significance text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS ingredients text;

-- Create retail availability table
CREATE TABLE IF NOT EXISTS retail_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  product_type text NOT NULL,
  price_range text,
  location text,
  availability_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE retail_availability ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Public read access for retail availability"
  ON retail_availability
  FOR SELECT
  TO public
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating timestamps
CREATE TRIGGER update_retail_availability_updated_at
  BEFORE UPDATE ON retail_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();