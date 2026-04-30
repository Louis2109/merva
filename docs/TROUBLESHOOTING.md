# 🔧 Guide de Résolution des Problèmes

## Problème #1: Upload image boutique échoue (Échec du téléchargement)

### Symptômes
- `/dashboard/settings` - Impossible d'uploader logo
- Error: "Échec du téléchargement. Veuillez réessayer."

### Cause Root
Le bucket `shop-logos` n'existe pas ou les RLS policies ne sont pas configurées.

### Solution

**Step 1: Vérifier le bucket existe**
1. Allez sur [Supabase Dashboard](https://supabase.com)
2. Sélectionnez votre projet
3. Allez à **Storage**
4. Cherchez le bucket `shop-logos`
   - ✅ Si existe → Allez à Step 2
   - ❌ Si n'existe pas → Créez-le: "New Bucket" → name: `shop-logos` → Public

**Step 2: Configurer RLS Policies**
1. Supabase Dashboard → **SQL Editor** → **New Query**
2. Copiez le contenu de `docs/migrations/setup-shop-logos-storage.sql`
3. Exécutez le script complet
4. Vérifiez: pas d'erreurs

**Step 3: Test**
1. Allez à `http://localhost:3000/dashboard/settings`
2. Cliquez "Ajouter un logo"
3. Sélectionnez une image (JPG, PNG, WebP)
4. Upload devrait réussir ✅

---

## Problème #2: Texte invisible - Category Filter (FIXED)

### Symptômes
- Page `/products` → Zone filtres catégories
- Texte du select pas visible

### Cause Root
`<select>` avait `bg-white` sans `text-gray-900` explicite

### Solution
✅ **DÉJÀ CORRIGÉ** dans `components/features/category-filter.tsx`

Changement:
```tsx
// Avant (BROKEN)
<select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">

// Après (FIXED)
<select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium">
  <option className="text-gray-900">...</option>
</select>
```

---

## Problème #3: Pas de Footer (FIXED)

### Symptômes
- Aucun footer au bas des pages

### Cause Root
Component footer absent du layout

### Solution
✅ **DÉJÀ FAIT** 
- Créé `components/layouts/footer.tsx`
- Intégré dans `app/layout.tsx`

Footer affiche:
- Navigation quicklinks
- Info vendeurs
- Legal links
- Réseaux sociaux

---

## Problème #4: Textes illisibles (À INVESTIGUER)

### Prochaines étapes
- [ ] Test sur mobile réel
- [ ] Lighthouse audit color contrast
- [ ] Check WCAG AA compliance (4.5:1 ratio)

### Checklist rapide
1. Ouvrez page dans Chrome
2. F12 → Lighthouse → Audit
3. Regardez "Color Contrast"
4. Fix elements rouges

---

## Testing Checklist

### Mobile Testing
- [ ] Test sur vraie device (iPhone/Android)
- [ ] Vérifier responsive (portrait/landscape)
- [ ] Test all buttons tappable
- [ ] Test WhatsApp links

### Browser Testing
- [ ] Chrome (Desktop + Mobile)
- [ ] Firefox
- [ ] Safari

### Functionality Testing
- [ ] Login/Register flow
- [ ] Create shop
- [ ] Add product
- [ ] Upload images
- [ ] Filter by category
- [ ] View product detail
- [ ] Send WhatsApp message

---

## Git Commits pour ces fixes

```bash
git add .
git commit -m "fix(ui): Add text color to category filter select"
git commit -m "feat(footer): Add footer component to all pages"
git commit -m "docs: Add PROCESS.md with complete architecture audit"
git commit -m "docs: Add shop-logos storage setup guide"
```

---

## Déploiement

### Sur localhost
```bash
npm run dev
# Vérifiez que:
# 1. Category filter texte visible
# 2. Footer apparaît en bas
# 3. /dashboard/settings upload fonctionne
```

### Sur Supabase
1. Exécutez `docs/migrations/setup-shop-logos-storage.sql`
2. Vérifiez les RLS policies

### Sur Vercel
```bash
git push origin main
# Vercel déploie automatiquement
```

---

**Créé:** 28 Avril 2026
**Dernière update:** 28 Avril 2026
