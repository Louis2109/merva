/**
 * HELPER: Admin & Role Utilities
 * 
 * Functions to check user permissions and roles
 * Used across the application for authorization
 */

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get current user with role information
 */
export async function getCurrentUser() {
  const supabase = createServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  // Get profile with role info
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, is_admin, is_merchant')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    ...user,
    profile
  }
}

/**
 * Check if current user is admin
 * Returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.profile?.is_admin === true
}

/**
 * Check if current user is merchant
 * Returns boolean
 */
export async function isMerchant(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.profile?.is_merchant === true
}

/**
 * Get user role as string
 * Returns: 'admin' | 'merchant' | 'customer' | null
 */
export async function getUserRole(): Promise<'admin' | 'merchant' | 'customer' | null> {
  const user = await getCurrentUser()
  
  if (!user) return null
  
  if (user.profile.is_admin) return 'admin'
  if (user.profile.is_merchant) return 'merchant'
  return 'customer'
}

/**
 * Require admin access (redirect if not admin)
 * Use in Server Components/Actions that need admin
 */
export async function requireAdmin() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/dashboard') // Redirect non-admins to dashboard
  }
  
  return true
}

/**
 * Require merchant access (redirect if not merchant)
 */
export async function requireMerchant() {
  const merchant = await isMerchant()
  
  if (!merchant) {
    redirect('/dashboard/shop/create') // Redirect to shop creation
  }
  
  return true
}

/**
 * Check if shop can add more products
 * Returns: { canAdd: boolean, current: number, limit: number, remaining: number }
 */
export async function checkProductLimit(shopId: string) {
  const supabase = createServerClient()
  
  // Get shop with plan info
  const { data: shop, error } = await supabase
    .from('shops')
    .select(`
      id,
      plan_id,
      plans (
        name,
        product_limit
      )
    `)
    .eq('id', shopId)
    .single()

  if (error || !shop) {
    throw new Error('Shop not found')
  }

  // Count current products
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)

  if (countError) {
    throw new Error('Failed to count products')
  }

  const current = count || 0
  const limit = (shop.plans as any)?.product_limit || 20
  const remaining = Math.max(0, limit - current)

  return {
    canAdd: current < limit,
    current,
    limit,
    remaining,
    planName: (shop.plans as any)?.name || 'free'
  }
}

/**
 * Get shop owner info
 */
export async function getShopOwner(shopId: string) {
  const supabase = createServerClient()
  
  const { data: shop, error } = await supabase
    .from('shops')
    .select(`
      owner_id,
      profiles (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('id', shopId)
    .single()

  if (error || !shop) {
    return null
  }

  return shop.profiles
}

/**
 * Check if current user owns shop
 */
export async function isShopOwner(shopId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const supabase = createServerClient()
  
  const { data: shop, error } = await supabase
    .from('shops')
    .select('owner_id')
    .eq('id', shopId)
    .single()

  if (error || !shop) return false

  return shop.owner_id === user.id
}
