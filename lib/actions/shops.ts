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
