// lib/actions/products.ts
// Server Actions for product management (CRUD operations)

'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

/**
 * Create new product for current shop
 * 
 * Business rules:
 * - User must own a shop
 * - Price must be positive
 * - Stock must be >= 0
 * - Slug auto-generated from title
 * - Product is_active = true by default
 * 
 * @param formData - Contains title, description, price, stock, category_id
 */
export async function createProduct(formData: FormData) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Get user's shop
  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!shop) {
    console.error('User has no shop')
    redirect('/dashboard/shop/create')
  }

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const categoryId = formData.get('category_id') as string
  const imagesJson = formData.get('images') as string

  // Parse images array
  let images: string[] = []
  if (imagesJson) {
    try {
      images = JSON.parse(imagesJson)
    } catch (e) {
      console.error('Failed to parse images JSON:', e)
    }
  }

  // Validation
  if (!title || title.trim().length < 3) {
    console.error('Product title too short (min 3 characters)')
    redirect('/dashboard/products/add?error=title_short')
  }

  if (!price || price <= 0) {
    console.error('Invalid price:', price)
    redirect('/dashboard/products/add?error=price_invalid')
  }

  if (isNaN(stock) || stock < 0) {
    console.error('Invalid stock:', stock)
    redirect('/dashboard/products/add?error=stock_invalid')
  }

  if (!categoryId) {
    console.error('Category required')
    redirect('/dashboard/products/add?error=category_required')
  }

  // Generate slug
  const slug = generateSlug(title)

  // Insert product
  const { error } = await supabase
    .from('products')
    .insert({
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      price,
      stock,
      category_id: categoryId,
      shop_id: shop.id,
      is_active: true,
      images: images.length > 0 ? images : null,
    })

  if (error) {
    console.error('Product creation failed:', error)
    redirect('/dashboard/products/add?error=creation_failed')
  }

  // Success: redirect to products list
  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

/**
 * Update existing product
 * 
 * Business rules:
 * - User must own the product's shop
 * - Cannot change shop_id or slug
 * - Price/stock validation same as create
 * 
 * @param productId - Product ID to update
 * @param formData - Updated fields
 */
export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Verify ownership (user owns the shop that owns the product)
  const { data: product } = await supabase
    .from('products')
    .select('shop_id, shops!inner(owner_id)')
    .eq('id', productId)
    .single()

  if (!product || (product.shops as any).owner_id !== user.id) {
    console.error('Unauthorized: Product not owned by user')
    redirect('/dashboard/products?error=unauthorized')
  }

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const categoryId = formData.get('category_id') as string
  const isActive = formData.get('is_active') === 'true'
  const imagesJson = formData.get('images') as string

  // Parse images array
  let images: string[] = []
  if (imagesJson) {
    try {
      images = JSON.parse(imagesJson)
    } catch (e) {
      console.error('Failed to parse images JSON:', e)
    }
  }

  // Validation
  if (!title || title.trim().length < 3) {
    console.error('Product title too short')
    redirect(`/dashboard/products/${productId}/edit?error=title_short`)
  }

  if (!price || price <= 0) {
    console.error('Invalid price')
    redirect(`/dashboard/products/${productId}/edit?error=price_invalid`)
  }

  if (isNaN(stock) || stock < 0) {
    console.error('Invalid stock')
    redirect(`/dashboard/products/${productId}/edit?error=stock_invalid`)
  }

  // Update product
  const { error } = await supabase
    .from('products')
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      price,
      stock,
      category_id: categoryId,
      is_active: isActive,
      images: images.length > 0 ? images : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)

  if (error) {
    console.error('Product update failed:', error)
    redirect(`/dashboard/products/${productId}/edit?error=update_failed`)
  }

  // Success: redirect to products list
  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

/**
 * Delete product
 * 
 * Business rules:
 * - User must own the product's shop
 * - Soft delete preferred (set is_active = false) for MVP
 * - Hard delete for now (can switch to soft delete later)
 * 
 * @param productId - Product ID to delete
 */
export async function deleteProduct(productId: string) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('shop_id, shops!inner(owner_id)')
    .eq('id', productId)
    .single()

  if (!product || (product.shops as any).owner_id !== user.id) {
    console.error('Unauthorized: Product not owned by user')
    redirect('/dashboard/products?error=unauthorized')
  }

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Product deletion failed:', error)
    redirect('/dashboard/products?error=deletion_failed')
  }

  // Success: redirect to products list
  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

/**
 * Toggle product active status
 * Quick action to enable/disable product without full edit
 * 
 * @param productId - Product ID
 * @param isActive - New active status
 */
export async function toggleProductStatus(productId: string, isActive: boolean) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('shop_id, shops!inner(owner_id)')
    .eq('id', productId)
    .single()

  if (!product || (product.shops as any).owner_id !== user.id) {
    console.error('Unauthorized')
    redirect('/dashboard/products?error=unauthorized')
  }

  // Toggle status
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)

  if (error) {
    console.error('Status toggle failed:', error)
    redirect('/dashboard/products?error=toggle_failed')
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}
