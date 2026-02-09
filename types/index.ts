// types/index.ts
// Helper types for convenient database type access

import { Database } from './database'

// ============================================
// TABLE ROW TYPES (Read operations)
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Shop = Database['public']['Tables']['shops']['Row']
export type Product = Database['public']['Tables']['products']['Row']

// ============================================
// INSERT TYPES (Create operations)
// ============================================

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type ShopInsert = Database['public']['Tables']['shops']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']

// ============================================
// UPDATE TYPES (Update operations)
// ============================================

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type ShopUpdate = Database['public']['Tables']['shops']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

// ============================================
// JOINED TYPES (For complex queries)
// ============================================

/**
 * Product with related shop data
 * Used when displaying products with seller info
 */
export type ProductWithShop = Product & {
  shops: Shop | null
}

/**
 * Product with category and shop
 * Used on product detail page
 */
export type ProductWithDetails = Product & {
  shops: Shop | null
  categories: Category | null
}

/**
 * Shop with owner profile
 * Used on shop detail page
 */
export type ShopWithOwner = Shop & {
  profiles: Profile | null
}
