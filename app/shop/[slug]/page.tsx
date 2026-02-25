// app/shop/[slug]/page.tsx
// Shop detail page showing all shop's active products

import { createServerClient, createAnonymousClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/features/product-card'
import { Badge } from '@/components/ui/badge'
import { Store, MessageCircle, ShoppingBag, ArrowLeft, Package } from 'lucide-react'
import type { Metadata } from 'next'

/**
 * Shop Detail Page
 * 
 * Public page showing shop information and all its active products
 * 
 * Features:
 * - Shop header (name, description, WhatsApp)
 * - Products grid (shop's active products only)
 * - Empty state if no products
 * - Breadcrumb navigation
 * - Server Component (SEO-friendly)
 * 
 * Data:
 * - Fetch shop by slug
 * - Fetch all active products for this shop
 * - Show 404 if shop not found
 * 
 * Time to complete: 10min
 */
interface ShopDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const supabase = await createServerClient()

  // Await params to get slug
  const { slug } = await params

  // Fetch shop info
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .single()

  // Show 404 if shop not found
  if (!shop) {
    notFound()
  }

  // Fetch all active products for this shop
  const { data: products } = await supabase
    .from('products')
    .select(`  id,  slug,  title,  price,  images`)
    .eq('shop_id', shop.id)
    .eq('is_active', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  // Format WhatsApp URL for contact
  const whatsappUrl = `https://wa.me/${shop.whatsapp_number}?text=${encodeURIComponent(
    `Bonjour, j'aimerais en savoir plus sur votre boutique ${shop.name}`
  )}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        {/* Shop Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {/* Shop Icon */}
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Store className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {shop.name}
                    </h1>
                    <Badge variant={shop.is_active ? 'success' : 'default'}>
                      {shop.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {shop.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {shop.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Count */}
              <div className="flex items-center gap-2 text-gray-600 mt-4">
                <Package className="w-5 h-5 text-gray-400" />
                <span>
                  {products?.length || 0} produit{(products?.length || 0) > 1 ? 's' : ''} disponible{(products?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            {shop.whatsapp_number && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contacter</span>
              </a>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title}
                price={product.price}
                imageUrl={product.images?.[0] || null}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Cette boutique n'a pas encore de produits en stock.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Découvrir d'autres produits
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Generate Static Params for ISR
 * Pre-render all active shops at build time
 */
export async function generateStaticParams() {
  const supabase = createAnonymousClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('slug')
    .eq('is_active', true)

  return shops?.map((shop) => ({
    slug: shop.slug,
  })) || []
}

/**
 * Generate Metadata for SEO
 */
export async function generateMetadata({ params }: ShopDetailPageProps): Promise<Metadata> {
  const supabase = createAnonymousClient()
  const { slug } = await params

  const { data: shop } = await supabase
    .from('shops')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!shop) {
    return {
      title: 'Boutique introuvable - Mervason',
    }
  }

  return {
    title: `${shop.name} - Mervason`,
    description: shop.description || `Découvrez les produits de ${shop.name} sur Mervason`,
    openGraph: {
      title: shop.name,
      description: shop.description || `Boutique ${shop.name}`,
      type: 'website',
    },
  }
}
