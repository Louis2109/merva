// app/admin/shops/page.tsx
// Admin Shops List - View and manage all shops

import { getShopsAdmin } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShopStatusBadge } from '@/components/admin/shop-status-badge'
import { Eye } from 'lucide-react'

/**
 * Admin Shops List Page
 * 
 * Features:
 * - View all shops
 * - Filter by status (all/active/suspended)
 * - Quick actions per shop
 * - Navigate to details page
 * 
 * Pattern:
 * - Server Component
 * - Fetch data with Server Action
 * - Simple HTML table (KISS for MVP)
 */
export default async function AdminShopsPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const filter = (searchParams.filter || 'all') as 'all' | 'active' | 'suspended'
  
  // Fetch shops
  const shops = await getShopsAdmin(filter)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Boutiques
          </h1>
          <p className="text-gray-600">
            {shops.length} boutique{shops.length > 1 ? 's' : ''} trouvée{shops.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <FilterButton href="/admin/shops?filter=all" active={filter === 'all'}>
            Toutes
          </FilterButton>
          <FilterButton href="/admin/shops?filter=active" active={filter === 'active'}>
            Actives
          </FilterButton>
          <FilterButton href="/admin/shops?filter=suspended" active={filter === 'suspended'}>
            Suspendues
          </FilterButton>
        </div>
      </div>

      {/* Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          {shops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Boutique
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Propriétaire
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Créée le
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shops.map((shop: any) => (
                    <tr key={shop.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {shop.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{shop.name}</p>
                            <p className="text-xs text-gray-500">/{shop.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">
                          {shop.profiles?.first_name} {shop.profiles?.last_name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {shop.plans?.name || 'free'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <ShopStatusBadge isActive={shop.is_active} />
                        {!shop.is_active && shop.deactivated_reason && (
                          <p className="text-xs text-gray-500 mt-1">
                            Raison: {shop.deactivated_reason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(shop.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/admin/shops/${shop.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Aucune boutique trouvée avec ce filtre
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Filter Button Component
 */
function FilterButton({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <Button
        variant={active ? 'primary' : 'ghost'}
        size="sm"
      >
        {children}
      </Button>
    </Link>
  )
}
