// app/products/page.tsx
// Products listing page with category filter

import { createServerClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/features/product-card'
import { CategoryFilter } from '@/components/features/category-filter'
import { ShoppingBag } from 'lucide-react'

/**
 * Products Listing Page
 * 
 * Public page showing all active products with category filtering
 * 
 * Features:
 * - Category filter dropdown
 * - Product grid (responsive)
 * - Only active products (is_active=true, stock>0)
 * - Empty state when no products
 * - Server Component (SEO-friendly)
 * 
 * URL Parameters:
 * - ?category={id} - Filter by category
 * 
 * Data:
 * - Fetch products with optional category filter
 * - Order by newest first
 * - Fetch all categories for filter dropdown
 * 
 * Time to complete: 10min
 */
interface ProductsPageProps {
  searchParams?: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createServerClient()

  // Await searchParams to get category filter
  const params = await searchParams
  const categoryId = params?.category

  // Fetch all categories for filter dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  // Build products query
  let query = supabase
    .from('products')
    .select(`  id,  slug,  title,  price,  images`)
    .eq('is_active', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  // Apply category filter if specified
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: products } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tous les produits
          </h1>
          <p className="text-gray-600 mb-6">
            Parcourez notre catalogue et contactez les vendeurs via WhatsApp
          </p>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <CategoryFilter categories={categories} />
          )}
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.images && product.images.length > 0 ? product.images[0] : null}
                />
              ))}
            </div>

            {/* Product Count */}
            <div className="mt-8 text-center text-gray-600">
              {products.length} produit(s) trouvé(s)
            </div>
          </>
        ) : (
          // Empty state
          <div className="text-center py-16 text-gray-500">
            <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl mb-2">Aucun produit trouvé</p>
            <p className="text-gray-400">
              {categoryId 
                ? 'Essayez de changer de catégorie ou de supprimer le filtre'
                : 'Revenez bientôt pour découvrir de nouveaux produits'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Tous les produits - Mervason',
  description: 'Parcourez tous les produits disponibles sur Mervason',
}
