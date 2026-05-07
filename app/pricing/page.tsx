// app/pricing/page.tsx
// Public pricing page - Shows available plans

import { createServerClient } from '@/utils/supabase/server'
import { PricingCard } from '@/components/pricing/pricing-card'
import { ContactAdminButton } from '@/components/pricing/contact-admin-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs - Mervason',
  description: 'Découvrez nos plans pour vendre sur Mervason. Plan gratuit disponible !',
}

/**
 * Pricing Page
 * 
 * Public page showing all available plans
 * 
 * Behavior:
 * - Not logged in → Show plans with "Créer ma boutique" CTA
 * - Logged in (no shop) → Show plans with "Créer ma boutique" CTA
 * - Logged in (has shop) → Show plans with current plan highlighted
 * 
 * Business Logic:
 * - No online payment (MVP)
 * - "Upgrade" button → Contact admin via WhatsApp
 * - Admin manually upgrades after payment confirmation
 */

// Plans data (could come from DB, but static for now)
const PLANS = [
  {
    id: 1,
    name: 'Gratuit',
    price: 0,
    productLimit: 20,
    features: [
      'Jusqu\'à 20 produits',
      'Support par email',
      'Tableau de bord basique',
      'Page boutique publique',
      'Bouton WhatsApp',
    ]
  },
  {
    id: 2,
    name: 'Standard',
    price: 5000,
    productLimit: 50,
    features: [
      'Jusqu\'à 50 produits',
      'Support WhatsApp prioritaire',
      'Analytics de base',
      'Badge "Vérifié" sur boutique',
      'Tout du plan Gratuit',
    ],
    isPopular: true
  },
  {
    id: 3,
    name: 'Premium',
    price: 15000,
    productLimit: 100,
    features: [
      'Jusqu\'à 100 produits',
      'Support prioritaire 24/7',
      'Analytics avancées',
      'Badge "Premium" doré',
      'Page boutique personnalisée',
      'Mise en avant sur l\'accueil',
      'Tout du plan Standard',
    ]
  }
]

export default async function PricingPage() {
  const supabase = await createServerClient()

  const adminNumberRaw = process.env.PHONE_ADMIN_NUMBER || ''
  const adminWhatsappNumber = adminNumberRaw.replace(/\D/g, '')

  // Get current user and their shop/plan
  const { data: { user } } = await supabase.auth.getUser()
  
  let currentPlanId: number | null = null
  let shopName: string | null = null
  let shopId: string | null = null

  if (user) {
    const { data: shop } = await supabase
      .from('shops')
      .select('id, name, plan_id')
      .eq('owner_id', user.id)
      .single()

    if (shop) {
      currentPlanId = shop.plan_id
      shopName = shop.name
      shopId = shop.id
    }
  }

  const isLoggedIn = !!user
  const hasShop = !!shopName

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600">
          Commencez gratuitement et évoluez selon vos besoins.
          <br />
          Pas de frais cachés, pas de commission sur vos ventes.
        </p>
      </div>

      {/* Current Plan Info (if user has shop) */}
      {hasShop && currentPlanId && (
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            Boutique: <span className="font-semibold">{shopName}</span> · 
            Plan actuel: <span className="font-semibold text-green-600">
              {PLANS.find(p => p.id === currentPlanId)?.name || 'Gratuit'}
            </span>
          </p>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <ContactAdminButton
              key={plan.id}
              plan={plan}
              currentPlanId={currentPlanId}
              shopName={shopName}
              shopId={shopId}
              isLoggedIn={isLoggedIn}
              hasShop={hasShop}
              adminWhatsappNumber={adminWhatsappNumber}
            />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-16 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Questions fréquentes
        </h2>
        
        <div className="space-y-6">
          <FAQItem
            question="Comment fonctionne le paiement ?"
            answer="Pour passer à un plan payant, contactez notre équipe via WhatsApp. Nous acceptons Mobile Money (MTN, Orange), virement bancaire. Une fois le paiement confirmé, votre plan est activé sous 24h."
          />
          <FAQItem
            question="Puis-je changer de plan à tout moment ?"
            answer="Oui ! Vous pouvez upgrader à tout moment. Pour downgrader, contactez notre support. Si vous avez plus de produits que la limite du nouveau plan, vous devrez d'abord en désactiver certains."
          />
          <FAQItem
            question="Y a-t-il une commission sur mes ventes ?"
            answer="Non ! Mervason ne prend aucune commission sur vos ventes. Vous gardez 100% de vos revenus. Les clients vous paient directement via WhatsApp."
          />
          <FAQItem
            question="Que se passe-t-il si je dépasse ma limite de produits ?"
            answer="Vous ne pourrez plus ajouter de nouveaux produits tant que vous n'aurez pas upgradé votre plan ou supprimé des produits existants."
          />
        </div>
      </div>

      {/* CTA Section */}
      {!hasShop && (
        <div className="text-center py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à vendre ?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Commencez gratuitement, sans carte bancaire.
          </p>
          <Link href={isLoggedIn ? '/dashboard/shop/create' : '/auth/register'}>
            <Button 
              variant="secondary"
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              {isLoggedIn ? 'Créer ma boutique' : 'Créer mon compte gratuit'}
            </Button>
          </Link>
        </div>
      )}

      {/* Contact Section */}
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          Une question ? Contactez notre équipe
        </p>
        {adminWhatsappNumber ? (
          <a
            href={`https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent('Bonjour, j\'ai une question sur les tarifs Mervason.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            Discuter sur WhatsApp
          </a>
        ) : (
          <span className="text-sm text-gray-500">Contact WhatsApp indisponible</span>
        )}
      </div>
    </div>
  )
}

/**
 * FAQ Item Component
 */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  )
}
