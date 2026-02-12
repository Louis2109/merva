// app/error.tsx
// Global error boundary for unhandled errors

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

/**
 * Global Error Boundary
 * 
 * Catches unhandled errors in the application
 * Provides user-friendly error message and recovery option
 * 
 * Features:
 * - Error logging to console (can be replaced with error tracking service)
 * - Reset button to attempt recovery
 * - User-friendly message
 * 
 * Triggered by:
 * - Unhandled exceptions in Server Components
 * - Network errors
 * - Database connection issues
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (replace with error tracking service in production)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-6">
            Désolé, quelque chose s'est mal passé. Veuillez réessayer.
          </p>
          
          {/* Show error message in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 rounded text-left">
              <p className="text-sm text-gray-700 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="primary">
              Réessayer
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="secondary"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
