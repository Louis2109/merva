// app/dashboard/page.tsx
// Main dashboard - Clean layout with essential actions

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Package, Plus, Settings, Crown, Lightbulb, ExternalLink } from 'lucide-react'

/**
 * Dashboard Home Page
 * 
 * Layout:
 * - Welcome header with shop status
 * - Plan banner (sticky visual)
 * - 2 main action cards: Produits + Paramètres
 * - Tips section for onboarding
 */
export default async function DashboardPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has a shop with plan info
  const { data: shop } = await supabase
    .from('shops')
    .select(`
      *,
      plans:plan_id (
        name,
        product_limit
      )
    `)
    .eq('owner_id', user.id)
    .single()

  // Get product count if shop exists
  let productCount = 0
  if (shop) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
    productCount = count || 0
  }

  const plan = shop?.plans as { name: string; product_limit: number } | null
  const planName = plan?.name || 'Gratuit'
  const productLimit = plan?.product_limit || 20
  const isAtLimit = productCount >= productLimit

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

  // Has shop: Show clean dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        
        {/* Header - Welcome */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {shop.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Bienvenue, {shop.name}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`w-2 h-2 rounded-full ${shop.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                {shop.is_active ? 'Active' : 'Inactive'}
                <span className="mx-1">•</span>
                <Link 
                  href={`/shop/${shop.slug}`} 
                  target="_blank"
                  className="text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                >
                  Voir ma boutique <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 mb-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">Plan actuel</p>
                <p className="font-bold text-lg">{planName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide opacity-80">Produits</p>
                <p className="font-bold text-lg">{productCount} / {productLimit}</p>
              </div>
              
              {/* Progress bar - desktop only */}
              <div className="hidden sm:block w-20">
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isAtLimit ? 'bg-red-300' : 'bg-white'}`}
                    style={{ width: `${Math.min((productCount / productLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <Link href="/pricing">
                <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                  {isAtLimit ? 'Upgrader' : 'Voir les plans'}
                </Button>
              </Link>
            </div>
          </div>
          
          {isAtLimit && (
            <p className="text-sm text-orange-100 mt-3 pt-3 border-t border-white/20">
              ⚠️ Limite atteinte. Passez au plan supérieur pour ajouter plus de produits.
            </p>
          )}
        </div>

        {/* Main Action Cards - 2 columns */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Products Card */}
          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mes Produits</CardTitle>
                  <CardDescription className="text-xs">Gérez votre catalogue</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {productCount} <span className="text-sm font-normal text-gray-500">produit{productCount !== 1 ? 's' : ''}</span>
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard/products" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">Voir tout</Button>
                </Link>
                <Link href="/dashboard/products/add">
                  <Button 
                    variant="primary" 
                    size="sm"
                    disabled={isAtLimit}
                    title={isAtLimit ? 'Limite atteinte' : 'Ajouter un produit'}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border hover:border-gray-300 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-100 rounded-xl">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Paramètres</CardTitle>
                  <CardDescription className="text-xs">Modifiez votre boutique</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-600 mb-3">
                Logo, description, WhatsApp...
              </p>
              <Link href="/dashboard/settings">
                <Button variant="secondary" size="sm" className="w-full">Modifier</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <CardTitle className="text-base text-blue-900">Astuces Mervason</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Ajoutez des photos de qualité pour <strong>+40%</strong> de conversions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Répondez sur WhatsApp en moins de <strong>5 min</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Partagez votre boutique sur les réseaux sociaux
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export const metadata = {
  title: 'Dashboard - Mervason',
}
