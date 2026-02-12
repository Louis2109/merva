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

/**
 * Generate URL-friendly slug from text
 * 
 * Transformation rules:
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove accents (é → e, à → a)
 * - Remove special characters
 * - Remove consecutive hyphens
 * - Trim hyphens from start/end
 * 
 * Examples:
 * - "Ma Super Boutique" → "ma-super-boutique"
 * - "Électronique & Gaming!" → "electronique-gaming"
 * - "Café   Resto" → "cafe-resto"
 * 
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    // Remove accents (normalize to NFD, then remove diacritics)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from start/end
    .replace(/^-+|-+$/g, '')
}

/**
 * Format price with thousand separators (French format)
 * 
 * Cameroon uses XAF (Central African CFA franc) with French number formatting
 * 
 * Examples:
 * - 25000 → "25 000"
 * - 1500 → "1 500"
 * - 999 → "999"
 * 
 * @param price - Price in XAF (integer)
 * @returns Formatted price string with space separators
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
