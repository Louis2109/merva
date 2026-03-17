// app/dashboard/settings/page.tsx
// Merchant settings page - Edit shop details

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown, Package } from 'lucide-react'
import { ShopSettingsForm } from '@/components/features/shop-settings-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paramètres boutique - Mervason',
  description: 'Modifiez les paramètres de votre boutique',
}

/**
 * Shop Settings Page
 * 
 * Allows merchant to:
 * - Edit shop name, description, WhatsApp
 * - Upload/change logo
 * - View current plan info with upgrade link
 * 
 * Access: Authenticated merchants only
 */
export default async function SettingsPage() {
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Get shop with plan info
  const { data: shop } = await supabase
    .from('shops')
    .select(`
      id,
      name,
      slug,
      description,
      whatsapp_number,
      logo_url,
      plan_id,
      plans (
        name,
        product_limit
      )
    `)
    .eq('owner_id', user.id)
    .single()

  if (!shop) {
    redirect('/dashboard/shop/create')
  }

  // Count current products
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shop.id)

  // Type safety for plan - Supabase returns single object for FK joins with .single()
  const planData = shop.plans as unknown as { name: string; product_limit: number } | null
  const planName = planData?.name || 'Gratuit'
  const productLimit = planData?.product_limit || 20

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Paramètres de la boutique
          </h1>
          <p className="text-gray-600 mt-1">
            Modifiez les informations de votre boutique
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <ShopSettingsForm shop={shop} />
          </div>

          {/* Sidebar - Plan Info */}
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Crown className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Votre plan</h3>
                  <p className="text-sm text-gray-500">{planName}</p>
                </div>
              </div>

              {/* Product Usage */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Produits</span>
                  <span className="font-medium">
                    {productCount || 0} / {productLimit}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((productCount || 0) / productLimit) * 100, 100)}%` 
                    }}
                  />
                </div>
                {(productCount || 0) >= productLimit && (
                  <p className="text-xs text-red-500 mt-2">
                    Limite atteinte ! Passez au plan supérieur.
                  </p>
                )}
              </div>

              <Link href="/pricing">
                <Button variant="secondary" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  {(productCount || 0) >= productLimit ? 'Augmenter ma limite' : 'Voir les plans'}
                </Button>
              </Link>
            </div>

            {/* Shop Preview Link */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Aperçu public</h3>
              <p className="text-sm text-gray-500 mb-4">
                Voir comment les clients voient votre boutique
              </p>
              <Link href={`/shop/${shop.slug}`} target="_blank">
                <Button variant="ghost" className="w-full">
                  Voir ma boutique →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
