// app/dashboard/products/add/page.tsx
// Add product page

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/features/product-form'
import { createProduct } from '@/lib/actions/products'

/**
 * Add Product Page
 * 
 * Requirements:
 * - User must have a shop
 * - Load categories for select
 * - Use ProductForm in 'add' mode
 * 
 * Time to complete: 3min
 */
export default async function AddProductPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has a shop
  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!shop) {
    redirect('/dashboard/shop/create')
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
          <h2 className="text-xl font-bold text-red-800 mb-2">Aucune catégorie disponible</h2>
          <p className="text-red-600">
            Contactez l'administrateur pour ajouter des catégories de produits.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ajouter un produit</h1>
        <p className="text-gray-600">Remplissez les informations de votre produit</p>
      </div>

      {/* Form */}
      <ProductForm mode="add" action={createProduct} categories={categories} />
    </div>
  )
}

export const metadata = {
  title: 'Ajouter un produit - Mervason',
  description: 'Ajoutez un nouveau produit à votre boutique',
}
