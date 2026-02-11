-- docs/setup-storage.sql
-- Setup Supabase Storage bucket for product images

-- Step 1: Create storage bucket (run this in Supabase Dashboard → Storage → New bucket)
-- OR use the UI: Storage → Create bucket → Name: "product-images" → Public bucket: YES

-- Step 2: Run this SQL to set up RLS policies for the bucket
-- Path: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- Create bucket programmatically (if not already created via UI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true, -- Public access (anyone can read)
  5242880, -- 5MB limit per file (5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy 1: Allow authenticated users to upload (INSERT)
-- Only shop owners can upload images for their products
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy 2: Public read access (SELECT)
-- Anyone can view product images (needed for public product pages)
CREATE POLICY "Public read access for product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- RLS Policy 3: Allow authenticated users to delete their own images (DELETE)
-- Only shop owners can delete their own product images
CREATE POLICY "Users can delete their own product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Verify bucket creation
SELECT * FROM storage.buckets WHERE id = 'product-images';

-- Bucket structure:
-- product-images/
--   {user_id}/
--     {product_id}/
--       {timestamp}_{filename}.webp

-- Example path: product-images/uuid-user/uuid-product/1707562800_iphone.webp
