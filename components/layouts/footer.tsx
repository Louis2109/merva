// components/layouts/footer.tsx
// Footer component - Bottom navigation & info

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

/**
 * Footer Component
 * 
 * Features:
 * - Quick links (Products, Pricing, Dashboard)
 * - Seller info
 * - Legal links
 * - Contact info
 * - Social links placeholder
 * 
 * Design:
 * - Dark background (gray-900)
 * - Orange accent for links
 * - Responsive grid layout
 * 
 * Usage:
 * - Place after <main> in root layout
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-500">Mervason</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Découvrez les meilleurs produits locaux. Connectez-vous directement avec les vendeurs.
            </p>
            <div className="text-xs text-gray-500">
              <p>Cameroun 🇨🇲</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Nos tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Pour Vendeurs</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/auth/register" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Créer mon compte
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Mon dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/shop/create" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Creer boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Plus d'infos</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Support
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  CGU
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>
              © {currentYear} Mervason. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-orange-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
