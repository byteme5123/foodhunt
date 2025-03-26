/*
  # Update Google Maps URLs with API Key Support

  1. Changes
    - Update map_url format to support API key
    - Add proper Google Maps embed URLs for existing restaurants
*/

-- Update existing restaurants with proper Google Maps embed URLs
UPDATE restaurants
SET map_url = CASE name
  WHEN 'Bhojan Griha' THEN 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Bhojan+Griha,Kathmandu,Nepal'
  WHEN 'Krishnarpan' THEN 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Krishnarpan+Dwarika+Hotel,Kathmandu,Nepal'
  WHEN 'Thakali Kitchen' THEN 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Thakali+Kitchen,Thamel,Kathmandu,Nepal'
  ELSE map_url
END;