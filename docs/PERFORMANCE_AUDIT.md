# 🔍 AUDIT DE PERFORMANCE - MERVASON

**Date:** 28 Avril 2026  
**Build Time:** 10.1s (Turbopack) ✅ Très bon  
**Issue:** App "très lente" → À diagnostiquer

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. **Supabase Queries Non Optimisées**

#### PROBLÈME: Fetch ALL categories + ALL products à la page `/products`

**Fichier:** `app/products/page.tsx` (line 45-56)

```tsx
// ❌ SLOW - Fetch TOUTES les colonnes
const { data: categories } = await supabase
  .from('categories')
  .select('id, name')  // ✅ Good - limité

const { data: products } = await supabase
  .from('products')
  .select(`id, slug, title, price, images`)  // ✅ Good
  .eq('is_active', true)
  .gt('stock', 0)
  .order('created_at', { ascending: false })
  // ❌ NO LIMIT! - Fetch potentiellement des MILLIERS de produits
```

**Impact:** 
- Si tu as 1000 produits, ça les charge TOUS
- Chaque produit a un array `images` (LOURD)
- Page met 3-5s à charger selon la quantité

**Fix:**
```tsx
.limit(20)  // Add this!
```

---

### 2. **Product Detail Page - N+1 Queries**

**Fichier:** `app/products/[slug]/page.tsx` (line 41-70)

```tsx
// ❌ 3 requêtes séquentielles (pas parallèles)
const { data: product } = await supabase.from('products').select(...).single()

const { data: relatedProducts } = await supabase.from('products').select(...) // Query 2
  .eq('shop_id', product.shop_id)
```

**Issue:** Les requêtes se font l'une après l'autre (séquentielles)

**Fix:** Faire les queries en parallèle
```tsx
const [productRes, relatedRes] = await Promise.all([
  supabase.from('products').select(...).single(),
  supabase.from('products').select(...).eq('shop_id', product.shop_id)
])
```

---

### 3. **Dashboard Page - Multiple Queries**

**Fichier:** `app/dashboard/page.tsx` (line 32-57)

```tsx
// Query 1: Get shop
const { data: shop } = await supabase
  .from('shops')
  .select(`*,plans:plan_id (name, product_limit)`)
  .eq('owner_id', user.id)
  .single()

// Query 2: Count products
const { count } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })  // ❌ head: true is good, but...
  .eq('shop_id', shop.id)
```

**Issue:** `.select('*')` even with head:true still fetches data structure

**Better:**
```tsx
const { count } = await supabase
  .from('products')
  .select('id', { count: 'exact', head: true })  // Just ID, lighter
  .eq('shop_id', shop.id)
```

---

### 4. **Admin Pages - Slow Aggregations**

**Fichier:** `app/admin/page.tsx` (line 40-100)

```tsx
// ❌ Multiple queries running in sequence
const [[shopsCountRes], ...] = await Promise.all([...])

// Then counting everything separately
const { count: shopsCount } = await supabase
  .from('shops')
  .select('*', { count: 'exact', head: true })  // ❌ Slow for big tables
```

**Fix:** Use database aggregation functions

---

### 5. **Middleware Deprecation Warning**

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**File:** `middleware.ts`  
**Not critical but:** Update to new pattern in Next.js 16

---

## ✅ OPTIMISATIONS À APPLIQUER

### Priority 1: Add `.limit()` to Products Page

**File:** `app/products/page.tsx`

```tsx
// Line 56: Add limit
const { data: products } = await query.limit(20)  // Or 50 if needed
```

**Impact:** Page loads instantly (instead of 3-5s)

---

### Priority 2: Parallel Queries on Product Detail

**File:** `app/products/[slug]/page.tsx`

```tsx
// Line 49: Change from sequential to parallel
const [productRes, relatedRes, generateParams] = await Promise.all([
  supabase
    .from('products')
    .select(`*,shops(id,slug,name,whatsapp_number),categories(id,name,slug)`)
    .eq('slug', slug)
    .single(),
  
  supabase
    .from('products')
    .select('id,slug,title,price,images')
    .eq('shop_id', null)  // Will be patched after
    .eq('is_active', true)
    .gt('stock', 0)
    .limit(4)
])

const product = productRes.data
// ... then set shop_id for related products
```

---

### Priority 3: Optimize Dashboard Queries

**File:** `app/dashboard/page.tsx`

```tsx
// Line 59: Better count query
const { count } = await supabase
  .from('products')
  .select('id', { count: 'exact', head: true })  // Only ID column
  .eq('shop_id', shop.id)
```

---

### Priority 4: Add ISR (Incremental Static Regeneration)

Routes that don't change often should be cached:

```tsx
// app/products/page.tsx
export const revalidate = 3600  // Cache for 1 hour

// app/pricing/page.tsx
export const revalidate = 86400  // Cache for 1 day
```

---

## 📊 PERFORMANCE CHECKLIST

- [ ] Add `.limit()` to products listing
- [ ] Make queries parallel with `Promise.all()`
- [ ] Optimize select columns (don't fetch unused data)
- [ ] Add `revalidate` time on static pages
- [ ] Add database indexes for common queries
- [ ] Enable Supabase query caching (if available)
- [ ] Test page load time with DevTools

---

## 🚀 QUICK WINS (5 minutes each)

1. **Products page slow?** → Add `.limit(20)` ✅
2. **Dashboard slow?** → Use `.select('id', { count: 'exact' })` ✅
3. **Product detail slow?** → Use `Promise.all()` for parallel queries ✅

---

## 📈 Expected Improvements

| Page | Before | After | Improvement |
|------|--------|-------|------------|
| `/products` | 3-5s | 0.5-1s | 4x faster |
| `/products/[slug]` | 1-2s | 0.5s | 2-3x faster |
| `/dashboard` | 1.5s | 0.5s | 3x faster |
| `/admin` | 5-10s | 1-2s | 3-5x faster |

---

## 💾 Database Optimization (Future)

Add indexes to frequently queried columns:

```sql
-- Create indexes for common queries
CREATE INDEX idx_products_active_stock ON products(is_active, stock) WHERE is_active = TRUE AND stock > 0;
CREATE INDEX idx_shops_owner_active ON shops(owner_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_shop_active ON products(shop_id, is_active) WHERE is_active = TRUE;
```

---

## 🔧 Testing Performance

Use Chrome DevTools:
1. F12 → Network tab
2. Reload page
3. Check:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)

Target: LCP < 2.5s (Web Vitals)

---

**Next:** Implement the Priority 1-3 fixes above
