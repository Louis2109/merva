-- docs/migrations/setup-shop-logos-storage.sql
-- Setup Supabase Storage bucket for shop logos (CRITICAL FIX)
-- This fixes the "Échec du téléchargement" error on /dashboard/settings

-- ============================================
-- STEP 1: Create the bucket
-- ============================================
-- This can be done via Supabase UI OR via SQL

-- Option A: Via SQL (run this in Supabase SQL Editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shop-logos',
  'shop-logos',
  true,  -- Public read access (anyone can view shop logos)
  2097152,  -- 2MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'shop-logos';

-- ============================================
-- STEP 2: Drop old policies (if they exist)
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can upload shop logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read shop logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their shop logo" ON storage.objects;

-- ============================================
-- STEP 3: Create RLS Policies
-- ============================================

-- POLICY 1: Allow authenticated users to upload shop logos
-- Pattern: shop-logos/{shop_id}/logo.{ext}
CREATE POLICY "Authenticated users can upload shop logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shop-logos'
);

-- POLICY 2: Public read access to shop logos
-- Anyone can view shop logos (needed for public shop pages)
CREATE POLICY "Public read shop logos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'shop-logos'
);

-- POLICY 3: Allow authenticated users to delete their own logo
-- Verify that the owner of the shop is deleting (checked in app logic)
CREATE POLICY "Users can delete their shop logo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'shop-logos'
);

-- ============================================
-- STEP 4: Verify policies were created
-- ============================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%shop logo%'
ORDER BY policyname;

-- ============================================
-- STEP 5: Test (in your app)
-- ============================================
-- 1. Go to /dashboard/settings
-- 2. Click "Ajouter un logo"
-- 3. Select an image (JPG, PNG, WebP)
-- 4. Should upload successfully ✅

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If it still fails:
-- 1. Check browser console for error message
-- 2. Check Supabase dashboard → Storage → shop-logos bucket exists
-- 3. Verify RLS policies are enabled (switch toggle)
-- 4. Check auth.users has valid session
-- 5. Check file size < 2MB
-- 6. Check file format is JPG/PNG/WebP
