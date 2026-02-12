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
 * - Fixed position on mobile (bottom right)
 * - Icon + text label
 * 
 * WhatsApp URL format:
 * - Web: https://wa.me/237XXXXXXXXX?text=Message
 * - Phone must be in international format (no + sign, no spaces)
 * - Message is URL-encoded
 * 
 * @param whatsappNumber - Shop WhatsApp number (format: 237XXXXXXXXX)
 * @param productTitle - Product name for pre-filled message
 * @param fixed - Whether to use fixed positioning (default: false)
 */
interface WhatsAppButtonProps {
  whatsappNumber: string
  productTitle: string
  fixed?: boolean
}

export function WhatsAppButton({ 
  whatsappNumber, 
  productTitle, 
  fixed = false 
}: WhatsAppButtonProps) {
  // Format WhatsApp message (URL-encoded)
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé par: ${productTitle}`
  )
  
  // WhatsApp URL (wa.me format)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-lg",
        fixed && "fixed bottom-6 right-6 z-40 md:static md:w-full"
      )}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Contacter le vendeur</span>
    </a>
  )
}
