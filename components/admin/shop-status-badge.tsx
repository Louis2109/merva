// components/admin/shop-status-badge.tsx
// Badge component for shop status (Active/Suspended)

import { Badge } from '@/components/ui/badge'

interface ShopStatusBadgeProps {
  isActive: boolean
}

/**
 * Shop Status Badge
 * 
 * Visual indicator of shop status
 * - Green: Active (shop visible publicly)
 * - Red: Suspended (shop hidden)
 */
export function ShopStatusBadge({ isActive }: ShopStatusBadgeProps) {
  if (isActive) {
    return (
      <Badge variant="success">
        ✓ Active
      </Badge>
    )
  }

  return (
    <Badge variant="error">
      ⏸ Suspendue
    </Badge>
  )
}
