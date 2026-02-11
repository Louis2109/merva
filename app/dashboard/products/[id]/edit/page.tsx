// app/dashboard/products/[id]/edit/page.tsx
// Edit product page

import { createServerClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProductForm } from '@/components/features/product-form'
import { updateProduct } from '@/lib/actions/products'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Edit Product Page
 * 
 * Requirements:
 * - User must own the product's shop
 * - Load existing product data
 * - Load categories
 * - Use ProductForm in 'edit' mode with prefilled data
 * 
 * Time to complete: 5min
 */
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Get product with ownership verification
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      shops!inner(
        id,
        owner_id,
        name
      )
    `)
    .eq('id', id)
    .single()

  // Check if product exists
  if (!product) {
    notFound()
  }

  // Verify ownership
  if (product.shops.owner_id !== user.id) {
    redirect('/dashboard/products?error=unauthorized')
  }

  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (!categories || categories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-600">Aucune catégorie disponible.</p>
        </div>
      </div>
    )
  }

  // Bind product ID to updateProduct action
  const updateProductWithId = updateProduct.bind(null, id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Modifier le produit</h1>
        <p className="text-gray-600">{product.shops.name}</p>
      </div>

      {/* Form */}
      <ProductForm 
        mode="edit" 
        action={updateProductWithId} 
        categories={categories}
        product={product}
      />
    </div>
  )
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('title')
    .eq('id', id)
    .single()

  return {
    title: `Modifier ${product?.title || 'produit'} - Mervason`,
    description: 'Modifiez les informations de votre produit',
  }
}
