// components/features/product-card.tsx
// Reusable product card component for public pages

import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

/**
 * ProductCard Component
 * 
 * Displays product information in a card format
 * Used in: Landing page, Products list, Shop page
 * 
 * Features:
 * - Product image with fallback icon
 * - Title (truncated if too long)
 * - Price formatted in XAF
 * - Link to product detail page
 * - Hover effects
 * 
 * @param slug - Product slug for URL
 * @param title - Product name
 * @param price - Price in XAF
 * @param imageUrl - First product image URL or null
 */
interface ProductCardProps {
  slug: string
  title: string
  price: number
  imageUrl: string | null
}

export function ProductCard({ slug, title, price, imageUrl }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${slug}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          // Fallback icon when no image
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[3rem] mb-2">
          {title}
        </h3>
        <p className="text-lg font-semibold text-orange-600">
          {formatPrice(price)} XAF
        </p>
      </div>
    </Link>
  )
}
