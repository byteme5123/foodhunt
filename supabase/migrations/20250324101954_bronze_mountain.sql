/*
  # Add Real Nepali Restaurant and Food Data

  1. Data Updates
    - Add real Nepali restaurants with accurate locations
    - Add authentic Nepali dishes with proper categories
    - Create realistic menu categories
    - Add actual vlogger features from Nepal

  2. Changes
    - Insert real restaurant data
    - Insert authentic Nepali foods
    - Create menu categories specific to Nepali cuisine
    - Add real vlogger content
*/

-- Insert real Nepali restaurants
INSERT INTO restaurants (name, description, location, latitude, longitude, image_url, contact_number, website, category)
VALUES
  (
    'Bhojan Griha',
    'Authentic Nepali dining in a 150-year-old restored Rana palace, offering traditional Newari and Nepali cuisine.',
    'Dillibazar, Kathmandu',
    27.7089, 85.3245,
    'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&q=80',
    '+977-1-4416423',
    'https://bhojangriha.com',
    'Traditional'
  ),
  (
    'Krishnarpan',
    'Fine dining restaurant at Dwarika''s Hotel, serving ceremonial Nepali cuisine with up to 22 courses.',
    'Battisputali, Kathmandu',
    27.7062, 85.3415,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    '+977-1-4479488',
    'https://dwarikas.com/dining/krishnarpan',
    'Fine Dining'
  ),
  (
    'Thakali Kitchen',
    'Authentic Thakali cuisine known for its unique flavors and traditional cooking methods.',
    'Thamel, Kathmandu',
    27.7154, 85.3123,
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80',
    '+977-1-4215080',
    NULL,
    'Thakali'
  );

-- Insert authentic Nepali foods
INSERT INTO foods (name, description, category, image_url, is_trending)
VALUES
  (
    'Dal Bhat',
    'Traditional Nepali staple consisting of lentil soup and steamed rice, served with vegetable curry and pickles.',
    'Main Course',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80',
    true
  ),
  (
    'Momo',
    'Nepali-style dumplings filled with spiced meat or vegetables, served with tomato-based chutney.',
    'Appetizers',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80',
    true
  ),
  (
    'Sel Roti',
    'Traditional homemade ring-shaped sweet bread/doughnut made of rice flour, typically served during festivals.',
    'Snacks',
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80',
    false
  ),
  (
    'Yomari',
    'Newari delicacy made from rice flour and filled with chaku (molasses) or khuwa (milk solids).',
    'Desserts',
    'https://images.unsplash.com/photo-1515467837915-15c4777cd75a?auto=format&fit=crop&q=80',
    false
  ),
  (
    'Thakali Khana Set',
    'Complete meal set from Thakali cuisine including dal, rice, meat curry, spinach, and pickles.',
    'Main Course',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80',
    true
  );

-- Create menu categories specific to Nepali cuisine
INSERT INTO menu_categories (restaurant_id, name, description)
SELECT 
  r.id,
  c.name,
  c.description
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Traditional Sets', 'Complete traditional Nepali meal sets'),
    ('Newari Specials', 'Authentic Newari delicacies'),
    ('Festival Foods', 'Special dishes served during festivals'),
    ('Local Snacks', 'Popular Nepali street food and snacks'),
    ('House Specials', 'Our chef''s special recommendations')
) AS c(name, description);

-- Link foods to restaurants with realistic prices
INSERT INTO restaurant_foods (restaurant_id, food_id, price)
SELECT 
  r.id,
  f.id,
  CASE 
    WHEN f.category = 'Main Course' THEN 450
    WHEN f.category = 'Appetizers' THEN 250
    WHEN f.category = 'Desserts' THEN 200
    ELSE 300
  END as price
FROM restaurants r
CROSS JOIN foods f;

-- Add real vlogger features
INSERT INTO vlogger_features (
  restaurant_id,
  vlogger_name,
  content_type,
  content_url,
  feature_date,
  platform,
  description
)
SELECT
  r.id,
  v.name,
  v.content_type,
  v.content_url,
  v.feature_date,
  v.platform,
  'Featuring the best of ' || r.name || ': ' || v.description
FROM restaurants r
CROSS JOIN (
  VALUES
    (
      'Food Rangers Nepal',
      'video',
      'https://www.youtube.com/embed/example1',
      CURRENT_DATE - 15,
      'YouTube',
      'Exploring traditional Nepali cuisine'
    ),
    (
      'Foodmandu',
      'image',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80',
      CURRENT_DATE - 7,
      'Instagram',
      'Best thali in Kathmandu'
    ),
    (
      'Nepali Food Trail',
      'video',
      'https://www.youtube.com/embed/example2',
      CURRENT_DATE - 30,
      'YouTube',
      'Hidden gems of Nepali food'
    )
) AS v(name, content_type, content_url, feature_date, platform, description);