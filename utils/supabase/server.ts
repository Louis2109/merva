// merva/utils/supabase/server.ts
// Supabase client for Server Components and Server Actions
// Utilise les cookies pour maintenir la session utilisateur

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Crée un client Supabase pour Server Components
 * 
 * Pourquoi cette fonction ?
 * - Server Components ne peuvent pas accéder directement au navigateur
 * - On utilise les cookies Next.js pour stocker la session
 * - Gestion automatique de l'authentification côté serveur
 * 
 * Où l'utiliser ?
 * - Server Components (pages, layouts)
 * - Server Actions (fonctions 'use server')
 * - Route Handlers (app/api/*)
 * 
 * @returns Client Supabase configuré avec cookies
 */
export async function createServerClient() {
  // Récupérer le cookie store de Next.js
  const cookieStore = await cookies()

  // Créer le client Supabase avec gestion des cookies
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Lire un cookie spécifique
        getAll() {
          return cookieStore.getAll()
        },
        // Définir un cookie (pour la session)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Cette fonction est appelée depuis un Server Component
            // Les cookies ne peuvent être modifiés seulement dans Server Actions ou Route Handlers
          }
        },
      },
    }
  )
}

/**
 * Create anonymous Supabase client for build-time operations
 * 
 * Why this function?
 * - generateStaticParams() runs at BUILD TIME (no HTTP request)
 * - No cookies available at build time
 * - Need public data only (no user-specific data)
 * 
 * Where to use?
 * - generateStaticParams() only
 * - Do NOT use for authenticated routes
 * - Only for public data fetching
 * 
 * Difference from createServerClient():
 * - ✅ Works at build time
 * - ✅ No cookies needed
 * - ❌ Cannot access user-specific data
 * 
 * @returns Anonymous Supabase client (public access only)
 */
export function createAnonymousClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
