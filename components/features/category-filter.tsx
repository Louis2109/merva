// components/features/category-filter.tsx
// Category filter dropdown for products listing

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

/**
 * CategoryFilter Component
 * 
 * Dropdown to filter products by category
 * Used in: Products listing page
 * 
 * Features:
 * - Shows all available categories
 * - Updates URL with ?category=id parameter
 * - "Toutes les catégories" option to clear filter
 * - Client Component for navigation interactivity
 * 
 * @param categories - Array of categories from database
 */
interface Category {
  id: string
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      // Remove category filter
      router.push('/products')
    } else {
      // Add category filter to URL
      router.push(`/products?category=${categoryId}`)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Filter className="w-5 h-5 text-gray-500" />
      <select
        value={currentCategory || 'all'}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
      >
        <option value="all">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
