// app/loading.tsx
// Global loading state for all pages

import { Loader2 } from 'lucide-react'

/**
 * Global Loading Component
 * 
 * Displayed during page transitions and data fetching
 * Used as fallback for Suspense boundaries
 * 
 * Features:
 * - Centered spinner
 * - Consistent with design system
 * - Full screen coverage
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )
}
