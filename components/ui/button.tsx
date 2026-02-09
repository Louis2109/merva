// components/ui/button.tsx
// Reusable button component with variants (Design System)

import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * Button component props
 * Extends native HTML button attributes for full compatibility
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * - primary: Main action (orange CTA)
   * - secondary: Secondary action (blue)
   * - ghost: Subtle action (transparent)
   * - destructive: Dangerous action (red)
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  
  /**
   * Button size
   * - sm: Small (padding reduced)
   * - md: Medium (default)
   * - lg: Large (increased padding + text)
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Base button component following Design System
 * 
 * Why forwardRef?
 * - Allows parent components to access the button DOM element
 * - Needed for accessibility (focus management)
 * - Common pattern in component libraries
 * 
 * Design System colors:
 * - Primary (Action): Orange #F97316
 * - Secondary (Trust): Blue #1E40AF
 * - Ghost: Transparent with hover effect
 * 
 * Usage:
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Buy Now
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles (always applied)
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variant styles
          variant === 'primary' && 
            'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500',
          variant === 'secondary' && 
            'bg-blue-900 text-white hover:bg-blue-800 focus-visible:ring-blue-900',
          variant === 'ghost' && 
            'bg-transparent hover:bg-gray-100 text-gray-900',
          variant === 'destructive' && 
            'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
          
          // Size styles
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-11 px-5 text-base',
          size === 'lg' && 'h-14 px-8 text-lg',
          
          // Custom className from props (overrides if needed)
          className
        )}
        {...props}
      />
    )
  }
)

// Display name for React DevTools
Button.displayName = 'Button'
