// components/features/delete-product-button.tsx
// Client Component for product deletion with confirmation

'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'

interface DeleteProductButtonProps {
  productId: string
  productTitle: string
}

/**
 * Delete Product Button with Confirmation
 * 
 * Client Component to handle:
 * - JavaScript confirm dialog
 * - Form submission to Server Action
 * 
 * Why Client Component?
 * - onClick event handler requires client-side interactivity
 * - React 19: Can't pass event handlers to Client Components from Server Components
 * 
 * @param productId - Product UUID to delete
 * @param productTitle - Product title for confirmation message
 */
export function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const handleDelete = async (formData: FormData) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Supprimer "${productTitle}" ?\n\nCette action est irréversible.`
    )
    
    if (!confirmed) {
      return // User cancelled
    }

    // Proceed with deletion via Server Action
    await deleteProduct(productId)
  }

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="ghost" size="sm">
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </form>
  )
}
