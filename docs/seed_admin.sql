-- ============================================
-- SEED ADMIN USER
-- Date: 2026-02-25
-- Description: Create initial admin user for Mervason
-- ============================================

-- ⚠️ IMPORTANT: You must first create the user in Supabase Auth
-- Go to: Supabase Dashboard → Authentication → Users → Add User
-- 
-- Email: admin@mervason.com
-- Password: admin123 (change after first login!)
-- 
-- After creating the user, copy the UUID and replace in the INSERT below
-- OR run this after the user signs up normally

-- ============================================
-- METHOD 1: Update existing user to admin
-- ============================================
-- Replace YOUR_USER_EMAIL with the actual email
-- This will promote any existing user to admin

UPDATE profiles 
SET 
  is_admin = true,
  first_name = 'Admin',
  last_name = 'Mervason',
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@mervason.com'
);

-- Verify admin created
SELECT 
  profiles.id,
  auth.users.email,
  profiles.first_name,
  profiles.last_name,
  profiles.is_admin,
  profiles.is_merchant
FROM profiles
JOIN auth.users ON profiles.id = auth.users.id
WHERE profiles.is_admin = true;

-- ============================================
-- METHOD 2: Direct insert (if you have the UUID)
-- ============================================
-- Uncomment and replace <USER_UUID> with actual UUID from auth.users

-- INSERT INTO profiles (id, first_name, last_name, is_admin, is_merchant)
-- VALUES (
--   '<USER_UUID>', -- Replace with actual UUID
--   'Admin',
--   'Mervason',
--   true,
--   false
-- )
-- ON CONFLICT (id) DO UPDATE
-- SET is_admin = true;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check admin users
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.is_merchant,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;

-- 2. Check all users with roles
SELECT 
  u.email,
  p.is_admin,
  p.is_merchant,
  CASE 
    WHEN p.is_admin THEN 'Admin'
    WHEN p.is_merchant THEN 'Merchant'
    ELSE 'Customer'
  END as role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY p.is_admin DESC, p.is_merchant DESC;

-- ============================================
-- NOTES
-- ============================================
-- 
-- SECURITY REMINDERS:
-- 1. Change admin password immediately after first login
-- 2. Never commit real admin credentials to git
-- 3. Use strong passwords in production (min 12 chars)
-- 4. Consider 2FA for admin accounts (Supabase supports this)
-- 
-- ADMIN CAPABILITIES:
-- - View all shops (active and inactive)
-- - Suspend/activate shops
-- - Change shop plans
-- - View all users
-- - Promote users to merchant (manual if needed)
-- 
-- DEFAULT BEHAVIOR:
-- - New signups → Customer (is_admin=false, is_merchant=false)
-- - Create shop → Auto merchant (is_merchant=true via trigger)
-- - Admin promotion → Manual via SQL or admin dashboard
-- 
