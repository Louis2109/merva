// components/features/order-form.tsx
// Order form for customer delivery information

'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * OrderForm Component
 * 
 * Collects customer delivery information and sends to seller via WhatsApp
 * 
 * Flow:
 * 1. Customer fills form (name, phone, city, neighborhood)
 * 2. Click "Commander" button
 * 3. WhatsApp opens with pre-filled message containing all info
 * 
 * Why Client Component?
 * - Needs form state (useState)
 * - Interactive form validation
 * - Dynamic WhatsApp URL generation
 */
interface OrderFormProps {
  productTitle: string
  productPrice: string
  whatsappNumber: string
}

export function OrderForm({ productTitle, productPrice, whatsappNumber }: OrderFormProps) {
  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')

  // Build WhatsApp message with customer info
  const buildWhatsAppMessage = () => {
    const message = `🛒 NOUVELLE COMMANDE

📦 Produit: ${productTitle}
💰 Prix: ${productPrice} XAF

👤 INFORMATIONS CLIENT:
Nom: ${customerName}
Téléphone: ${customerPhone}
Ville: ${city}
Quartier: ${neighborhood}

Merci de confirmer la disponibilité.`

    return encodeURIComponent(message)
  }

  // Check if form is valid
  const isFormValid = customerName && customerPhone && city && neighborhood

  // WhatsApp URL
  const whatsappUrl = isFormValid
    ? `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`
    : '#'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Informations de livraison
      </h3>

      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Jean Dupont"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Ex: 670000000"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          type="text"
          placeholder="Ex: Douala"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Quartier</Label>
        <Input
          id="neighborhood"
          type="text"
          placeholder="Ex: Akwa"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
          ${
            isFormValid
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        onClick={(e) => {
          if (!isFormValid) {
            e.preventDefault()
            alert('Veuillez remplir tous les champs')
          }
        }}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Commander via WhatsApp</span>
      </a>

      <p className="text-xs text-gray-500 text-center">
        En cliquant, vous serez redirigé vers WhatsApp pour finaliser votre commande
      </p>
    </div>
  )
}
