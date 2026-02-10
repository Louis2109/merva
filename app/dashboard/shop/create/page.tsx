// app/dashboard/shop/create/page.tsx
// Shop creation page (protected route)

import { ShopForm } from '@/components/features/shop-form'
import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Shop Creation Page
 * 
 * Business logic:
 * - Check if user already has a shop → redirect to dashboard
 * - Otherwise: show shop creation form
 * 
 * Time to complete: 2min
 */
export default async function CreateShopPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user already has a shop
  const { data: existingShop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (existingShop) {
    // User already has a shop, redirect to dashboard
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bienvenue sur Mervason! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Créez votre boutique en quelques minutes et commencez à vendre
          </p>
        </div>

        {/* Form */}
        <ShopForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Créer ma boutique - Mervason',
  description: 'Configurez votre boutique sur Mervason',
}
