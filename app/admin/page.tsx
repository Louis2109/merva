// app/admin/page.tsx
// Admin Dashboard - Overview with KPIs

import { createServerClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShopStatusBadge } from '@/components/admin/shop-status-badge'

/**
 * Admin Dashboard
 * 
 * Features:
 * - Stats cards (users, shops, products, revenue)
 * - Recent shops list
 * - Quick actions
 * 
 * Pattern:
 * - Server Component (fetch data server-side)
 * - SQL aggregations for performance
 */
export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: totalShops },
    { count: activeShops },
    { count: totalProducts },
    { data: recentShops },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('shops').select('*', { count: 'exact', head: true }),
    supabase.from('shops').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase
      .from('shops')
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        plan_id,
        plans (name),
        profiles (first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  // Calculate estimated revenue (shops with paid plans)
  const { count: standardShops } = await supabase
    .from('shops')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', 2) // Standard plan

  const { count: premiumShops } = await supabase
    .from('shops')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', 3) // Premium plan

  const estimatedRevenue = (standardShops || 0) * 5000 + (premiumShops || 0) * 15000

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de la plateforme Mervason
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs Total"
          value={totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Boutiques"
          value={`${activeShops || 0} / ${totalShops || 0}`}
          subtitle="actives"
          icon={Store}
          color="green"
        />
        <StatsCard
          title="Produits Total"
          value={totalProducts || 0}
          icon={Package}
          color="orange"
        />
        <StatsCard
          title="Revenu Estimé"
          value={`${(estimatedRevenue / 1000).toFixed(0)}k`}
          subtitle="XAF/mois"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recent Shops */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Boutiques Récentes</CardTitle>
            <Link href="/admin/shops">
              <Button variant="ghost" size="sm">
                Voir tout →
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentShops && recentShops.length > 0 ? (
              recentShops.map((shop: any) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {shop.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                      <p className="text-sm text-gray-600">
                        Par {shop.profiles?.first_name} {shop.profiles?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {shop.plans?.name || 'free'}
                    </span>
                    <ShopStatusBadge isActive={shop.is_active} />
                    <Link href={`/admin/shops/${shop.id}`}>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Aucune boutique créée pour l'instant
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Stats Card Component
 */
interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: 'blue' | 'green' | 'orange' | 'purple'
}

function StatsCard({ title, value, subtitle, icon: Icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {subtitle && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              {subtitle}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
