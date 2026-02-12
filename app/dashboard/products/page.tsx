// app/dashboard/products/page.tsx
// Products list page with table and actions

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Package } from 'lucide-react'
import { DeleteProductButton } from '@/components/features/delete-product-button'
import { formatPrice } from '@/lib/utils'

/**
 * Products List Page
 * 
 * Features:
 * - Table with all products for current shop
 * - Zebra stripes (alternate row colors)
 * - Price formatted as XAF
 * - Edit/Delete actions
 * - Add product button
 * 
 * Time to complete: 7min
 */
export default async function ProductsPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Get user's shop
  const { data: shop } = await supabase
    .from('shops')
    .select('id, name')
    .eq('owner_id', user.id)
    .single()

  if (!shop) {
    redirect('/dashboard/shop/create')
  }

  // Get all products for this shop with category info
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes produits</h1>
          <p className="text-gray-600">{shop.name}</p>
        </div>
        <Link href="/dashboard/products/add">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      {!products || products.length === 0 ? (
        // Empty State
        <Card variant="glass" className="text-center py-12">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl mb-2">Aucun produit</CardTitle>
            <CardDescription>
              Commencez par ajouter votre premier produit à vendre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/products/add">
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter mon premier produit
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // Products Table
        <Card variant="bordered">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Product Image */}
                    <td className="px-6 py-4">
                      {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>

                    {/* Product Title */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.title}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description.substring(0, 60)}
                          {product.description.length > 60 && '...'}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {product.categories?.name || 'N/A'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.price)} XAF
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock < 5 
                          ? 'text-orange-600' 
                          : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteProductButton 
                          productId={product.id} 
                          productTitle={product.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{products.length}</span> produit(s)
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export const metadata = {
  title: 'Mes produits - Mervason',
  description: 'Gérez vos produits',
}
