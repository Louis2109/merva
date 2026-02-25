// components/features/whatsapp-button.tsx
// WhatsApp CTA button for contacting sellers

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * WhatsAppButton Component
 * 
 * Call-to-action button that opens WhatsApp with pre-filled message
 * Used in: Product detail page
 * 
 * Features:
 * - Opens WhatsApp web/app with seller's number
 * - Pre-filled message with product info
 * - WhatsApp green branding
 * - Responsive: Fixed bottom on mobile, static on desktop
 * - Icon + text label
 * 
 * WhatsApp URL format:
 * - Web: https://wa.me/237XXXXXXXXX?text=Message
 * - Phone must be in international format (no + sign, no spaces)
 * - Message is URL-encoded
 * 
 * @param whatsappNumber - Shop WhatsApp number (format: 237XXXXXXXXX)
 * @param productTitle - Product name for pre-filled message
 * @param productPrice - Formatted price string (e.g., "25 000")
 * @param fixed - Whether to use fixed positioning (mobile only)
 */
interface WhatsAppButtonProps {
  whatsappNumber: string
  productTitle: string
  productPrice?: string
  fixed?: boolean
}

export function WhatsAppButton({ 
  whatsappNumber, 
  productTitle,
  productPrice,
  fixed = false 
}: WhatsAppButtonProps) {
  // Format WhatsApp message (URL-encoded) with price
  const messageText = productPrice
    ? `Bonjour, je suis intéressé par ${productTitle} à ${productPrice} XAF`
    : `Bonjour, je suis intéressé par: ${productTitle}`
  
  const message = encodeURIComponent(messageText)
  
  // WhatsApp URL (wa.me format)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
        fixed ? "w-full" : "w-full"
      )}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Contacter le vendeur</span>
    </a>
  )
}
