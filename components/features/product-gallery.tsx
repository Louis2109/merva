// components/features/product-gallery.tsx
// Image gallery component for product detail page

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ProductGallery Component
 * 
 * Interactive image gallery with main display and thumbnail navigation
 * Used in: Product detail page
 * 
 * Features:
 * - Main image display (large)
 * - Thumbnails row below (clickable)
 * - Active thumbnail highlighted
 * - Fallback icon when no images
 * - Responsive layout
 * 
 * Client Component: Needs interactivity for thumbnail clicks
 * 
 * @param images - Array of image URLs
 * @param productTitle - Product name for alt text
 */
interface ProductGalleryProps {
  images: string[]
  productTitle: string
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // No images - show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <Package className="w-24 h-24 text-gray-300" />
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={selectedImage}
          alt={`${productTitle} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
