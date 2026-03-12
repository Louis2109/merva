// components/admin/admin-actions-menu.tsx
// Admin Actions Menu - Suspend, Activate, Upgrade Plan

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { suspendShop, activateShop, upgradeShopPlan } from '@/lib/actions/admin'
import { PlayCircle, PauseCircle, TrendingUp, Loader2 } from 'lucide-react'

interface AdminActionsMenuProps {
  shop: {
    id: string
    name: string
    is_active: boolean
    plan_id: number
  }
}

/**
 * Admin Actions Menu
 * 
 * Allows admin to:
 * - Suspend shop (set is_active = false)
 * - Activate shop (set is_active = true)
 * - Upgrade plan (change plan_id)
 * 
 * Pattern:
 * - Client Component (for interactivity)
 * - Uses Server Actions for mutations
 * - useTransition for pending states
 */
export function AdminActionsMenu({ shop }: AdminActionsMenuProps) {
  const [isPending, startTransition] = useTransition()
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      alert('Veuillez entrer une raison')
      return
    }

    startTransition(async () => {
      try {
        await suspendShop(shop.id, suspendReason)
        setShowSuspendDialog(false)
        setSuspendReason('')
        alert('Boutique suspendue avec succès')
      } catch (error) {
        alert('Erreur: ' + (error as Error).message)
      }
    })
  }

  const handleActivate = () => {
    if (!confirm(`Activer la boutique "${shop.name}" ?`)) return

    startTransition(async () => {
      try {
        await activateShop(shop.id)
        alert('Boutique activée avec succès')
      } catch (error) {
        alert('Erreur: ' + (error as Error).message)
      }
    })
  }

  const handleUpgrade = (planId: number) => {
    const planNames = { 1: 'Free', 2: 'Standard', 3: 'Premium' }
    if (!confirm(`Changer le plan vers ${planNames[planId as 1 | 2 | 3]} ?`)) return

    startTransition(async () => {
      try {
        await upgradeShopPlan(shop.id, planId)
        setShowUpgradeMenu(false)
        alert('Plan mis à jour avec succès')
      } catch (error) {
        alert('Erreur: ' + (error as Error).message)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Suspend/Activate Button */}
      {shop.is_active ? (
        <Button
          variant="secondary"
          onClick={() => setShowSuspendDialog(!showSuspendDialog)}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PauseCircle className="w-4 h-4 mr-2" />
          )}
          Suspendre
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleActivate}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlayCircle className="w-4 h-4 mr-2" />
          )}
          Activer
        </Button>
      )}

      {/* Upgrade Plan Button */}
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setShowUpgradeMenu(!showUpgradeMenu)}
          disabled={isPending}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Changer Plan
        </Button>

        {/* Upgrade Dropdown */}
        {showUpgradeMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="py-1">
              <button
                onClick={() => handleUpgrade(1)}
                disabled={shop.plan_id === 1 || isPending}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Free (20 produits)
              </button>
              <button
                onClick={() => handleUpgrade(2)}
                disabled={shop.plan_id === 2 || isPending}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Standard (50 produits)
              </button>
              <button
                onClick={() => handleUpgrade(3)}
                disabled={shop.plan_id === 3 || isPending}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Premium (100 produits)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Dialog (Simple Modal) */}
      {showSuspendDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Suspendre la boutique
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              La boutique sera invisible publiquement. Le propriétaire pourra toujours accéder à son dashboard.
            </p>
            <textarea
              placeholder="Raison de la suspension (obligatoire)"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSuspendDialog(false)
                  setSuspendReason('')
                }}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="secondary"
                onClick={handleSuspend}
                disabled={isPending || !suspendReason.trim()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suspension...
                  </>
                ) : (
                  'Confirmer'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
