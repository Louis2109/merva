// components/ui/label.tsx
// Reusable label component for forms

import { cn } from '@/lib/utils'
import { type LabelHTMLAttributes, forwardRef } from 'react'

/**
 * Form label component with consistent styling
 * 
 * Features:
 * - Consistent styling across all forms
 * - Disabled state support
 * - Works with Input component
 * 
 * Usage:
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * ```
 */
export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})

Label.displayName = 'Label'
