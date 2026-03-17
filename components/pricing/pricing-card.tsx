// components/pricing/pricing-card.tsx
// Pricing card component for plan display

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * PricingCard Component
 * 
 * Displays a single pricing plan with features
 * 
 * UI Pattern:
 * - Highlighted card for recommended plan
 * - Feature list with checkmarks
 * - CTA button changes based on context
 * 
 * Why separate component?
 * - Reusable in /pricing page
 * - Can show in dashboard too
 * - Clean separation of concerns
 */
interface PricingCardProps {
  name: string
  price: number
  productLimit: number
  features: string[]
  isCurrentPlan?: boolean
  isPopular?: boolean
  onUpgrade?: () => void
  upgradeDisabled?: boolean
  ctaText?: string
}

export function PricingCard({
  name,
  price,
  productLimit,
  features,
  isCurrentPlan = false,
  isPopular = false,
  onUpgrade,
  upgradeDisabled = false,
  ctaText = 'Passer à ce plan'
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 flex flex-col',
        'transition-all duration-300 hover:scale-105',
        isPopular
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl scale-105'
          : 'bg-white border border-gray-200 shadow-lg',
        isCurrentPlan && !isPopular && 'ring-2 ring-green-500'
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-900 text-white text-xs font-bold px-4 py-1 rounded-full">
            POPULAIRE
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            VOTRE PLAN
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className={cn(
        'text-xl font-bold mb-2 capitalize',
        isPopular ? 'text-white' : 'text-gray-900'
      )}>
        {name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        <span className={cn(
          'text-4xl font-bold',
          isPopular ? 'text-white' : 'text-gray-900'
        )}>
          {price === 0 ? 'Gratuit' : `${price.toLocaleString('fr-FR')}`}
        </span>
        {price > 0 && (
          <span className={cn(
            'text-sm ml-2',
            isPopular ? 'text-white/80' : 'text-gray-500'
          )}>
            XAF/mois
          </span>
        )}
      </div>

      {/* Product Limit */}
      <p className={cn(
        'text-lg font-semibold mb-4 pb-4 border-b',
        isPopular ? 'text-white/90 border-white/20' : 'text-gray-700 border-gray-200'
      )}>
        Jusqu'à {productLimit} produits
      </p>

      {/* Features List */}
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={cn(
              'w-5 h-5 flex-shrink-0 mt-0.5',
              isPopular ? 'text-white' : 'text-green-500'
            )} />
            <span className={cn(
              'text-sm',
              isPopular ? 'text-white/90' : 'text-gray-600'
            )}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {onUpgrade && !isCurrentPlan && (
        <Button
          variant={isPopular ? 'secondary' : 'primary'}
          className={cn(
            'w-full',
            isPopular && 'bg-white text-orange-600 hover:bg-gray-100'
          )}
          onClick={onUpgrade}
          disabled={upgradeDisabled}
        >
          {ctaText}
        </Button>
      )}

      {isCurrentPlan && (
        <Button
          variant="ghost"
          className={cn(
            'w-full cursor-default',
            isPopular ? 'text-white/80' : 'text-gray-500'
          )}
          disabled
        >
          ✓ Plan actuel
        </Button>
      )}
    </div>
  )
}
