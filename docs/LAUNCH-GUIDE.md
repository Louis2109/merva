# 🚀 GUIDE COMPLET: MISE EN LIGNE MERVASON

## 📋 TABLE DES MATIÈRES
1. [Audit Status](#-audit-status)
2. [Fixes & Adjustments](#-fixes--adjustments-nécessaires)
3. [Vérifications Supabase](#-vérifications-supabase)
4. [Déploiement Vercel](#-déploiement-vercel)
5. [Tests Finaux](#-tests-finaux)
6. [Checklist Go-Live](#-checklist-go-live)

---

## 🎯 Audit Status

```
✅ Code:               Zéro erreurs
✅ Build:              Compile parfaitement  
✅ Architecture:       Solide et scalable
✅ Performance:        Optimisée (ISR, middleware)
✅ Authentication:     Phase 1 complète
✅ Security:           Base OK, à finaliser
⚠️ Configuration:      À ajuster pour production
```

---

## 🔧 FIXES & ADJUSTMENTS NÉCESSAIRES

### FIX 1: Metadata - Domaine Production

**Fichier:** `app/layout.tsx`  
**Problème:** metadataBase pointant sur `mervason.com` au lieu du domaine réel

**Action:** Remplacer:

```typescript
// ❌ AVANT
metadataBase: new URL('https://mervason.com'),

// ✅ APRÈS (choisir une option)
// Option A: Si vous avez un domain custom
metadataBase: new URL('https://mervason.cm'),

// Option B: Si vous utilisez Vercel (gratuit)
metadataBase: new URL('https://mervason.vercel.app'),
```

### FIX 2: Environment Variables - Production

**Fichier:** `.env`  
**Action:** Vérifier et remplacer le domaine:

```bash
# ❌ AVANT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ✅ APRÈS (production)
NEXT_PUBLIC_SITE_URL=https://mervason.vercel.app
# OU
NEXT_PUBLIC_SITE_URL=https://mervason.cm
```

**À faire:** Ajouter aussi dans Vercel Dashboard (Settings → Environment Variables)

### FIX 3: Next.js Config - Image Optimization

**Fichier:** `next.config.ts`  
**Status:** ✅ Déjà configuré correctement

```typescript
// ✅ Supabase images déjà autorisées
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'fuimqugdecmjgttseevk.supabase.co',
    pathname: '/storage/v1/object/public/**',
  },
]
```

### FIX 4: Supabase - Email Configuration

**Action:** Dans Supabase Dashboard:

1. **Authentication → Email Templates**
   - [ ] Configure "Confirm signup" template
   - [ ] Configure "Reset password" template
   - [ ] (Optionnel) Configure "Invite user" template
   - [ ] Voir: `docs/emails/update-email-templates.md`

2. **Vérifier URL Redirection**
   - [ ] Site URL: `https://mervason.vercel.app`
   - [ ] Redirect URLs inclure:
     ```
     https://mervason.vercel.app/auth/callback
     https://mervason.vercel.app/auth/reset-password
     ```

### FIX 5: Supabase - Row Level Security (RLS)

**À vérifier dans Supabase SQL Editor:**

```sql
-- 1. Vérifier que RLS est ENABLED sur chaque table
-- Aller à: Database → Tables
-- Pour chaque table: cliquer → "RLS policies"
-- Voir que les policies restrictent bien l'accès

-- 2. Test RLS (en tant qu'utilisateur non-admin)
-- Doit voir: Produits publics ✅, mais pas les données privées ❌

-- 3. Policies essentielles:
-- profiles:  Users read own only
-- shops:     Sellers read/edit own, others read (public)
-- products:  Sellers read/edit own, others read (public)
-- orders:    (When added) Users read own only
```

**Checklist RLS:**
- [ ] `profiles` table → RLS enabled
- [ ] `categories` table → RLS enabled (public read)
- [ ] `shops` table → RLS enabled
- [ ] `products` table → RLS enabled
- [ ] `plans` table → RLS enabled (public read)
- [ ] Storage `product-images` → RLS policies
- [ ] Storage `shop-logos` → RLS policies

### FIX 6: Supabase Storage - CORS

**À vérifier dans Supabase:**

1. **Settings → API → CORS**
2. Ajouter allowed origins:
   ```
   http://localhost:3000
   https://mervason.vercel.app
   https://mervason.cm  (si custom domain)
   ```

---

## 🗄️ VÉRIFICATIONS SUPABASE

### Checklist Données:

```sql
-- ✅ Check 1: Categories exist
SELECT COUNT(*) FROM categories;  -- Should be > 0

-- ✅ Check 2: At least one shop active
SELECT COUNT(*) FROM shops WHERE is_active = true;

-- ✅ Check 3: Products exist and are active
SELECT COUNT(*) FROM products WHERE is_active = true;

-- ✅ Check 4: Profiles table has correct schema
\d profiles;

-- ✅ Check 5: No orphaned records
SELECT COUNT(*) FROM products WHERE shop_id IS NULL;
```

### Checklist Auth:

```
- [ ] Email confirmation enabled (Settings → Auth)
- [ ] Password requirements: min 8 chars ✅ (already set in app)
- [ ] Email templates configured (3 templates)
- [ ] JWT expiry: 24h (default, recommended)
- [ ] Refresh token expiry: 30 days (default)
```

### Checklist Storage:

```
- [ ] Bucket "product-images" exists
- [ ] Bucket "shop-logos" exists
- [ ] Both buckets have RLS policies
- [ ] Both buckets publicly readable (for images)
- [ ] Upload restricted to authenticated users
```

---

## 🚀 DÉPLOIEMENT VERCEL

### Étape 1: Préparation Code

```bash
# 1. Vérifier tout est commité
git status
# Should show: "nothing to commit, working tree clean"

# 2. Build test local (IMPORTANT!)
npm run build
# Should complete without errors

# 3. Start local pour tester
npm run start
# Should start on http://localhost:3000
# Test quelques pages puis Ctrl+C
```

### Étape 2: Push à GitHub

```bash
# Si pas encore poussé:
git add .
git commit -m "chore: prepare for production"
git push origin main
```

### Étape 3: Créer Project Vercel

1. Aller sur: https://vercel.com/dashboard
2. Cliquer **"+ New Project"**
3. **Import Git Repository:**
   - Connecter GitHub si pas fait
   - Sélectionner repo "merva"
4. **Configure Project:**
   - Framework Preset: `Next.js` ✅ (auto-détecté)
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
   - Install Command: `npm install` ✅

### Étape 4: Environment Variables

1. **Avant de déployer, ajouter les vars:**

Cliquer **"Environment Variables"** et ajouter:

```bash
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://fuimqugdecmjgttseevk.supabase.co
✅ Add

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc...
✅ Add

Name: NEXT_PUBLIC_SITE_URL
Value: https://mervason.vercel.app
✅ Add

Name: PHONE_ADMIN_NUMBER
Value: +237 691 921 049
✅ Add
```

2. Cliquer **"Deploy"**
3. Attendre le build (~2-3 minutes)
4. ✅ Voir "Congratulations!"

### Étape 5: Test Deployment

1. Cliquer le lien généré (ex: `https://merva-xxx.vercel.app`)
2. Voir la homepage charger
3. Tester les pages principales:
   - [ ] Homepage (`/`)
   - [ ] Products (`/products`)
   - [ ] Product detail
   - [ ] Login (`/auth/login`)
   - [ ] Register (`/auth/register`)

### Étape 6: Custom Domain (Optionnel)

Si vous avez un domaine:

1. **Dans Vercel:** Settings → Domains
2. Ajouter: `mervason.cm` (ou votre domaine)
3. Suive les instructions DNS
4. Attendre propagation DNS (~24-48h)

---

## 🧪 TESTS FINAUX

### Test 1: Pages Publiques

```
✅ Homepage (/)
  - [ ] Images chargent
  - [ ] Featured products affichés
  - [ ] Layout responsive
  - [ ] Navigation clickable

✅ Products (/products)
  - [ ] Tous les produits listés
  - [ ] Category filter fonctionne
  - [ ] Images chargent
  - [ ] Grid responsive

✅ Product Detail (/products/[slug])
  - [ ] Produit charge
  - [ ] Images gallery works
  - [ ] Description affichée
  - [ ] WhatsApp button clickable

✅ Shop (/shop/[slug])
  - [ ] Shop info affichée
  - [ ] Products from shop listed
  - [ ] WhatsApp button works

✅ Pricing (/pricing)
  - [ ] Plans displayed
  - [ ] Contact button works
```

### Test 2: Authentication

```
✅ Register (/auth/register)
  - [ ] Form submissions
  - [ ] Email reçu
  - [ ] Confirmation link works
  - [ ] Redirected to login

✅ Login (/auth/login)
  - [ ] Email/password works
  - [ ] Redirected to dashboard
  - [ ] Forgot password link works

✅ Forgot Password (/auth/forgot-password)
  - [ ] Form works
  - [ ] Email reçu
  - [ ] Reset link works
  - [ ] New password accepted
```

### Test 3: Mobile Responsiveness

```
Sur iPhone/Android:
- [ ] Menu toggle works
- [ ] Forms usable
- [ ] Images scale
- [ ] Text readable
- [ ] Buttons touchable
- [ ] No horizontal scroll
```

### Test 4: Performance

Ouvrir DevTools (F12) → Lighthouse:

```
- [ ] Performance > 80
- [ ] Accessibility > 85
- [ ] Best Practices > 90
- [ ] SEO > 90
```

Si bas, vérifier:
- Images optimisées?
- Pas de non-critical JS?
- Fonts loaded?

### Test 5: Security Check

```
- [ ] HTTPS working (lock icon)
- [ ] No console errors (F12 → Console)
- [ ] No sensitive data in requests
- [ ] Forms submit securely
- [ ] Passwords never logged
```

---

## ✅ CHECKLIST GO-LIVE

### Pre-Launch (1-2 jours avant)

- [ ] Code audit complet
- [ ] Performance test Lighthouse
- [ ] Mobile testing (2+ devices)
- [ ] Security review
- [ ] Database backup
- [ ] Test emails configured
- [ ] Supabase RLS verified

### Launch Day

- [ ] Vercel deployment successful
- [ ] All pages load
- [ ] Forms work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] WhatsApp buttons work
- [ ] HTTPS working

### Post-Launch (24h after)

- [ ] Monitor Vercel logs
- [ ] Check error reports
- [ ] Verify user signups
- [ ] Check email delivery
- [ ] Monitor performance
- [ ] Get client feedback

---

## 🚨 TROUBLESHOOTING

### Problem: Pages Blanche sur Production

**Causes possibles:**
1. Environment variables pas ajoutées à Vercel
2. Build error (vérifier logs)
3. Supabase down

**Solutions:**
```bash
# 1. Vérifier logs Vercel
# Aller: Vercel Dashboard → Deployments → Logs

# 2. Redéployer
# Cliquer: Deployments → Redeploy

# 3. Vérifier env vars
# Settings → Environment Variables → verify
```

### Problem: Images Pas Chargées

**Cause:** Images Supabase permissions

**Solution:**
1. Vérifier CORS in Supabase
2. Vérifier Storage RLS policies
3. Vérifier image URLs dans DB

### Problem: Auth Failures

**Cause:** RLS policies trop restrictives

**Solution:**
1. Vérifier RLS policies in Supabase
2. Vérifier email configuration
3. Test auth locally first

### Problem: Slow Performance

**Cause:** ISR not working ou images grandes

**Solution:**
1. Verifier ISR configured (`export const revalidate = 60`)
2. Optimize images (WebP format)
3. Check Supabase queries

---

## 📞 CLIENT HANDOFF

### À Livrer au Client:

1. **Site URL:** https://mervason.vercel.app
2. **Admin Account:** (credentials)
3. **Documentation:**
   - How to add products
   - How to manage shop
   - Customer support contact
4. **Support Plan:**
   - Response time for bugs
   - Enhancement requests process
   - Maintenance schedule

### Post-Launch Support:

- Week 1: Daily check-in
- Weeks 2-4: Weekly check-in
- Month 2+: Monthly review

---

## ✨ FINALE

**Status:** App est 95% prête pour production ✅

**Temps estimé pour completion:** 1-2 jours

**Risque:** Bas (architecture solide)

**Next Steps After Launch:**
1. Monitor & collect feedback
2. Fix any bugs found
3. Plan Phase 2 (OAuth, advanced features)
4. Scale infrastructure if needed

---

**Ready to go live? Let's do this! 🚀**
