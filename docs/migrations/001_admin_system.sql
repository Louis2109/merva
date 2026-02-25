-- ============================================
-- MIGRATION 001: ADMIN SYSTEM + PLANS
-- Date: 2026-02-25
-- Description: Add admin roles, plans, and shop management
-- ============================================

-- ============================================
-- 1. CREATE PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  product_limit INTEGER NOT NULL CHECK (product_limit > 0),
  price INTEGER NOT NULL CHECK (price >= 0), -- Prix en XAF
  features TEXT[] DEFAULT '{}', -- Array de features simples
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans (Free, Standard, Premium)
INSERT INTO plans (name, product_limit, price, features) VALUES
  ('free', 20, 0, ARRAY['Support Email', 'Dashboard Basic']),
  ('standard', 50, 5000, ARRAY['Support WhatsApp', 'Analytics Basic', 'Badge Vérifié']),
  ('premium', 100, 15000, ARRAY['Support Priority', 'Analytics Pro', 'Badge Premium', 'Page Personnalisée'])
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. MODIFY PROFILES TABLE (Add roles)
-- ============================================
-- Add role columns
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_merchant BOOLEAN DEFAULT false;

-- Add index for admin lookup
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- ============================================
-- 3. MODIFY SHOPS TABLE (Add plan + deactivation tracking)
-- ============================================
-- Add plan relationship and tracking columns
ALTER TABLE shops
  ADD COLUMN IF NOT EXISTS plan_id INTEGER REFERENCES plans(id) DEFAULT 1, -- 1 = free plan
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deactivated_reason TEXT,
  ADD COLUMN IF NOT EXISTS deactivated_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id);

-- Add index for plan queries
CREATE INDEX IF NOT EXISTS idx_shops_plan ON shops(plan_id);

-- ============================================
-- 4. TRIGGER: Auto-promote to MERCHANT on shop creation
-- ============================================
CREATE OR REPLACE FUNCTION set_merchant_flag()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically set is_merchant = true when user creates a shop
  UPDATE profiles 
  SET is_merchant = true 
  WHERE id = NEW.owner_id AND is_merchant = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS trigger_set_merchant ON shops;
CREATE TRIGGER trigger_set_merchant
AFTER INSERT ON shops
FOR EACH ROW
EXECUTE FUNCTION set_merchant_flag();

-- ============================================
-- 5. UPDATE RLS POLICIES (Include admin access)
-- ============================================

-- DROP old policies to recreate them with admin access
DROP POLICY IF EXISTS "Anyone can view active shops" ON shops;
DROP POLICY IF EXISTS "Owners can manage their shops" ON shops;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- PROFILES: Everyone can view profiles, users update own, admins see all
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS(
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- SHOPS: Public sees active, owners see theirs, admins see all
CREATE POLICY "Public can view active shops"
  ON shops FOR SELECT
  USING (
    is_active = TRUE 
    OR owner_id = auth.uid() 
    OR EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Shop owners can update their shops"
  ON shops FOR UPDATE
  USING (
    owner_id = auth.uid() 
    OR EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Shop owners can delete their shops"
  ON shops FOR DELETE
  USING (
    owner_id = auth.uid() 
    OR EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authenticated users can create shops"
  ON shops FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- PRODUCTS: Admins can see all products (for moderation)
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (
    (is_active = TRUE AND EXISTS (
      SELECT 1 FROM shops 
      WHERE shops.id = products.shop_id 
      AND shops.is_active = TRUE
    ))
    OR EXISTS (
      SELECT 1 FROM shops 
      WHERE shops.id = products.shop_id 
      AND shops.owner_id = auth.uid()
    )
    OR EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- 6. CREATE VIEW: Shop with Plan Details (Helper)
-- ============================================
CREATE OR REPLACE VIEW shops_with_plans AS
SELECT 
  shops.*,
  plans.name as plan_name,
  plans.product_limit,
  plans.price as plan_price,
  plans.features as plan_features,
  profiles.first_name || ' ' || profiles.last_name as owner_name,
  profiles.avatar_url as owner_avatar,
  (SELECT COUNT(*) FROM products WHERE products.shop_id = shops.id) as products_count
FROM shops
LEFT JOIN plans ON shops.plan_id = plans.id
LEFT JOIN profiles ON shops.owner_id = profiles.id;

-- Grant select on view
GRANT SELECT ON shops_with_plans TO authenticated, anon;

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM profiles WHERE id = user_id AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user can add more products
CREATE OR REPLACE FUNCTION can_add_product(shop_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  -- Get current product count
  SELECT COUNT(*) INTO current_count
  FROM products
  WHERE shop_id = shop_uuid;
  
  -- Get plan limit
  SELECT plans.product_limit INTO max_limit
  FROM shops
  JOIN plans ON shops.plan_id = plans.id
  WHERE shops.id = shop_uuid;
  
  RETURN current_count < max_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get shop product limit info
CREATE OR REPLACE FUNCTION get_product_limit_info(shop_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'current_count', COUNT(products.id),
    'limit', plans.product_limit,
    'remaining', plans.product_limit - COUNT(products.id),
    'plan_name', plans.name
  ) INTO result
  FROM shops
  JOIN plans ON shops.plan_id = plans.id
  LEFT JOIN products ON products.shop_id = shops.id
  WHERE shops.id = shop_uuid
  GROUP BY plans.product_limit, plans.name;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 001 completed successfully!';
  RAISE NOTICE 'Plans created: %', (SELECT COUNT(*) FROM plans);
  RAISE NOTICE 'Profiles updated with role columns';
  RAISE NOTICE 'Shops updated with plan columns';
  RAISE NOTICE 'Triggers and policies updated';
END $$;
