// app/admin/page.tsx
// Admin Dashboard - Overview with KPIs, pending shops, and alerts

import { createServerClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Store, Users, Package, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShopStatusBadge } from '@/components/admin/shop-status-badge'
import { activateShop, suspendShop } from '@/lib/actions/admin'

/**
 * Admin Dashboard
 * 
 * Layout:
 * - KPIs (3 cards: Boutiques, Users, Products)
 * - Pending shops awaiting validation
 * - Quick actions (Boutiques, Users management)
 * - Alerts & Moderation (static for MVP)
 */
export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  // Get current admin info
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: totalShops },
    { count: totalProducts },
    { data: pendingShops },
    { data: recentShops },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('shops').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    // Shops awaiting validation (inactive)
    supabase
      .from('shops')
      .select(`
        id,
        name,
        created_at,
        profiles!shops_owner_id_fkey (email, first_name, last_name)
      `)
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .limit(5),
    // Recent active shops
    supabase
      .from('shops')
      .select(`
        id,
        name,
        slug,
        is_active,
        created_at,
        plans (name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* KPIs - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Boutiques"
          value={totalShops || 0}
          icon={Store}
          color="orange"
          href="/admin/shops"
        />
        <KPICard
          title="Utilisateurs"
          value={totalUsers || 0}
          icon={Users}
          color="blue"
          href="/admin/users"
        />
        <KPICard
          title="Produits"
          value={totalProducts || 0}
          icon={Package}
          color="green"
        />
      </div>

      {/* Pending Shops Section */}
      {pendingShops && pendingShops.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-lg text-yellow-800">
                Boutiques en attente de validation ({pendingShops.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingShops.map((shop: any) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{shop.name}</p>
                    <p className="text-sm text-gray-500">
                      {shop.profiles?.email || 'Email non disponible'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={async () => {
                      'use server'
                      await activateShop(shop.id)
                    }}>
                      <Button type="submit" size="sm" variant="primary">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                    </form>
                    <Link href={`/admin/shops/${shop.id}`}>
                      <Button size="sm" variant="ghost">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Sections - 2 columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Boutiques Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Store className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Boutiques</CardTitle>
                <CardDescription>Gérer toutes les boutiques</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {recentShops?.slice(0, 3).map((shop: any) => (
                <div key={shop.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{shop.name}</span>
                  <ShopStatusBadge isActive={shop.is_active} />
                </div>
              ))}
            </div>
            <Link href="/admin/shops">
              <Button variant="secondary" className="w-full">
                Voir {totalShops} boutiques
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>Gérer les rôles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {totalUsers} utilisateurs enregistrés sur la plateforme
            </p>
            <Link href="/admin/users">
              <Button variant="secondary" className="w-full">
                Voir {totalUsers} utilisateurs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Moderation Section (Static for MVP) */}
      <Card className="border border-red-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-lg">Alertes & Modération</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Static alerts for MVP */}
            <AlertItem
              type="warning"
              message="Boutique inactive depuis 30j: Electronics Store"
              date="Il y a 2 jours"
            />
            <AlertItem
              type="info"
              message="5 nouvelles inscriptions cette semaine"
              date="Aujourd'hui"
            />
            <AlertItem
              type="success"
              message="Aucun produit signalé en attente"
              date="À jour"
            />
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Système de modération avancé disponible prochainement
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * KPI Card Component
 */
interface KPICardProps {
  title: string
  value: number
  icon: React.ElementType
  color: 'blue' | 'orange' | 'green'
  href?: string
}

function KPICard({ title, value, icon: Icon, color, href }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
  }

  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`${colorClasses[color]} p-3 rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

/**
 * Alert Item Component
 */
interface AlertItemProps {
  type: 'warning' | 'info' | 'success'
  message: string
  date: string
}

function AlertItem({ type, message, date }: AlertItemProps) {
  const styles = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  }

  return (
    <div className={`p-3 rounded-lg border ${styles[type]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-70">{date}</span>
      </div>
    </div>
  )
}
