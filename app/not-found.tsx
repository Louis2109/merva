// app/not-found.tsx
// Custom 404 page for not found routes

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

/**
 * Custom 404 Not Found Page
 * 
 * Displayed when:
 * - User navigates to non-existent route
 * - Product/shop slug doesn't exist and notFound() is called
 * 
 * Features:
 * - User-friendly message
 * - Navigation options (home, products)
 * - Consistent design with app
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page introuvable
          </h2>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Voir les produits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Page introuvable - Mervason',
  description: 'La page demandée n\'existe pas',
}
