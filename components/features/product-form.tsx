// components/features/product-form.tsx
// Reusable product form for add/edit operations

'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/features/image-upload'
import type { Product, Category } from '@/types'

interface ProductFormProps {
  /**
   * Form mode: 'add' or 'edit'
   */
  mode: 'add' | 'edit'
  
  /**
   * Server Action to call on submit
   */
  action: (formData: FormData) => Promise<void> | void
  
  /**
   * Available categories for select dropdown
   */
  categories: Category[]
  
  /**
   * Existing product data (for edit mode)
   */
  product?: Product
}

/**
 * Product Form Component
 * 
 * Features:
 * - Add/Edit mode support
 * - Category selection
 * - Price input (XAF)
 * - Stock management
 * - Active/Inactive toggle (edit mode only)
 * - Form validation
 * 
 * Time to complete: 8min
 */
export function ProductForm({ mode, action, categories, product }: ProductFormProps) {
  const isEditMode = mode === 'edit'
  
  // Get images - handle both images array and legacy image_url
  const getInitialImages = (): string[] => {
    if (!product) return []
    // @ts-ignore - images field may not be in type yet (added via migration)
    if (product.images && Array.isArray(product.images)) {
      // @ts-ignore
      return product.images
    }
    if (product.image_url) {
      return [product.image_url]
    }
    return []
  }
  
  const [images, setImages] = useState<string[]>(getInitialImages())

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
        </CardTitle>
      </CardHeader>

      <form action={action}>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre du produit <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Ex: iPhone 13 Pro Max 256GB"
              required
              minLength={3}
              maxLength={200}
              defaultValue={product?.title}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Décrivez votre produit (état, caractéristiques, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              maxLength={1000}
              defaultValue={product?.description || ''}
            />
            <p className="text-xs text-gray-500">Optionnel - Maximum 1000 caractères</p>
          </div>

          {/* Price & Stock (Grid) */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Prix (XAF) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="25000"
                required
                min="1"
                step="1"
                defaultValue={product?.price}
              />
              <p className="text-xs text-gray-500">Montant en Francs CFA</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock disponible <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="10"
                required
                min="0"
                step="1"
                defaultValue={product?.stock ?? 0}
              />
              <p className="text-xs text-gray-500">Nombre d'unités</p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id">
              Catégorie <span className="text-red-500">*</span>
            </Label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={product?.category_id || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="" disabled>
                Sélectionnez une catégorie
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="border-t border-gray-200 pt-6">
            <ImageUpload
              existingImages={images}
              productId={product?.id}
              onImagesChange={setImages}
            />
          </div>

          {/* Active Status (Edit mode only) */}
          {isEditMode && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="is_active" className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  value="true"
                  defaultChecked={product?.is_active ?? true}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span>Produit actif (visible sur le site)</span>
              </Label>
              <p className="text-xs text-gray-500 ml-6">
                Décochez pour masquer temporairement le produit sans le supprimer
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" size="lg">
            {isEditMode ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
