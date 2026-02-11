// components/features/image-upload.tsx
// Client Component for image upload with preview

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadProductImage, deleteProductImage } from '@/lib/actions/upload'

interface ImageUploadProps {
  /**
   * Existing image URLs (for edit mode)
   */
  existingImages?: string[]
  
  /**
   * Product ID (used for storage path)
   */
  productId?: string
  
  /**
   * Callback when images change
   */
  onImagesChange: (imageUrls: string[]) => void
}

/**
 * Image Upload Component
 * 
 * Features:
 * - Select multiple files (max 5)
 * - Client-side validation (file type, size)
 * - Image preview grid
 * - Delete uploaded images
 * - Progress feedback
 * 
 * Constraints:
 * - Max 5 images per product
 * - Max 5MB per file
 * - Allowed: .jpg, .png, .webp
 * 
 * Time to complete: 10min
 */
export function ImageUpload({ existingImages = [], productId, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check total images limit (5 max)
    if (images.length + files.length > 5) {
      setError('Maximum 5 images autorisées par produit')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (5MB)
        const MAX_SIZE = 5 * 1024 * 1024
        if (file.size > MAX_SIZE) {
          throw new Error(`${file.name} dépasse 5MB`)
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${file.name} n'est pas un format valide (.jpg, .png, .webp)`)
        }

        // Upload file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('productId', productId || 'temp')

        const publicUrl = await uploadProductImage(formData)
        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const updatedImages = [...images, ...uploadedUrls]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors du téléchargement')
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  // Handle image deletion
  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('Supprimer cette image ?')) return

    try {
      await deleteProductImage(imageUrl)
      const updatedImages = images.filter(url => url !== imageUrl)
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Images du produit
          <span className="text-sm text-gray-500 ml-2">
            ({images.length}/5)
          </span>
        </Label>
        
        {images.length < 5 && (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isUploading}
              onClick={(e) => {
                e.preventDefault()
                e.currentTarget.previousElementSibling?.dispatchEvent(new MouseEvent('click'))
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Téléchargement...' : 'Ajouter des images'}
            </Button>
          </label>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Info message */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
        <p>📸 Formats acceptés: .jpg, .png, .webp (max 5MB par fichier)</p>
        <p className="mt-1">✨ Conseil: Utilisez des images claires et bien éclairées</p>
      </div>

      {/* Images grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
            <div key={imageUrl} className="relative group">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              
              {/* Delete button (appears on hover) */}
              <button
                type="button"
                onClick={() => handleDeleteImage(imageUrl)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* First image badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded">
                  Image principale
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Aucune image ajoutée</p>
          <p className="text-xs text-gray-500">
            Cliquez sur "Ajouter des images" pour commencer
          </p>
        </div>
      )}

      {/* Hidden input to store image URLs for form submission */}
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images)}
      />
    </div>
  )
}
