// app/products/[slug]/page.tsx
// Product detail page with gallery and WhatsApp contact button

import { createServerClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/features/product-gallery'
import { WhatsAppButton } from '@/components/features/whatsapp-button'
import { Store, Tag, Package } from 'lucide-react'

/**
 * Product Detail Page
 * 
 * Public page showing complete product information
 * 
 * Features:
 * - Product image gallery (with thumbnails)
 * - Product details (title, price, description, stock, category)
 * - Shop information with link
 * - WhatsApp contact button
 * - Breadcrumb navigation
 * - Server Component (SEO-friendly)
 * 
 * Data:
 * - Fetch product by slug
 * - Join with shop and category tables
 * - Show 404 if product not found or inactive
 * 
 * Time to complete: 12min
 */
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = await createServerClient()

  // Await params to get slug
  const { slug } = await params

  // Fetch product with shop and category info
  const { data: product } = await supabase
    .from('products')
    .select(`  *,  shops (    id,    slug,    name,    whatsapp_number  ),  categories (    id,    name ) `)
    .eq('slug', slug)
    .single()

  // Show 404 if product not found or inactive
  if (!product || !product.is_active) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-orange-600">
            Accueil
          </Link>
          {' / '}
          <Link href="/products" className="hover:text-orange-600">
            Produits
          </Link>
          {' / '}
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div>
            <ProductGallery 
              images={product.images || []} 
              productTitle={product.title} 
            />
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-orange-600">
                {formatPrice(product.price)} XAF
              </p>
            </div>

            {/* Product Metadata */}
            <div className="space-y-3 py-4 border-t border-b border-gray-200">
              {/* Category */}
              {product.categories && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Catégorie:</span>
                  <span>{product.categories.name}</span>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Stock disponible:</span>
                <span className={product.stock > 10 ? 'text-green-600' : 'text-orange-600'}>
                  {product.stock} unité(s)
                </span>
              </div>

              {/* Shop */}
              {product.shops && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Store className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Vendu par:</span>
                  <Link 
                    href={`/shop/${product.shops.slug}`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {product.shops.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* WhatsApp CTA Button */}
            {product.shops && product.shops.whatsapp_number && (
              <div className="pt-4">
                <WhatsAppButton 
                  whatsappNumber={product.shops.whatsapp_number}
                  productTitle={product.title}
                  fixed={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate static params for static generation (optional optimization)
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const supabase = await createServerClient()
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: 'Produit introuvable - Mervason',
    }
  }

  return {
    title: `${product.title} - Mervason`,
    description: product.description || `Achetez ${product.title} sur Mervason`,
  }
}
