-- docs/fix-storage-rls.sql
-- Fix RLS policies for product-images bucket
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- Drop old policies (if they exist)
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product images" ON storage.objects;

-- Recreate policies with correct syntax

-- Policy 1: Allow authenticated users to upload (INSERT)
-- Path format: {user_id}/{product_id}/{filename}
-- Check that first folder (user_id) matches authenticated user
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 2: Public read access (SELECT)
-- Anyone can view product images (needed for public pages)
CREATE POLICY "Public read access for product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy 3: Allow users to delete their own images (DELETE)
-- Check that first folder (user_id) matches authenticated user
CREATE POLICY "Users can delete their own product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%product images%';
