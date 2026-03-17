// components/features/shop-settings-form.tsx
// Shop settings form component with logo upload

'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { updateShop, uploadShopLogo } from '@/lib/actions/shops'
import { Store, Loader2, Upload, X, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

/**
 * Shop Settings Form
 * 
 * Features:
 * - Edit shop name, description, WhatsApp
 * - Logo upload with preview
 * - Real-time validation
 * - Success/error feedback
 * 
 * Client Component because:
 * - Logo upload needs file input handling
 * - Form state management (loading, errors)
 * - Preview image before upload
 */
interface ShopSettingsFormProps {
  shop: {
    id: string
    name: string
    slug: string
    description: string | null
    whatsapp_number: string
    logo_url: string | null
  }
}

export function ShopSettingsForm({ shop }: ShopSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(shop.logo_url)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to storage
    setIsUploading(true)
    setMessage(null)

    const result = await uploadShopLogo(shop.id, file)

    setIsUploading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
      setLogoPreview(null)
    } else if (result.url) {
      setLogoUrl(result.url)
      setLogoPreview(null)
      setMessage({ type: 'success', text: 'Logo mis à jour !' })
    }
  }

  const removeLogo = () => {
    setLogoUrl(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    // Add logo URL to form data
    if (logoUrl) {
      formData.set('logo_url', logoUrl)
    }

    const result = await updateShop(shop.id, formData)

    setIsSubmitting(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result?.success) {
      setMessage({ type: 'success', text: 'Boutique mise à jour avec succès !' })
    }
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Store className="w-6 h-6 text-orange-500" />
          </div>
          <CardTitle className="text-xl">Informations de la boutique</CardTitle>
        </div>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo de la boutique</Label>
            <div className="flex items-start gap-4">
              {/* Logo Preview */}
              <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                {(logoPreview || logoUrl) ? (
                  <>
                    <Image
                      src={logoPreview || logoUrl || ''}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-input"
                />
                <label htmlFor="logo-input">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG ou WebP. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Shop Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la boutique <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={shop.name}
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={shop.description || ''}
              placeholder="Décrivez votre boutique, vos produits, votre spécialité..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">Optionnel - Maximum 500 caractères</p>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">
              Numéro WhatsApp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={shop.whatsapp_number}
              required
              pattern="\+237\d{9}"
              title="Format: +237 suivi de 9 chiffres (ex: +237670000000)"
            />
            <p className="text-xs text-gray-500">
              Format Cameroun: +237XXXXXXXXX (9 chiffres après +237)
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
