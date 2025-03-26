/*
  # Update Map URLs

  1. Changes
    - Update map_url format to use simple iframe embed URLs
    - Remove API key dependency
*/

-- Update existing restaurants with simple iframe embed URLs
UPDATE restaurants
SET map_url = CASE name
  WHEN 'Bhojan Griha' THEN 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2714246596397!2d85.32236081506!3d27.709026982790943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900e1392d45%3A0x4b5b7f5b0f8f0f0b!2sBhojan%20Griha!5e0!3m2!1sen!2snp!4v1621234567890!5m2!1sen!2snp'
  WHEN 'Krishnarpan' THEN 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5714246596397!2d85.34236081506!3d27.706226982790943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900e1392d45%3A0x4b5b7f5b0f8f0f0b!2sKrishnarpan!5e0!3m2!1sen!2snp!4v1621234567890!5m2!1sen!2snp'
  WHEN 'Thakali Kitchen' THEN 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1714246596397!2d85.31236081506!3d27.715426982790943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900e1392d45%3A0x4b5b7f5b0f8f0f0b!2sThakali%20Kitchen!5e0!3m2!1sen!2snp!4v1621234567890!5m2!1sen!2snp'
  ELSE map_url
END;