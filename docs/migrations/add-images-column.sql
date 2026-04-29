-- docs/add-images-column.sql
-- Add images column to products table (text array for multiple images)

-- This migration adds support for multiple product images
-- Run this in Supabase Dashboard → SQL Editor

-- Add images column (text array)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images text[];

-- Optional: Migrate existing image_url data to images array
-- (Run this only if you have existing products with image_url)
UPDATE products
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND images IS NULL;

-- Verify column added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('image_url', 'images');
