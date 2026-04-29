# 🚀 MIGRATION 001: Admin System

## 📋 Ce qui est ajouté

### Tables
- ✅ **plans** - 3 plans (Free, Standard, Premium)

### Colonnes modifiées
- ✅ **profiles** - `is_admin`, `is_merchant`
- ✅ **shops** - `plan_id`, `deactivated_at`, `deactivated_reason`, `deactivated_by`, `updated_by`

### Automatisations
- ✅ **Trigger** - Auto-promotion customer → merchant quand crée shop
- ✅ **RLS Policies** - Admin accès complet
- ✅ **Helper Functions** - `is_admin()`, `can_add_product()`, `get_product_limit_info()`
- ✅ **View** - `shops_with_plans` (shop + plan details)

---

## 🔧 ÉTAPES D'INSTALLATION

### 1. Exécuter la migration principale

1. Ouvrir **Supabase Dashboard**
2. Aller dans **SQL Editor**
3. Copier le contenu de `docs/migrations/001_admin_system.sql`
4. Coller et **Run** (Cmd/Ctrl + Enter)

✅ **Vérification** : Tu devrais voir "Migration 001 completed successfully!"

---

### 2. Créer l'admin user

**Option A : Via Supabase Dashboard (Recommandé)**

1. Aller dans **Authentication → Users**
2. Cliquer **Add User**
3. Remplir :
   - Email: `admin@mervason.com`
   - Password: `admin123` (à changer après)
   - Auto Confirm: ✅ Oui
4. Cliquer **Create User**

5. Retourner dans **SQL Editor**
6. Copier le contenu de `docs/seed_admin.sql`
7. **Run** la commande UPDATE

**Option B : Via Signup normal**

1. Sur ton app, créer un compte avec email souhaité
2. Dans **SQL Editor**, run :
```sql
UPDATE profiles 
SET is_admin = true, first_name = 'Admin', last_name = 'Mervason'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'TON_EMAIL@example.com');
```

---

### 3. Vérifier que tout fonctionne

Exécuter dans **SQL Editor** :

```sql
-- 1. Vérifier plans
SELECT * FROM plans;
-- Tu devrais voir 3 lignes (free, standard, premium)

-- 2. Vérifier admin
SELECT u.email, p.is_admin, p.is_merchant 
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE p.is_admin = true;
-- Tu devrais voir ton admin

-- 3. Vérifier colonnes shops
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'shops' AND column_name IN ('plan_id', 'deactivated_at');
-- Tu devrais voir les 2 colonnes

-- 4. Tester fonction helper
SELECT can_add_product('<UN_SHOP_ID>');
-- Remplace <UN_SHOP_ID> par un vrai UUID de shop
```

---

## 🧪 TESTER LE WORKFLOW

### Test 1 : Customer → Merchant auto

```sql
-- 1. Créer un user test (via Dashboard ou signup)
-- 2. Vérifier qu'il est customer
SELECT is_admin, is_merchant FROM profiles WHERE id = '<USER_ID>';
-- is_admin: false, is_merchant: false

-- 3. Créer une shop pour ce user (via l'app ou SQL)
INSERT INTO shops (owner_id, name, slug, whatsapp_number)
VALUES ('<USER_ID>', 'Test Shop', 'test-shop', '237600000000');

-- 4. Re-vérifier le profil
SELECT is_admin, is_merchant FROM profiles WHERE id = '<USER_ID>';
-- is_admin: false, is_merchant: TRUE ✅
```

### Test 2 : Product Limit Check

```sql
-- Obtenir info limite d'une shop
SELECT get_product_limit_info('<SHOP_ID>');
-- Résultat exemple:
-- {"current_count": 5, "limit": 20, "remaining": 15, "plan_name": "free"}

-- Tester si peut ajouter
SELECT can_add_product('<SHOP_ID>');
-- true si current < limit
```

### Test 3 : Admin Policies

```sql
-- En tant qu'admin, voir toutes les shops (même inactives)
SELECT id, name, is_active FROM shops;

-- Suspendre une shop (test)
UPDATE shops 
SET 
  is_active = false, 
  deactivated_at = NOW(), 
  deactivated_reason = 'Test suspension'
WHERE id = '<SHOP_ID>';

-- Vérifier que la shop est invisible publiquement
-- (tester en mode anonyme ou non-propriétaire)
```

---

## 📝 PROCHAINES ÉTAPES

Après cette migration, tu peux :

1. ✅ Créer les routes admin (`/admin/dashboard`, `/admin/shops`)
2. ✅ Créer les Server Actions (`suspendShop()`, `activateShop()`, `upgradeShopPlan()`)
3. ✅ Créer la page pricing (`/pricing`)
4. ✅ Modifier dashboard merchant (afficher plan actuel)
5. ✅ Modifier `createProduct` action (check limite)

---

## 🔒 SÉCURITÉ

### Variables d'environnement nécessaires

Ajouter dans `.env.local` :

```bash
# Admin contact info (pour page pricing)
NEXT_PUBLIC_ADMIN_EMAIL=admin@mervason.com
NEXT_PUBLIC_ADMIN_WHATSAPP=237XXXXXXXXX

# Email service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Permissions admin

L'admin peut :
- ✅ Voir toutes les shops (actives et inactives)
- ✅ Voir tous les produits
- ✅ Voir tous les profils
- ✅ Modifier shops (suspend, activate, change plan)
- ✅ Modifier profils (change role)

L'admin NE PEUT PAS (pour l'instant) :
- ❌ Supprimer des produits d'autres users (add si besoin)
- ❌ Modifier produits d'autres users (add si besoin)
- ❌ Accéder aux mots de passe users (Supabase Auth gère)

---

## 🐛 Troubleshooting

### Erreur: "relation plans does not exist"
→ Tu n'as pas run la migration. Retourne à l'étape 1.

### Erreur: "column is_admin does not exist"
→ La migration a partiellement échoué. Run à nouveau.

### L'admin ne voit pas toutes les shops
→ Vérifier que `is_admin = true` dans la table profiles.
→ Vérifier les RLS policies ont été créées.

### Le trigger merchant ne fonctionne pas
→ Vérifier que le trigger existe :
```sql
SELECT * FROM pg_trigger WHERE tgname = 'trigger_set_merchant';
```

---

## ✅ Checklist finale

- [ ] Migration SQL exécutée sans erreur
- [ ] 3 plans créés (free, standard, premium)
- [ ] Colonnes `is_admin`, `is_merchant` ajoutées à profiles
- [ ] Colonnes `plan_id`, `deactivated_at` ajoutées à shops
- [ ] Trigger `set_merchant_flag` créé
- [ ] Admin user créé et vérifié
- [ ] Functions helper testées
- [ ] RLS policies activées
- [ ] View `shops_with_plans` accessible

---

**🎉 Si toutes les étapes sont OK, tu es prêt pour STEP 2 !**

**STEP 2 → Admin Routes + UI**
