/*
  # Add sample data for restaurants and foods

  1. Schema Updates
    - Add category column to restaurants table
    - Add category column to foods table
  
  2. Sample Data
    - Add 6 popular Nepali restaurants with details
    - Add 8 popular Nepali dishes with categories
*/

-- Add category columns to tables
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS category text;

-- Insert sample restaurants
INSERT INTO restaurants (id, name, description, location, image_url, contact_number, website, visits, rating, category)
VALUES
  (
    gen_random_uuid(),
    'Momo Central',
    'Famous for authentic Nepali momos and other local delicacies',
    'Thamel, Kathmandu',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    '+977-1-4444123',
    'https://momocentral.com',
    1250,
    4.8,
    'Local Restaurant'
  ),
  (
    gen_random_uuid(),
    'Thakali Kitchen',
    'Traditional Thakali cuisine served in authentic style',
    'Lazimpat, Kathmandu',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    '+977-1-4445789',
    'https://thakalikitchen.com',
    980,
    4.6,
    'Traditional Restaurant'
  ),
  (
    gen_random_uuid(),
    'Newari Bhansa Ghar',
    'Authentic Newari cuisine in traditional settings',
    'Patan, Lalitpur',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    '+977-1-5555123',
    'https://newaribhansa.com',
    850,
    4.5,
    'Traditional Restaurant'
  ),
  (
    gen_random_uuid(),
    'Himalayan Curry House',
    'Best curry dishes from the Himalayas',
    'Bouddha, Kathmandu',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    '+977-1-4446789',
    'https://himalayancurry.com',
    760,
    4.4,
    'Local Restaurant'
  ),
  (
    gen_random_uuid(),
    'Dal Bhat Power',
    'Traditional Nepali dal bhat thali',
    'Durbar Marg, Kathmandu',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    '+977-1-4447890',
    'https://dalbhatpower.com',
    690,
    4.3,
    'Local Restaurant'
  ),
  (
    gen_random_uuid(),
    'Sherpa Kitchen',
    'Authentic Sherpa cuisine from the mountains',
    'Jhamsikhel, Lalitpur',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    '+977-1-5556789',
    'https://sherpakitchen.com',
    580,
    4.2,
    'Traditional Restaurant'
  );

-- Insert sample foods
INSERT INTO foods (id, name, description, image_url, searches, is_trending, category)
VALUES
  (
    gen_random_uuid(),
    'Buff Momo',
    'Nepali-style dumplings filled with spiced buffalo meat',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    2500,
    true,
    'Dumplings'
  ),
  (
    gen_random_uuid(),
    'Thakali Set',
    'Complete traditional Thakali meal with dal, rice, and curry',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    2100,
    true,
    'Traditional'
  ),
  (
    gen_random_uuid(),
    'Sel Roti',
    'Traditional Nepali ring-shaped sweet bread',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    1800,
    true,
    'Snacks'
  ),
  (
    gen_random_uuid(),
    'Choila',
    'Spicy grilled buffalo meat, Newari style',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    1600,
    true,
    'Traditional'
  ),
  (
    gen_random_uuid(),
    'Yomari',
    'Steamed rice flour dumpling with sweet filling',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    1400,
    false,
    'Traditional'
  ),
  (
    gen_random_uuid(),
    'Dhido',
    'Traditional Nepali food made from buckwheat flour',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    1200,
    false,
    'Traditional'
  ),
  (
    gen_random_uuid(),
    'Samay Baji',
    'Traditional Newari food platter',
    'https://images.unsplash.com/photo-1625398407796-82650a8c2462?w=800',
    1000,
    false,
    'Traditional'
  ),
  (
    gen_random_uuid(),
    'Aloo Tama',
    'Bamboo shoot curry with potatoes',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800',
    800,
    false,
    'Curry'
  );