// components/ui/input.tsx
// Reusable input component with consistent styling

import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

/**
 * Input Props - Extends native HTML input attributes
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state for validation feedback
   * When true, applies red border and focus ring
   */
  error?: boolean
}

/**
 * Base input component with consistent styling
 * 
 * Features:
 * - Consistent height and padding across the app
 * - Focus ring for accessibility
 * - Error state styling
 * - Disabled state styling
 * - File input support
 * 
 * Why forwardRef?
 * - Allows forms to access the input element (e.g., focus())
 * - Needed for form libraries (React Hook Form)
 * 
 * Usage:
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   error={!!errors.email}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-11 w-full rounded-lg border px-3 py-2 text-base',
          'transition-colors placeholder:text-gray-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          
          // File input specific styles
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          
          // Default state (no error)
          !error && 'border-gray-300 focus-visible:ring-orange-500',
          
          // Error state
          error && 'border-red-500 focus-visible:ring-red-500',
          
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
