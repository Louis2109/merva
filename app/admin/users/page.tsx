// app/admin/users/page.tsx
// Admin Users List - View all users with their roles

import { createServerClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Store, Shield } from 'lucide-react'

/**
 * Admin Users Page
 * 
 * Features:
 * - View all registered users
 * - See their roles (Admin, Merchant, Customer)
 * - See if they have a shop
 * 
 * TODO (Phase 2):
 * - Change user role
 * - Ban/Unban user
 * - View user activity
 */
export default async function AdminUsersPage() {
  const supabase = await createServerClient()

  // Fetch all users with their profiles and shops
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      shops (
        id,
        name,
        is_active
      )
    `)
    .order('created_at', { ascending: false })

  // Get auth users (to get email)
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()

  // Merge data (profile + email)
  const usersWithEmail = profiles?.map((profile: any) => {
    const authUser = authUsers?.find(u => u.id === profile.id)
    return {
      ...profile,
      email: authUser?.email || 'N/A'
    }
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">
          {usersWithEmail?.length || 0} utilisateur{(usersWithEmail?.length || 0) > 1 ? 's' : ''} inscrit{(usersWithEmail?.length || 0) > 1 ? 's' : ''}
        </p>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {usersWithEmail && usersWithEmail.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Utilisateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rôle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Boutique
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Inscrit le
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersWithEmail.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {(user.first_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.first_name || user.last_name 
                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                : 'Sans nom'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {user.is_admin && (
                            <Badge variant="error" className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </Badge>
                          )}
                          {user.is_merchant && (
                            <Badge variant="success" className="flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              Merchant
                            </Badge>
                          )}
                          {!user.is_admin && !user.is_merchant && (
                            <Badge variant="default" className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Customer
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {user.shops && user.shops.length > 0 ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.shops[0].name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.shops[0].is_active ? '✓ Active' : '⏸ Suspendue'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Aucune</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Aucun utilisateur trouvé
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
