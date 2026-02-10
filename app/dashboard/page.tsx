// app/dashboard/page.tsx
// Main dashboard - Shows shop status and management links

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Package, Plus } from 'lucide-react'

/**
 * Dashboard Home Page
 * 
 * Logic:
 * - No shop → Show "Create Shop" CTA
 * - Has shop → Show shop info + quick actions (products management coming in Step 2)
 * 
 * Time to complete: 3min
 */
export default async function DashboardPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has a shop
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // No shop: Show onboarding CTA
  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card variant="glass" className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-orange-500" />
              </div>
              <CardTitle className="text-3xl mb-2">Créez votre boutique</CardTitle>
              <CardDescription className="text-lg">
                Vous n'avez pas encore de boutique. Commencez à vendre en quelques minutes!
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <h3 className="font-semibold mb-1">Configuration rapide</h3>
                    <p className="text-sm text-gray-600">Moins de 5 minutes pour créer votre boutique</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl mb-2">📱</div>
                    <h3 className="font-semibold mb-1">Vente via WhatsApp</h3>
                    <p className="text-sm text-gray-600">Les clients vous contactent directement</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl mb-2">💰</div>
                    <h3 className="font-semibold mb-1">Zéro commission</h3>
                    <p className="text-sm text-gray-600">Gardez 100% de vos ventes</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/dashboard/shop/create">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <Plus className="w-5 h-5 mr-2" />
                    Créer ma boutique maintenant
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Has shop: Show dashboard overview
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue, {shop.name}!</p>
      </div>

      {/* Shop Info Card */}
      <Card variant="glass" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Store className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <CardTitle>{shop.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${shop.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {shop.is_active ? 'Boutique active' : 'Boutique inactive'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Description</p>
              <p className="font-medium">{shop.description || 'Aucune description'}</p>
            </div>
            <div>
              <p className="text-gray-500">WhatsApp</p>
              <p className="font-medium">{shop.whatsapp_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions (Products coming in Step 2) */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle>Produits</CardTitle>
                <CardDescription>Gérez vos produits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gestion des produits arrive en Phase 3, Step 2 (dans le prochain prompt).
            </p>
            <Button variant="secondary" disabled>
              Voir mes produits
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Arrivent en Phase 5</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Vues, clics WhatsApp, produits populaires...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Dashboard - Mervason',
}
