// lib/actions/upload.ts
// Server Actions for file upload to Supabase Storage

'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Upload product image to Supabase Storage
 * 
 * Business rules:
 * - User must be authenticated
 * - Max 5MB per file
 * - Allowed: .jpg, .jpeg, .png, .webp
 * - Storage path: product-images/{user_id}/{product_id}/{timestamp}_{filename}
 * - Returns public URL on success
 * 
 * @param formData - Contains file and productId
 * @returns Public URL of uploaded image
 */
export async function uploadProductImage(formData: FormData): Promise<string> {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Extract form data
  const file = formData.get('file') as File
  const productId = formData.get('productId') as string

  if (!file || !productId) {
    throw new Error('File and productId required')
  }

  // Validate file size (5MB = 5 * 1024 * 1024 bytes)
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 5MB limit')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: .jpg, .png, .webp')
  }

  // Generate unique filename: {timestamp}_{original_name}
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  // Storage path: user_id/product_id/filename
  const filePath = `${user.id}/${productId}/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false, // Don't overwrite existing files
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)

  return publicUrl
}

/**
 * Delete product image from Supabase Storage
 * 
 * @param imageUrl - Full public URL of image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Extract file path from URL
  // URL format: https://{project}.supabase.co/storage/v1/object/public/product-images/{path}
  const urlParts = imageUrl.split('/product-images/')
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL')
  }
  const filePath = urlParts[1]

  // Verify user owns this file (path starts with user_id)
  if (!filePath.startsWith(user.id)) {
    throw new Error('Unauthorized: Not your image')
  }

  // Delete from storage
  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath])

  if (error) {
    console.error('Delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}
