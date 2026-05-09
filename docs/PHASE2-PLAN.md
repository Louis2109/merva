# 🔐 PHASE 2: AUTH AVANCÉ - PLAN D'IMPLÉMENTATION COMPLET

## 📋 VISION GLOBALE

**Objectif:** Système d'authentification professionnel avec OAuth, vérification email obligatoire, et gestion de sessions robuste.

### Architecture Finale:
```
┌─────────────────────────────────────────────┐
│          Page Login/Register                 │
├─────────────────────────────────────────────┤
│  • Email/Password (existant)                │
│  • Google OAuth Button ← NEW                │
│  • Apple OAuth Button ← NEW                 │
│  • Facebook OAuth Button ← NEW              │
└──────────────┬──────────────────────────────┘
               │
               ▼
       ┌───────────────────┐
       │ Supabase Auth     │
       ├───────────────────┤
       │ • JWT Token       │
       │ • Refresh Token   │
       │ • Session         │
       └────────┬──────────┘
                │
    ┌───────────┴────────────┐
    ▼                        ▼
┌──────────────┐      ┌─────────────────┐
│ Auth Table   │      │ Email Verified? │
├──────────────┤      ├─────────────────┤
│ • user_id    │      │ ✅ YES → Login  │
│ • email      │      │ ❌ NO → Verify  │
│ • provider   │      │    Email Page   │
└──────────────┘      └─────────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌─────────────┐  ┌──────────┐
             │ Dashboard   │  │ /verify  │
             │ (vendeur)   │  │ -email   │
             └─────────────┘  └──────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
     ┌────────┐          ┌─────────────┐
     │ /admin │          │ /dashboard  │
     │        │          │ (buyer)     │
     └────────┘          └─────────────┘
```

---

## 🎯 ÉTAPES D'IMPLÉMENTATION (7 PHASES)

### **PHASE 2.1: Configuration Supabase OAuth** ⏱️ 30 min (MANUAL)
**Dépendance:** Aucune  
**Blocage:** Aucun

**Objectif:** Configurer les credentials OAuth chez Google, Apple, Facebook

#### Étapes:

##### A. **Google OAuth Setup**
1. Aller sur: https://console.cloud.google.com/
2. Créer un nouveau projet: "Mervason Marketplace"
3. Aller à `APIs & Services` → `Credentials`
4. Créer une "OAuth 2.0 Client ID" (type: Web Application)
5. Redirect URIs à ajouter:
   - `http://localhost:3000/auth/callback`
   - `https://mervason.vercel.app/auth/callback`
   - `https://fuimqugdecmjgttseevk.supabase.co/auth/v1/callback?provider=google`
6. Copier: `Client ID` et `Client Secret`

##### B. **Facebook OAuth Setup** (Optionnel, plus complexe)
1. Aller sur: https://developers.facebook.com/
2. Créer une app: "Mervason"
3. Ajouter produit: `Facebook Login`
4. Configuration → OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://mervason.vercel.app/auth/callback`
5. Copier: `App ID` et `App Secret`

##### C. **Apple OAuth Setup** (Production only)
1. Aller sur: https://developer.apple.com/
2. Créer une "Service ID" pour "Mervason"
3. Configuration: Same Redirect URIs
4. Copier: `Team ID`, `Service ID`, `Key ID`
5. Générer Private Key (télécharger .p8)

##### D. **Configurer dans Supabase**
1. Aller sur: https://supabase.com/dashboard → merva
2. `Authentication` → `Providers`
3. **Google:**
   - Activer le toggle
   - Paster `Client ID` et `Client Secret`
   - Sauvegarder
4. **Facebook:** (Même procédure)
5. **Apple:** (Même procédure, plus complexe)

---

### **PHASE 2.2: Email Verification - Database Setup** ⏱️ 15 min
**Dépendance:** PHASE 2.1 (partiellement)  
**Blocage:** Non (à faire en parallèle de 2.1)

**Objectif:** Ajouter colonne `email_verified_at` pour tracker la vérification

#### Étapes:

1. **Créer Migration SQL:**

```sql
-- Migration: 002_add_email_verification.sql

-- Add email_verified_at column to profiles table
ALTER TABLE profiles
ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add index for performance
CREATE INDEX idx_profiles_email_verified_at ON profiles(email_verified_at);

-- Update existing users as verified (they already have confirmed emails)
UPDATE profiles
SET email_verified_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT u.id FROM auth.users u
  WHERE u.email_confirmed_at IS NOT NULL
);

-- Comment explaining the column
COMMENT ON COLUMN profiles.email_verified_at IS 'Timestamp when user confirmed their email address. NULL means not verified.';
```

2. **Exécuter dans Supabase SQL Editor:**
   - Copier le SQL ci-dessus
   - Aller à `SQL Editor` dans Supabase Dashboard
   - Coller et exécuter
   - Vérifier les logs

3. **Types TypeScript Update:**
   - Mettre à jour `types/database.ts` avec nouvelle colonne

---

### **PHASE 2.3: UI Login/Register - OAuth Buttons** ⏱️ 45 min (CODE)
**Dépendance:** PHASE 2.1 (Supabase config)  
**Blocage:** PHASE 2.2 (partiellement)

**Objectif:** Ajouter boutons Google/Apple/Facebook sur pages login/register

#### Fichiers à créer/modifier:

**NEW:** `components/ui/oauth-button.tsx`
```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Icon } from 'lucide-react'

interface OAuthButtonProps {
  provider: 'google' | 'apple' | 'facebook'
  onClick: () => Promise<void>
  isLoading?: boolean
}

export function OAuthButton({ provider, onClick, isLoading }: OAuthButtonProps) {
  const config = {
    google: { label: 'Google', icon: '🔍', color: 'bg-white text-black border border-gray-300' },
    apple: { label: 'Apple', icon: '🍎', color: 'bg-black text-white' },
    facebook: { label: 'Facebook', icon: '👥', color: 'bg-blue-600 text-white' },
  }

  const cfg = config[provider]

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg font-medium transition ${cfg.color} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      }`}
    >
      <span className="mr-2">{cfg.icon}</span>
      {isLoading ? 'Connexion...' : `Continuer avec ${cfg.label}`}
    </button>
  )
}
```

**MODIFY:** `app/auth/login/page.tsx`
- Ajouter OAuth buttons avant/après formulaire email/password
- Ajouter onClick handlers

**MODIFY:** `app/auth/register/page.tsx`
- Ajouter OAuth buttons (même design)
- Optionnel: Skip "nom prénom" si OAuth

---

### **PHASE 2.4: OAuth Redirect & Callback** ⏱️ 60 min (CODE)
**Dépendance:** PHASE 2.3  
**Blocage:** PHASE 2.2

**Objectif:** Gérer le redirect vers Supabase et le callback

#### Fichiers à créer/modifier:

**NEW:** `lib/actions/oauth.ts` (Server Actions)
```typescript
'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithOAuth(provider: 'google' | 'apple' | 'facebook') {
  const supabase = await createServerClient()
  
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('OAuth error:', error)
    redirect('/auth/login?error=oauth_failed')
  }

  if (data?.url) {
    redirect(data.url)
  }
}
```

**NEW:** `app/auth/callback/route.ts` (API Route)
```typescript
import { createServerClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (code) {
    const supabase = await createServerClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to email verification or dashboard
      return NextResponse.redirect(new URL('/auth/verify-email', request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=callback', request.url))
}
```

---

### **PHASE 2.5: Email Verification Enforcement** ⏱️ 60 min (CODE)
**Dépendance:** PHASE 2.2 + PHASE 2.4  
**Blocage:** PHASE 2.6 (partiellement)

**Objectif:** Vérifier que email est confirmé avant d'accéder au dashboard

#### Fichiers à créer/modifier:

**NEW:** `app/auth/verify-email/page.tsx`
```typescript
// Page shown when user logs in but email not verified
// Shows: "Check your email" message + resend button
```

**MODIFY:** `middleware.ts`
- Vérifier `email_verified_at` pour accès `/dashboard`
- Si NULL → redirect `/auth/verify-email`

**MODIFY:** `lib/actions/auth.ts`
- Ajouter action `resendVerificationEmail()`
- Ajouter action `markEmailAsVerified()` (après clique lien)

---

### **PHASE 2.6: Session Management Robuste** ⏱️ 90 min (CODE)
**Dépendance:** PHASE 2.4  
**Blocage:** PHASE 2.7

**Objectif:** Refresh tokens automatiques, logout propre, session check

#### Fichiers à créer/modifier:

**NEW:** `components/auth/session-provider.tsx`
```typescript
'use client'
// Client wrapper pour gérer les sessions et refresh
// Vérifie toutes les 5 min si token expire
// Refresh automatiquement si < 5 min avant expiration
```

**MODIFY:** `utils/supabase/client.ts`
- Ajouter listener pour `onAuthStateChange`
- Gérer le refresh automatique

**NEW:** `lib/actions/session.ts`
```typescript
export async function refreshSession() {
  // Refresh le JWT token
}

export async function logout() {
  // Logout propre + redirect
}
```

---

### **PHASE 2.7: Role-Based Redirects** ⏱️ 45 min (CODE)
**Dépendance:** PHASE 2.5 + PHASE 2.6  
**Blocage:** PHASE 2.8

**Objectif:** Redirection intelligente selon le rôle (vendeur/acheteur/admin)

#### Fichiers à créer/modifier:

**MODIFY:** `lib/actions/auth.ts`
- Update login action: Vérifier `is_admin` + `is_seller`
- Rediriger vers `/admin`, `/dashboard`, ou `/` selon rôle

**MODIFY:** `middleware.ts`
- Ajouter vérification de rôle
- Empêcher accès `/admin` si pas admin
- Empêcher accès `/dashboard` si pas seller

**NEW:** `utils/auth/get-role.ts`
```typescript
export async function getUserRole() {
  // Retourne: 'admin' | 'seller' | 'buyer'
}
```

---

### **PHASE 2.8: Protected Routes & Complete Middleware** ⏱️ 60 min (CODE)
**Dépendance:** PHASE 2.7  
**Blocage:** Aucun (final)

**Objectif:** Middleware complet et routes protégées

#### Fichiers à créer/modifier:

**MODIFY:** `middleware.ts` (Version finale)
```
Routes:
- /dashboard/* → Seller only, email verified
- /admin/* → Admin only
- /auth/* → Public (sauf si already logged in)
- /* → Public (accès libre)

Vérifications:
1. Session exists?
2. Email verified?
3. Role allowed for this route?
4. Redirect appropriately
```

**NEW:** `lib/utils/route-guard.ts`
```typescript
// Utilities pour protéger les routes côté client
```

---

## 📊 DEPENDENCY CHART

```
PHASE 2.1 (Config) ──┐
                     ├─→ PHASE 2.3 (UI Buttons)
                     │          ↓
                     │      PHASE 2.4 (Callback)
                     │          ↓
PHASE 2.2 (DB) ──────┤      PHASE 2.5 (Email Verify)
                     │          ↓
                     │      PHASE 2.6 (Session)
                     │          ↓
                     └─→ PHASE 2.7 (Role Redirect)
                            ↓
                       PHASE 2.8 (Middleware Final)
```

**Chemin Critique:** 2.1 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7 → 2.8
**Parallèle:** 2.2 peut commencer en même temps que 2.1

---

## 🧪 TESTING CHECKLIST (Par Phase)

### PHASE 2.1: Configuration Supabase
- [ ] Google OAuth configured in Supabase dashboard
- [ ] Apple OAuth configured (optional for dev)
- [ ] Facebook OAuth configured (optional for dev)
- [ ] Redirect URIs match exactly
- [ ] Credentials saved correctly

### PHASE 2.2: Email Verification DB
- [ ] Migration executed successfully
- [ ] Column `email_verified_at` exists
- [ ] Index created
- [ ] Types updated in `types/database.ts`
- [ ] Query test: Check existing users have timestamp

### PHASE 2.3: OAuth Buttons UI
- [ ] Google button appears on `/auth/login`
- [ ] Google button appears on `/auth/register`
- [ ] Apple button appears (if configured)
- [ ] Facebook button appears (if configured)
- [ ] Buttons are styled and responsive
- [ ] Loading state works when clicked

### PHASE 2.4: OAuth Redirect & Callback
- [ ] Click Google button → Redirects to Google login
- [ ] Complete Google login → Callback received
- [ ] User session created in Supabase
- [ ] Redirect to `/auth/verify-email`
- [ ] No console errors
- [ ] Try Apple (if configured)
- [ ] Try Facebook (if configured)

### PHASE 2.5: Email Verification
- [ ] New OAuth users land on `/auth/verify-email`
- [ ] Existing verified users go to `/dashboard`
- [ ] "Resend email" button works
- [ ] Verification link in email works
- [ ] After verify: Can access `/dashboard`
- [ ] Non-verified users blocked from dashboard

### PHASE 2.6: Session Management
- [ ] Login → Session created
- [ ] Refresh browser → Session persists
- [ ] Session expires after 24h (or configured time)
- [ ] Token refresh happens automatically
- [ ] No duplicate refresh calls
- [ ] Logout button works
- [ ] After logout → Redirected to `/`
- [ ] Session cookie cleared

### PHASE 2.7: Role-Based Redirects
- [ ] Seller login → Redirects to `/dashboard`
- [ ] Admin login → Redirects to `/admin`
- [ ] Buyer OAuth → Redirects to `/`
- [ ] Seller tries `/admin` → Blocked, redirect to `/dashboard`
- [ ] Admin tries to modify seller products → Blocked
- [ ] Non-admin tries to view admin users → 404

### PHASE 2.8: Complete Middleware
- [ ] Public pages load without session
- [ ] Protected pages redirect to login if no session
- [ ] Session cookie missing → Fast redirect
- [ ] Session cookie exists → Check auth
- [ ] Role mismatch → Blocked with proper redirect
- [ ] Email not verified → Blocked with verify prompt
- [ ] All routes behave as expected

---

## 📦 DEPENDENCIES TO INSTALL

```bash
# No new packages needed! Everything in node_modules already
# But verify these are installed:
npm list next-auth  # Should be available via supabase
npm list lucide-react  # Icons for OAuth buttons
```

---

## ⏱️ TOTAL TIME ESTIMATE

| Phase | Task | Time |
|-------|------|------|
| 2.1 | Supabase OAuth Config | 30 min |
| 2.2 | Database Setup | 15 min |
| 2.3 | UI Buttons | 45 min |
| 2.4 | OAuth Callbacks | 60 min |
| 2.5 | Email Verification | 60 min |
| 2.6 | Session Management | 90 min |
| 2.7 | Role-Based Redirects | 45 min |
| 2.8 | Final Middleware | 60 min |
| **TOTAL** | **Complete Phase 2** | **~7-8 hours** |

### Breaking Down by Day:
- **Day 1:** 2.1 + 2.2 + 2.3 (90 min)
- **Day 2:** 2.4 + 2.5 (120 min)
- **Day 3:** 2.6 + 2.7 (135 min)
- **Day 4:** 2.8 + Final Testing (90 min)

---

## 🎯 SUCCESS CRITERIA

At the end of Phase 2:

✅ **Users can:**
- Register with Email/Password
- Register with Google OAuth
- Register with Apple OAuth (optional)
- Register with Facebook OAuth (optional)
- Email verification is required
- Verified users can access appropriate pages
- Sessions are secure and auto-refresh
- Logout works cleanly
- Role-based access works (admin ≠ seller ≠ buyer)
- Protected routes are actually protected
- No unauthorized access

✅ **Security:**
- Tokens auto-refresh before expiration
- Sessions timeout after 24h
- Email verification prevents bot accounts
- OAuth providers are properly configured
- CORS and redirects are secure

✅ **Performance:**
- No slowdowns with OAuth redirects
- Session checks fast (< 100ms)
- Callback handling smooth

---

## 📝 NEXT: Get Started?

Voulez-vous que je commence par **PHASE 2.1 (Configuration Supabase)**?

Je peux:
1. Créer un guide step-by-step détaillé avec screenshots
2. Ou directement coder les phases 2.3-2.8 pendant que vous faites 2.1-2.2 manuellement

Qu'est-ce qui vous convient?
