// app/admin/products/page.tsx
// Admin Products List - View and moderate all products

import { createServerClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Image from 'next/image'

/**
 * Admin Products List Page
 * 
 * Features:
 * - View all products across all shops
 * - See product details (name, price, shop, status)
 * - Quick moderation actions (coming soon)
 * 
 * Pattern:
 * - Server Component
 * - Fetch data directly from Supabase
 * - Grid layout for product cards
 */
export default async function AdminProductsPage() {
  const supabase = await createServerClient()

  // Fetch all products with shop info
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      images,
      created_at,
      shops (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modération des Produits
          </h1>
          <p className="text-gray-600">
            {products?.length || 0} produit{(products?.length || 0) > 1 ? 's' : ''} listé{(products?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="h-40 bg-gray-100 relative rounded-t-xl overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-gray-400">Pas d'image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.shops?.name}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t">
                    <p className="text-lg font-bold text-orange-600">
                      {new Intl.NumberFormat('fr-CM', {
                        style: 'currency',
                        currency: 'XAF',
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Button size="sm" variant="ghost" className="w-full mt-2">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
