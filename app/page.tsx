// app/page.tsx
// Landing page with hero section and featured products

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/features/product-card'
import { createServerClient } from '@/utils/supabase/server'
import { ShoppingBag, Store } from 'lucide-react'

/**
 * Landing Page
 * 
 * Public homepage for Mervason marketplace
 * 
 * Sections:
 * 1. Hero: Welcome message + CTA buttons
 * 2. Featured Products: 8 most recent active products
 * 
 * Design:
 * - Gradient background for hero
 * - Product grid (2 cols mobile, 4 cols desktop)
 * - Accessible without authentication
 * - Server Component (SEO-friendly)
 * 
 * Data:
 * - Fetch active products only (is_active=true, stock>0)
 * - Order by newest first (created_at DESC)
 * - Limit 8 products
 * - ISR: Cached for 60 seconds
 * 
 * Performance:
 * - Render: ~100ms (cached)
 * - First load: ~3-5s (Supabase query once)
 * 
 * Time to complete: 8min
 */

// Cache homepage for 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  const supabase = await createServerClient()

  // Fetch featured products (8 most recent active products)
  const { data: products } = await supabase
    .from('products')
    .select(`id,  slug,  title,  price,  images  `)
    .eq('is_active', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Bienvenue sur <span className="text-white drop-shadow-lg">Mervason</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-50 max-w-2xl mx-auto">
              Découvrez des milliers de produits et contactez les vendeurs directement via WhatsApp
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/products">
                <Button 
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Parcourir les produits
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg"
                  variant="ghost"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8"
                >
                  <Store className="w-5 h-5 mr-2" />
                  Créer ma boutique
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-20" fill="white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits en vedette
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez les derniers produits ajoutés par nos vendeurs
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
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
        ) : (
          // Empty state
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Aucun produit disponible pour le moment</p>
          </div>
        )}

        {/* View All Products Link */}
        {products && products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="secondary" size="lg">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export const metadata = {
  title: 'Mervason - Marketplace Multi-Vendeurs',
  description: 'Achetez et vendez des produits facilement via WhatsApp au Cameroun',
}
