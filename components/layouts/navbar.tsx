// components/layouts/navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/actions/auth'

/**
 * Glassmorphism Navbar with mobile responsiveness
 * 
 * Navigation structure :
 * - Home: Landing page
 * - Products: Main discovery page with filters
 * - Dashboard: Seller tools (conditionally shown)
 * 
 */

import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user?: User | null
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors"
            onClick={closeMobileMenu}
          >
            Mervason
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <NavLink href="/" icon={<Home className="w-4 h-4" />}>
              Home
            </NavLink>
            <NavLink href="/products" icon={<ShoppingBag className="w-4 h-4" />}>
              Products
            </NavLink>
            {user && (
              <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </NavLink>
            )}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-2 bg-white/95 backdrop-blur-lg border-t border-gray-200">
          <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} onClick={closeMobileMenu}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/products" icon={<ShoppingBag className="w-5 h-5" />} onClick={closeMobileMenu}>
            Products
          </MobileNavLink>
          {user && (
            <MobileNavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} onClick={closeMobileMenu}>
              Dashboard
            </MobileNavLink>
          )}
          
          {/* Mobile CTA */}
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <form action={logout}>
                <Button variant="ghost" size="md" className="w-full" type="submit">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/auth/login" onClick={closeMobileMenu}>
                <Button variant="primary" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

/**
 * Desktop Navigation Link Component
 */
interface NavLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

/**
 * Mobile Navigation Link Component
 */
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void
}

function MobileNavLink({ href, icon, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
