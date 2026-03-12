// app/admin/shops/[id]/page.tsx
// Admin Shop Details - View shop details and perform actions

import { getShopDetailsAdmin } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShopStatusBadge } from '@/components/admin/shop-status-badge'
import { AdminActionsMenu } from '@/components/admin/admin-actions-menu'
import { Store, User, Calendar, Package, CreditCard } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

/**
 * Admin Shop Details Page
 * 
 * Features:
 * - View complete shop information
 * - View shop owner details
 * - View products list
 * - Perform actions (suspend, activate, upgrade plan)
 * 
 * Pattern:
 * - Server Component
 * - Client Actions via Server Actions (form submission)
 */
export default async function AdminShopDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  let shopData

  try {
    shopData = await getShopDetailsAdmin(params.id)
  } catch (error) {
    console.error('[ADMIN] Shop details error:', error)
    notFound()
  }

  const { shop, productsCount, products } = shopData
  const owner = shop.profiles
  const plan = shop.plans

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/shops">
        <Button variant="ghost" size="sm">
          ← Retour à la liste
        </Button>
      </Link>

      {/* Shop Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            {shop.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {shop.name}
            </h1>
            <div className="flex items-center gap-3">
              <ShopStatusBadge isActive={shop.is_active} />
              <span className="text-sm text-gray-500">
                /{shop.slug}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <AdminActionsMenu shop={shop} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Propriétaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900">
              {owner?.first_name} {owner?.last_name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ID: {owner?.id.slice(0, 8)}...
            </p>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Plan actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900 capitalize">
              {plan?.name || 'Free'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {plan?.price === 0 ? 'Gratuit' : `${plan?.price} XAF/mois`}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Limite: {plan?.product_limit} produits
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900">
              {productsCount} / {plan?.product_limit}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {plan?.product_limit - productsCount} restants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shop Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Informations de la boutique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Description" value={shop.description || 'Aucune description'} />
          <InfoRow label="WhatsApp" value={shop.whatsapp_number} />
          <InfoRow 
            label="Créée le" 
            value={new Date(shop.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} 
          />
          {!shop.is_active && (
            <>
              <InfoRow 
                label="Désactivée le" 
                value={shop.deactivated_at ? new Date(shop.deactivated_at).toLocaleDateString('fr-FR') : 'N/A'} 
              />
              <InfoRow label="Raison" value={shop.deactivated_reason || 'N/A'} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Produits de la boutique ({productsCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  {product.image_url && (
                    <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.title}</h4>
                    <p className="text-sm text-gray-600">{product.price} XAF</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </p>
                    {!product.is_active && (
                      <p className="text-xs text-red-500">Inactif</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aucun produit dans cette boutique
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Info Row Component
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  )
}
