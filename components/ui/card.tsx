// components/ui/card.tsx
// Reusable card component with Glassmorphism effect

import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

/**
 * Card Props - Extends native div attributes
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant
   * - glass: Glassmorphism effect (backdrop-blur, semi-transparent)
   * - solid: Solid white background
   * - bordered: White with visible border
   */
  variant?: 'glass' | 'solid' | 'bordered'
}

/**
 * Card container component (Glassmorphism signature style)
 * 
 * Glassmorphism effect:
 * - backdrop-blur-lg: Blurs background behind card
 * - bg-white/30: Semi-transparent white (30% opacity)
 * - border-white/20: Subtle white border (20% opacity)
 * - shadow-xl: Deep shadow for depth
 * 
 * Usage:
 * ```tsx
 * <Card variant="glass">
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Description here</p>
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'solid', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl',
          
          // Variant styles
          variant === 'glass' && 
            'bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl',
          variant === 'solid' && 
            'bg-white shadow-lg',
          variant === 'bordered' && 
            'bg-white border border-gray-200 shadow-md',
          
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

/**
 * CardHeader - Top section of card
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

/**
 * CardTitle - Title text in card header
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

/**
 * CardDescription - Subtitle in card header
 */
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-600', className)}
        {...props}
      />
    )
  }
)

CardDescription.displayName = 'CardDescription'

/**
 * CardContent - Main content area of card
 */
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

/**
 * CardFooter - Bottom section of card (actions, buttons)
 */
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'
