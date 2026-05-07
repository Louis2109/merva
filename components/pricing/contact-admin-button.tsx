// components/pricing/contact-admin-button.tsx
// Pricing card with WhatsApp upgrade functionality

'use client'

import { PricingCard } from './pricing-card'
import { useRouter } from 'next/navigation'

/**
 * ContactAdminButton Component (Client Component)
 * 
 * Wraps PricingCard and handles upgrade click:
 * - If not logged in → Redirect to register
 * - If no shop → Redirect to create shop
 * - If has shop → Open WhatsApp with pre-filled message
 * 
 * Why Client Component?
 * - Needs to handle onClick events
 * - Dynamic WhatsApp URL generation
 * - window.open() requires browser API
 */
interface Plan {
  id: number
  name: string
  price: number
  productLimit: number
  features: string[]
  isPopular?: boolean
}

interface ContactAdminButtonProps {
  plan: Plan
  currentPlanId: number | null
  shopName: string | null
  shopId: string | null
  isLoggedIn: boolean
  hasShop: boolean
  adminWhatsappNumber: string
}

export function ContactAdminButton({
  plan,
  currentPlanId,
  shopName,
  shopId,
  isLoggedIn,
  hasShop,
  adminWhatsappNumber,
}: ContactAdminButtonProps) {
  const router = useRouter()

  const isCurrentPlan = currentPlanId === plan.id
  const canUpgrade = currentPlanId !== null && plan.id > currentPlanId
  const canDowngrade = currentPlanId !== null && plan.id < currentPlanId

  const handleClick = () => {
    // Not logged in → Register
    if (!isLoggedIn) {
      router.push('/auth/register')
      return
    }

    // No shop → Create shop
    if (!hasShop) {
      router.push('/dashboard/shop/create')
      return
    }

    // Already on this plan
    if (isCurrentPlan) {
      return
    }

    if (!adminWhatsappNumber) {
      alert('Numéro WhatsApp admin non configuré')
      return
    }

    // Contact admin for upgrade/downgrade
    const currentPlanName = getPlanName(currentPlanId || 1)
    const action = canDowngrade ? 'rétrograder vers' : 'passer au'
    
    const message = `Bonjour,

Je suis propriétaire de la boutique "${shopName}".
Je souhaite ${action} plan ${plan.name}.

📋 Détails:
- Boutique ID: ${shopId}
- Plan actuel: ${currentPlanName}
- Plan souhaité: ${plan.name}
${plan.price > 0 ? `- Prix: ${plan.price.toLocaleString('fr-FR')} XAF/mois` : ''}

Merci de m'indiquer la marche à suivre.`

    const whatsappUrl = `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  // Determine CTA text
  const getCtaText = () => {
    if (!isLoggedIn) return 'Créer mon compte'
    if (!hasShop) return 'Créer ma boutique'
    if (isCurrentPlan) return 'Plan actuel'
    if (canDowngrade) return 'Rétrograder'
    return 'Passer à ce plan'
  }

  return (
    <PricingCard
      name={plan.name}
      price={plan.price}
      productLimit={plan.productLimit}
      features={plan.features}
      isCurrentPlan={isCurrentPlan}
      isPopular={plan.isPopular && !isCurrentPlan}
      onUpgrade={isCurrentPlan ? undefined : handleClick}
      ctaText={getCtaText()}
    />
  )
}

function getPlanName(planId: number): string {
  const names: Record<number, string> = {
    1: 'Gratuit',
    2: 'Standard',
    3: 'Premium'
  }
  return names[planId] || 'Gratuit'
}
