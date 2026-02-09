// lib/utils.ts
// Utility functions for the application

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts
 * 
 * Why this function?
 * - Handles conditional classes cleanly
 * - Resolves Tailwind conflicts (e.g., "text-red text-blue" → only "text-blue" applies)
 * - Type-safe with TypeScript
 * 
 * Usage examples:
 * ```tsx
 * // Basic usage
 * cn('text-base', 'font-bold')
 * // → "text-base font-bold"
 * 
 * // Conditional classes
 * cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')
 * // → "btn btn-active" (if isActive=true, isDisabled=false)
 * 
 * // Resolving conflicts (last valid class wins)
 * cn('text-red-500', 'text-blue-500')
 * // → "text-blue-500"
 * 
 * // With props.className (common in reusable components)
 * cn('default-styles', props.className)
 * ```
 * 
 * @param inputs - Array of class names (strings, booleans, undefined, null)
 * @returns Merged className string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
