// lib/actions/admin.ts
// Server Actions for admin operations

'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'

/**
 * Suspend a shop
 * 
 * Actions:
 * - Set is_active = false
 * - Record deactivation timestamp
 * - Record reason
 * - TODO: Send email notification to owner
 * 
 * @param shopId - Shop UUID
 * @param reason - Reason for suspension
 */
export async function suspendShop(shopId: string, reason: string) {
  // Security check
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin only')
  }

  const supabase = await createServerClient()

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Update shop
  const { error } = await supabase
    .from('shops')
    .update({
      is_active: false,
      deactivated_at: new Date().toISOString(),
      deactivated_reason: reason,
      deactivated_by: user.id,
      updated_by: user.id,
    })
    .eq('id', shopId)

  if (error) {
    console.error('[ADMIN] Suspend shop error:', error)
    throw new Error('Échec suspension boutique')
  }

  // TODO: Send email notification to shop owner
  // await sendShopSuspensionEmail(shopId, reason)

  // Revalidate admin pages
  revalidatePath('/admin')
  revalidatePath('/admin/shops')
  revalidatePath(`/admin/shops/${shopId}`)

  return { success: true }
}

/**
 * Activate a shop
 * 
 * Actions:
 * - Set is_active = true
 * - Clear deactivation fields
 * - TODO: Send email notification to owner
 * 
 * @param shopId - Shop UUID
 */
export async function activateShop(shopId: string) {
  // Security check
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin only')
  }

  const supabase = await createServerClient()

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Update shop
  const { error } = await supabase
    .from('shops')
    .update({
      is_active: true,
      deactivated_at: null,
      deactivated_reason: null,
      deactivated_by: null,
      updated_by: user.id,
    })
    .eq('id', shopId)

  if (error) {
    console.error('[ADMIN] Activate shop error:', error)
    throw new Error('Échec activation boutique')
  }

  // TODO: Send email notification to shop owner
  // await sendShopActivationEmail(shopId)

  // Revalidate admin pages
  revalidatePath('/admin')
  revalidatePath('/admin/shops')
  revalidatePath(`/admin/shops/${shopId}`)

  return { success: true }
}

/**
 * Upgrade shop plan
 * 
 * Actions:
 * - Change plan_id
 * - Update product_limit (not needed, derived from join)
 * - TODO: Send email notification to owner
 * 
 * @param shopId - Shop UUID
 * @param planId - New plan ID (1=free, 2=standard, 3=premium)
 */
export async function upgradeShopPlan(shopId: string, planId: number) {
  // Security check
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin only')
  }

  // Validate plan ID
  if (![1, 2, 3].includes(planId)) {
    throw new Error('Invalid plan ID')
  }

  const supabase = await createServerClient()

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Update shop plan
  const { error } = await supabase
    .from('shops')
    .update({
      plan_id: planId,
      updated_by: user.id,
    })
    .eq('id', shopId)

  if (error) {
    console.error('[ADMIN] Upgrade plan error:', error)
    throw new Error('Échec changement de plan')
  }

  // TODO: Send email notification to shop owner
  // await sendPlanUpgradeEmail(shopId, planId)

  // Revalidate admin pages
  revalidatePath('/admin')
  revalidatePath('/admin/shops')
  revalidatePath(`/admin/shops/${shopId}`)

  return { success: true }
}

/**
 * Get all shops with filters
 * Helper for admin pages
 * 
 * @param filter - 'all' | 'active' | 'suspended'
 */
export async function getShopsAdmin(filter: 'all' | 'active' | 'suspended' = 'all') {
  // Security check
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin only')
  }

  const supabase = await createServerClient()

  // Base query
  let query = supabase
    .from('shops')
    .select(`
      id,
      name,
      slug,
      is_active,
      created_at,
      deactivated_at,
      deactivated_reason,
      plan_id,
      plans (
        name,
        product_limit,
        price
      ),
      profiles (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  // Apply filter
  if (filter === 'active') {
    query = query.eq('is_active', true)
  } else if (filter === 'suspended') {
    query = query.eq('is_active', false)
  }

  const { data, error } = await query

  if (error) {
    console.error('[ADMIN] Get shops error:', error)
    throw new Error('Échec récupération boutiques')
  }

  return data
}

/**
 * Get shop details with products count
 */
export async function getShopDetailsAdmin(shopId: string) {
  // Security check
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin only')
  }

  const supabase = await createServerClient()

  // Get shop with all relations
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select(`
      *,
      plans (
        name,
        product_limit,
        price,
        features
      ),
      profiles (
        id,
        first_name,
        last_name,
        avatar_url,
        is_merchant
      )
    `)
    .eq('id', shopId)
    .single()

  if (shopError || !shop) {
    throw new Error('Boutique introuvable')
  }

  // Count products
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)

  // Get products list
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    shop,
    productsCount: productsCount || 0,
    products: products || [],
  }
}
