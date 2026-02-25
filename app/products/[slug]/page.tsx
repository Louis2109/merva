// app/products/[slug]/page.tsx
// Product detail page with gallery and WhatsApp contact button

import { createServerClient, createAnonymousClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/features/product-gallery'
import { WhatsAppButton } from '@/components/features/whatsapp-button'
import { ProductCard } from '@/components/features/product-card'
import { OrderForm } from '@/components/features/order-form'
import { Badge } from '@/components/ui/badge'
import { Store, Tag, Package, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

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
    .select(`
      *,
      shops (    id,  slug,  name,  whatsapp_number  ),
      categories (  id,  name,  slug  )  `)
    .eq('slug', slug)
    .single()

  // Show 404 if product not found or inactive
  if (!product || !product.is_active) {
    notFound()
  }

  // Fetch related products from same shop (max 4, excluding current)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('id, slug, title, price, images')
    .eq('shop_id', product.shop_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .gt('stock', 0)
    .limit(4)

  // Determine stock status and badge variant
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Rupture de stock', variant: 'error' as const, pulse: false }
    } else if (stock <= 10) {
      return { label: 'Stock limité', variant: 'warning' as const, pulse: true }
    } else {
      return { label: 'En stock', variant: 'success' as const, pulse: false }
    }
  }

  const stockStatus = getStockStatus(product.stock)

  // Build WhatsApp pre-filled message
  const whatsappMessage = `Bonjour, je suis intéressé par ${product.title} à ${formatPrice(product.price)} XAF`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images?.[0] || '',
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'XAF',
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: product.shops?.name || 'Mervason',
              },
            },
            ...(product.categories && {
              category: product.categories.name,
            }),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb with Category */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          {product.categories && (
            <>
              <Link 
                href={`/products?category=${product.categories.id}`} 
                className="hover:text-emerald-600 transition-colors"
              >
                {product.categories.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
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
            {/* Title, Price */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
                  {product.title}
                </h1>
                <Badge variant={stockStatus.variant} pulse={stockStatus.pulse}>
                  {stockStatus.label}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
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
                  <Link 
                    href={`/products?category=${product.categories.id}`}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {product.categories.name}
                  </Link>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Quantité disponible:</span>
                <span className={
                  product.stock > 10 
                    ? 'text-green-600' 
                    : product.stock > 0 
                    ? 'text-orange-600' 
                    : 'text-red-600'
                }>
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
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
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
            {/* Order Form - Customer Delivery Information */}
            {product.shops && product.shops.whatsapp_number && (
              <OrderForm
                productTitle={product.title}
                productPrice={formatPrice(product.price)}
                whatsappNumber={product.shops.whatsapp_number}
              />
            )}
            {/* WhatsApp CTA Button */}
            {product.shops && product.shops.whatsapp_number && (
              <div className="pt-4 hidden md:block">
                <WhatsAppButton 
                  whatsappNumber={product.shops.whatsapp_number}
                  productTitle={product.title}
                  productPrice={formatPrice(product.price)}
                  fixed={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Autres produits de {product.shops?.name}
              </h2>
              {relatedProducts.length > 3 && product.shops && (
                <Link
                  href={`/shop/${product.shops.slug}`}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                >
                  Voir la boutique
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Responsive Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  slug={relatedProduct.slug}
                  title={relatedProduct.title}
                  price={relatedProduct.price}
                  imageUrl={relatedProduct.images?.[0] || null}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Fixed Button - Mobile only */}
      {product.shops && product.shops.whatsapp_number && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50 animate-slide-up">
          <WhatsAppButton 
            whatsappNumber={product.shops.whatsapp_number}
            productTitle={product.title}
            productPrice={formatPrice(product.price)}
            fixed={true}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Generate Static Params for ISR (Incremental Static Regeneration)
 * 
 * Pre-renders top 20 most viewed/newest products at build time.
 * Other products are generated on-demand (SSR) and cached.
 * 
 * Benefits:
 * - Faster page loads for popular products
 * - Better SEO (static HTML indexed immediately)
 * - Reduced server load
 * 
 * How it works:
 * - At build time: Fetch top 20 slugs → Generate HTML files
 * - At runtime: Unknown slugs → SSR → Cache for next request
 * 
 * IMPORTANT: Uses createAnonymousClient() instead of createServerClient()
 * because this function runs at BUILD TIME (no cookies available)
 */
export async function generateStaticParams() {
  // Use anonymous client (no cookies at build time!)
  const supabase = createAnonymousClient()

  // Fetch top 20 products (newest first)
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20)

  // Return array of params objects
  return products?.map((product) => ({
    slug: product.slug,
  })) || []
}

/**
 * Generate Metadata for SEO & Social Sharing
 * 
 * Creates optimized meta tags for:
 * - Google Search (title, description)
 * - Facebook/LinkedIn (Open Graph)
 * - Twitter Cards
 * - WhatsApp previews
 * 
 * This makes your product links look professional when shared!
 * 
 * IMPORTANT: Uses createAnonymousClient() because metadata generation
 * can happen at build time (ISR) where cookies aren't available
 */
export async function generateMetadata({ params }: ProductDetailPageProps) {
  // Use anonymous client (works both at build time and runtime)
  const supabase = createAnonymousClient()
  const { slug } = await params

  // Fetch product with all metadata needed
  const { data: product } = await supabase
    .from('products')
    .select('title, description, price, images')
    .eq('slug', slug)
    .single()

  // Fallback for 404 products
  if (!product) {
    return {
      title: 'Produit introuvable - Mervason',
      description: 'Ce produit n\'existe pas ou n\'est plus disponible.',
    }
  }

  // Format price for social preview
  const priceFormatted = `${formatPrice(product.price)} XAF`
  
  // Get first image for social preview (or fallback)
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/og-default.png' // TODO: Add default OG image

  // Build rich description
  const description = product.description 
    ? product.description.slice(0, 160) // Max 160 chars for Google
    : `Achetez ${product.title} pour ${priceFormatted} sur Mervason, la marketplace camerounaise.`

  return {
    title: `${product.title} - Mervason`,
    description,
    
    // Open Graph (Facebook, LinkedIn, WhatsApp)
    openGraph: {
      title: product.title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
      siteName: 'Mervason',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [imageUrl],
    },
    
    // Additional metadata
    keywords: [
      product.title,
      'Cameroun',
      'marketplace',
      'acheter',
      'vendre',
      'Mervason',
    ],
  }
}
