# 🔧 FIXES FINALES - À FAIRE MAINTENANT

## 📌 PRIORITÉS

```
CRITIQUE (Avant production):
1. Fix metadata domain → app/layout.tsx
2. Fix env vars → .env
3. Vérifier RLS policies → Supabase
4. Email templates → Supabase

IMPORTANT (Avant 48h):
5. Test pages complètement
6. Test mobile
7. Security review
8. Performance audit

OPTIONNEL (Après launch):
9. Analytics setup
10. Error monitoring (Sentry)
```

---

## FIX 1: METADATA - DOMAINE

**Fichier:** `app/layout.tsx`

**Ligne:** ~19

**À faire:**

```typescript
// ❌ AVANT (local/dev)
metadataBase: new URL('https://mervason.com'),

// ✅ APRÈS (production)
metadataBase: new URL('https://mervason.vercel.app'),

// OU si domain custom:
// metadataBase: new URL('https://mervason.cm'),
```

**Pourquoi:** Metadata doit pointer sur le bon domaine pour SEO et OpenGraph.

---

## FIX 2: ENVIRONMENT VARIABLES

**Fichier:** `.env`

**À vérifier/mettre à jour:**

```bash
# Local (pour dev - ✅ Déjà correct)
NEXT_PUBLIC_SUPABASE_URL=https://fuimqugdecmjgttseevk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PHONE_ADMIN_NUMBER=+237 691 921 049

# Mais pour PRODUCTION, remplacer localhost:
NEXT_PUBLIC_SITE_URL=https://mervason.vercel.app

# Cette var doit aussi être dans Vercel Dashboard!
```

**Pour Vercel:**
1. Aller: https://vercel.com/dashboard
2. Select project "merva"
3. Settings → Environment Variables
4. Ajouter:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://fuimqugdecmjgttseevk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   NEXT_PUBLIC_SITE_URL = https://mervason.vercel.app
   PHONE_ADMIN_NUMBER = +237 691 921 049
   ```

**Vérifier:** Pas d'autres variables secrètes exposées!

---

## FIX 3: SUPABASE - EMAIL TEMPLATES

**À faire dans Supabase Dashboard:**

### Étape 1: Aller aux Templates

1. https://supabase.com/dashboard
2. Select "merva" project
3. **Authentication** → **Email Templates**

### Étape 2: Configure "Confirm signup"

1. Cliquer sur **"Confirm signup"**
2. Cliquer **Edit** (top right)
3. Copier le HTML de: `docs/emails/update-email-templates.md` (Section 1)
4. Remplacer le **Body HTML** complètement
5. Change Subject à: `✅ Confirmez votre inscription Mervason`
6. Click **Save**

### Étape 3: Configure "Reset password"

1. Cliquer sur **"Reset password"**
2. Cliquer **Edit**
3. Copier le HTML de: `docs/emails/update-email-templates.md` (Section 2)
4. Remplacer le **Body HTML**
5. Change Subject à: `🔐 Réinitialiser votre mot de passe Mervason`
6. Click **Save**

### Étape 4: Test Email Configuration

1. Aller: `/auth/register`
2. Créer un compte test
3. Vérifier que l'email de confirmation reçu avec le nouveau template ✅

---

## FIX 4: SUPABASE - RLS POLICIES

**À vérifier dans Supabase SQL Editor:**

```sql
-- 1. Check RLS enabled sur toutes les tables
-- Aller: Database → Tables
-- Pour chaque table cliquer et vérifier "RLS Enabled"

-- 2. Vérifier les policies essentielles existent

-- Pour profiles:
SELECT * FROM postgres.pg_policies WHERE tablename = 'profiles';

-- Pour products:
SELECT * FROM postgres.pg_policies WHERE tablename = 'products';

-- Pour shops:
SELECT * FROM postgres.pg_policies WHERE tablename = 'shops';

-- 3. Test policy restrictive (connecté en tant qu'user normal)
-- Doit voir produits publics, pas produits privés
```

**Checklist:**
- [ ] `profiles` - RLS Enabled, Users see own only
- [ ] `shops` - RLS Enabled, Users edit own only
- [ ] `products` - RLS Enabled, Users edit own only
- [ ] `categories` - RLS Enabled, Public read
- [ ] `plans` - RLS Enabled, Public read

---

## FIX 5: SUPABASE - CORS CONFIGURATION

**À faire dans Supabase:**

1. **Settings** → **API** → **CORS**
2. Ajouter allowed origins:
   ```
   http://localhost:3000
   https://mervason.vercel.app
   https://mervason.cm (si custom domain)
   ```
3. Click **Save**

---

## FIX 6: NEXT.CONFIG - Vérifier

**Fichier:** `next.config.ts`

**Status:** ✅ **Déjà OK**

```typescript
// ✅ Images Supabase déjà configurées
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'fuimqugdecmjgttseevk.supabase.co',
    pathname: '/storage/v1/object/public/**',
  },
]
```

**Rien à faire ici!**

---

## FIX 7: MIDDLEWARE - Vérifier

**Fichier:** `middleware.ts`

**Status:** ✅ **Déjà optimisé**

```typescript
// ✅ Cookie check avant Supabase call
const hasSessionCookie = request.cookies.has('sb-...-auth-token')

// ✅ Fast redirect sans appel API
if (!hasSessionCookie) {
  return NextResponse.redirect(redirectUrl)
}
```

**Rien à faire ici!**

---

## FIX 8: PAGES - Vérifier Erreurs 404

**À faire:** Vérifier que les pages 404 existent

```bash
# Vérifier ces fichiers existent:
ls app/not-found.tsx    # ✅ Devrait exister
ls app/error.tsx         # ✅ Devrait exister
```

**Si manquants:** Les créer

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>404 - Page not found</h1>
    </div>
  )
}

// app/error.tsx
'use client'
export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Something went wrong</h1>
    </div>
  )
}
```

---

## FIX 9: BUILD TEST LOCAL

**À faire maintenant:**

```bash
# 1. Build local (comme Vercel va faire)
npm run build

# Résultat attendu: "compiled successfully ✓"
# Si erreurs: Fix avant de push!

# 2. Start le build local
npm run start

# 3. Test les pages
# http://localhost:3000 - Homepage
# http://localhost:3000/products - Products
# http://localhost:3000/auth/login - Login

# 4. Ctrl+C pour arrêter
```

---

## FIX 10: GIT COMMIT

```bash
# 1. Stage les changements
git add -A

# 2. Commit avec message descriptif
git commit -m "prod: finalize configuration for production

- Update metadata domain to production
- Configure email templates in Supabase
- Verify RLS policies
- Add production environment variables
- Optimize middleware cookie check"

# 3. Push à GitHub
git push origin main

# 4. Vérifier GitHub
# https://github.com/[user]/merva
# Devrait voir le dernier commit
```

---

## 📋 RÉSUMÉ DES ACTIONS

| Fix | Status | Temps | Priorité |
|-----|--------|-------|----------|
| 1. Metadata domain | ❌ À faire | 5 min | 🔴 CRITIQUE |
| 2. Env variables | ✅ Prêt | 10 min | 🔴 CRITIQUE |
| 3. Email templates | ❌ À faire | 15 min | 🔴 CRITIQUE |
| 4. RLS policies | ✅ À vérifier | 15 min | 🔴 CRITIQUE |
| 5. CORS config | ✅ À vérifier | 5 min | 🔴 CRITIQUE |
| 6. Next.config | ✅ Déjà OK | 0 min | ✅ |
| 7. Middleware | ✅ Déjà OK | 0 min | ✅ |
| 8. Error pages | ✅ Vérifier | 10 min | 🟡 Important |
| 9. Build test | ❌ À faire | 10 min | 🟡 Important |
| 10. Git commit | ❌ À faire | 5 min | 🟡 Important |

**Total Temps:** ~1-2 heures ⏱️

---

## 🚀 PROCHAINES ÉTAPES

### TODAY (Faire maintenant):
1. [ ] Fix metadata domain
2. [ ] Setup email templates Supabase
3. [ ] Verify RLS policies
4. [ ] Build test local
5. [ ] Git commit & push
6. [ ] Deploy Vercel

### TOMORROW (Tester):
1. [ ] Test site live
2. [ ] Test on mobile (2+ devices)
3. [ ] Test on 3+ browsers
4. [ ] Test auth flow
5. [ ] Performance audit
6. [ ] Client approval

### AFTER (Optional):
1. [ ] Setup analytics
2. [ ] Setup error monitoring
3. [ ] Monitor logs 24/7
4. [ ] Get client feedback

---

## ✨ READY?

**C'est tout ce qu'il faut faire pour la production! 🎉**

Quand tu as complété les 10 fixes:
1. ✅ Production-ready
2. ✅ Sûr et sécurisé
3. ✅ Performant
4. ✅ Prêt à livrer au client

**Go live! 🚀**
