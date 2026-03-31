// app/admin/layout.tsx
// Admin Layout - Wrapper with authentication check

import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">🔧 Admin Panel</h1>
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">
              Mervason v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Admin Navigation - REMOVED for clean UI */}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}


