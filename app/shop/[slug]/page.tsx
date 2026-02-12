// app/shop/[slug]/page.tsx
// Shop detail page showing all shop's active products

import { createServerClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/features/product-card'
import { Store, MessageCircle, ShoppingBag } from 'lucide-react'

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
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-orange-600">
            Accueil
          </Link>
          {' / '}
          <span className="text-gray-900 font-medium">{shop.name}</span>
        </nav>

        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Store className="w-8 h-8 text-orange-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {shop.name}
                </h1>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-2xl">
                {shop.description || 'Bienvenue dans notre boutique!'}
              </p>
            </div>

            {/* WhatsApp Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-md whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contacter</span>
            </a>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produits de cette boutique
          </h2>

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
                {products.length} produit(s) disponible(s)
              </div>
            </>
          ) : (
            // Empty state
            <div className="text-center py-16 bg-white rounded-lg">
              <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 mb-2">
                Aucun produit disponible
              </p>
              <p className="text-gray-400">
                Cette boutique n'a pas encore de produits en vente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ShopDetailPageProps) {
  const supabase = await createServerClient()
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
  }
}
