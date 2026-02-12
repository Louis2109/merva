// components/features/shop-form.tsx
// Shop creation form component

'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createShop } from '@/lib/actions/shops'
import { Store, Loader2 } from 'lucide-react'

/**
 * Shop Creation Form
 * 
 * Features:
 * - Shop name input (auto-generates slug on blur)
 * - Description textarea
 * - WhatsApp number with format validation
 * - Slug preview
 * - Server Action submission
 * 
 * Time to complete: 5min
 */
export function ShopForm() {
  const [slugPreview, setSlugPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createShop(formData)
    } catch (error) {
      console.error('Shop creation error:', error)
      setIsSubmitting(false)
    }
  }

  // Generate slug preview when user types shop name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (name) {
      // Simple client-side slug preview (server will generate final slug)
      const preview = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlugPreview(preview)
    } else {
      setSlugPreview('')
    }
  }

  return (
    <Card variant="glass" className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Store className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-2xl">Créer ma boutique</CardTitle>
            <CardDescription>
              Configurez votre boutique pour commencer à vendre sur Mervason
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Shop Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la boutique <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ma Super Boutique"
              required
              minLength={3}
              maxLength={100}
              onChange={handleNameChange}
            />
            {slugPreview && (
              <p className="text-xs text-gray-500">
                URL: <span className="font-mono text-blue-600">/shop/{slugPreview}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
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
              placeholder="+237670000000"
              required
              pattern="\+237\d{9}"
              title="Format: +237 suivi de 9 chiffres (ex: +237670000000)"
            />
            <p className="text-xs text-gray-500">
              Format Cameroun: +237XXXXXXXXX (9 chiffres après +237)
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-600 text-sm">ℹ️</span>
              <p className="text-xs text-blue-800">
                Les clients vous contacteront via WhatsApp pour finaliser leurs commandes.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              'Créer ma boutique'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
