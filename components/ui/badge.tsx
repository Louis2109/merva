// components/ui/badge.tsx
// Badge component for status indicators

import { cn } from '@/lib/utils'

/**
 * Badge Component
 * 
 * Displays status badges with color variants
 * Used for: Stock status, product tags, shop status
 * 
 * Variants:
 * - success (green): Stock available, active status
 * - warning (orange): Limited stock, pending status
 * - error (red): Out of stock, inactive status
 * - default (gray): Neutral information
 */
interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'default'
  className?: string
  pulse?: boolean // Add pulse animation
}

export function Badge({ 
  children, 
  variant = 'default', 
  className,
  pulse = false 
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border',
        variantStyles[variant],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  )
}
