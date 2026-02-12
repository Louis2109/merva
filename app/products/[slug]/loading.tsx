// app/products/[slug]/loading.tsx
// Loading skeleton for product detail page

import { Skeleton } from '@/components/ui/skeleton'

/**
 * Product Detail Loading State
 * 
 * Skeleton screen matching product detail layout
 */
export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-5 w-48 mb-6" />

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div>
            <Skeleton className="aspect-square w-full rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="space-y-3 py-4 border-t border-b border-gray-200">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-48" />
            </div>

            <div>
              <Skeleton className="h-8 w-32 mb-3" />
              <Skeleton className="h-24 w-full" />
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
