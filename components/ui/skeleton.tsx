// components/ui/skeleton.tsx
// Skeleton loading component for loading states

import { cn } from '@/lib/utils'

/**
 * Skeleton Component
 * 
 * Used to show placeholder loading states
 * Animated pulsing effect
 * 
 * Usage:
 * ```tsx
 * <Skeleton className="h-10 w-full" />
 * ```
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    />
  )
}
