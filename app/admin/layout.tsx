// app/admin/layout.tsx
// Admin Layout - Wrapper with authentication check

import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Store, Users, ArrowLeft } from 'lucide-react'

/**
 * Admin Layout
 * 
 * Purpose:
 * - Protect all /admin/* routes (redirect non-admins)
 * - Provide consistent admin navigation
 * - Different styling from main dashboard (admin theme)
 * 
 * Security:
 * - requireAdmin() checks is_admin flag
 * - Redirects to /dashboard if not admin
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin access (redirects if not admin)
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Admin Header */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">🔧 Admin Panel</h1>
              <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                Mervason v1.0
              </span>
            </div>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm hover:text-blue-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <NavLink href="/admin" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/shops" icon={Store}>
              Boutiques
            </NavLink>
            <NavLink href="/admin/users" icon={Users}>
              Utilisateurs
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

/**
 * Navigation Link Component
 */
function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition"
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  )
}
