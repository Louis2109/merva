// lib/actions/shops.ts
// Server Actions for shop management (CRUD operations)

'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

/**
 * Create new shop for authenticated user
 * 
 * Business rules:
 * - One shop per user (enforced by unique constraint on owner_id)
 * - Slug auto-generated from shop name
 * - WhatsApp number validated (Cameroon format: +237XXXXXXXXX)
 * - Shop is_active = true by default
 * 
 * @param formData - Contains name, description, whatsapp_number
 */
export async function createShop(formData: FormData) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Extract form data
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const whatsappNumber = formData.get('whatsapp_number') as string

  // Validation
  if (!name || name.trim().length < 3) {
    console.error('Shop name too short (min 3 characters)')
    redirect('/dashboard/shop/create?error=name_short')
  }

  if (!whatsappNumber) {
    console.error('WhatsApp number required')
    redirect('/dashboard/shop/create?error=whatsapp_required')
  }

  // Validate WhatsApp format (Cameroon: +237XXXXXXXXX, 9 digits after +237)
  // Later: add support for other countries
  const whatsappRegex = /^\+237\d{9}$/
  if (!whatsappRegex.test(whatsappNumber)) {
    console.error('Invalid WhatsApp format:', whatsappNumber)
    redirect('/dashboard/shop/create?error=whatsapp_invalid')
  }

  // Generate slug from name
  const slug = generateSlug(name)

  // Check if user already has a shop
  const { data: existingShop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (existingShop) {
    console.error('User already has a shop')
    redirect('/dashboard?error=shop_exists')
  }

  // Insert shop
  const { error } = await supabase
    .from('shops')
    .insert({
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      whatsapp_number: whatsappNumber,
      owner_id: user.id,
      is_active: true,
    })

  if (error) {
    console.error('Shop creation failed:', error)
    redirect('/dashboard/shop/create?error=creation_failed')
  }

  // Success: redirect to dashboard
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

/**
 * Update shop settings
 * 
 * Business rules:
 * - Only shop owner can update
 * - Can update: name, description, whatsapp_number, logo_url
 * - Name change updates slug (careful with SEO implications)
 * - WhatsApp number validated (Cameroon format)
 * 
 * @param shopId - Shop ID to update
 * @param formData - Contains name, description, whatsapp_number, logo_url
 */
export async function updateShop(shopId: string, formData: FormData) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Verify ownership
  const { data: shop } = await supabase
    .from('shops')
    .select('id, owner_id')
    .eq('id', shopId)
    .single()

  if (!shop || shop.owner_id !== user.id) {
    console.error('Unauthorized: not shop owner')
    redirect('/dashboard?error=unauthorized')
  }

  // Extract form data
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const whatsappNumber = formData.get('whatsapp_number') as string
  const logoUrl = formData.get('logo_url') as string | null

  // Validation
  if (!name || name.trim().length < 3) {
    return { error: 'Le nom de la boutique doit faire au moins 3 caractères' }
  }

  if (!whatsappNumber) {
    return { error: 'Le numéro WhatsApp est requis' }
  }

  // Validate WhatsApp format
  const whatsappRegex = /^\+237\d{9}$/
  if (!whatsappRegex.test(whatsappNumber)) {
    return { error: 'Format WhatsApp invalide. Utilisez +237XXXXXXXXX' }
  }

  // Generate new slug if name changed
  const slug = generateSlug(name)

  // Update shop
  const { error } = await supabase
    .from('shops')
    .update({
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      whatsapp_number: whatsappNumber,
      logo_url: logoUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', shopId)

  if (error) {
    console.error('Shop update failed:', error)
    return { error: 'Erreur lors de la mise à jour. Veuillez réessayer.' }
  }

  // Success
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  revalidatePath(`/shop/${slug}`)
  
  return { success: true }
}

/**
 * Upload shop logo to Supabase Storage
 * 
 * Business rules:
 * - Only shop owner can upload
 * - Max file size: 2MB
 * - Allowed formats: jpg, png, webp
 * - Stored in: shop-logos/{shop_id}/logo.{ext}
 * 
 * @param shopId - Shop ID
 * @param file - Image file
 */
export async function uploadShopLogo(shopId: string, file: File) {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Verify ownership
  const { data: shop } = await supabase
    .from('shops')
    .select('id, owner_id')
    .eq('id', shopId)
    .single()

  if (!shop || shop.owner_id !== user.id) {
    return { error: 'Non autorisé' }
  }

  // Validate file
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    return { error: 'Le fichier est trop volumineux (max 2MB)' }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' }
  }

  // Generate file path
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${shopId}/logo.${ext}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('shop-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite existing logo
    })

  if (uploadError) {
    console.error('Logo upload failed:', uploadError)
    return { error: 'Échec du téléchargement. Veuillez réessayer.' }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('shop-logos')
    .getPublicUrl(filePath)

  return { url: publicUrl }
}
