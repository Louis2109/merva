# 🔄 Régénération Types TypeScript

Après avoir exécuté la migration SQL, tu dois régénérer les types TypeScript pour avoir l'autocomplétion des nouvelles colonnes.

## Commande

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > types/database.ts
```

## Trouver ton PROJECT_ID

1. Aller sur **Supabase Dashboard**
2. Cliquer sur **Settings** (engrenage)
3. **General** → Project ID (copier)

OU

Regarder dans ton `.env.local`, il est dans `NEXT_PUBLIC_SUPABASE_URL`:
```
https://<PROJECT_ID>.supabase.co
```

## Types ajoutés

Après régénération, tu auras accès à :

```typescript
// profiles
type Profile = Database['public']['Tables']['profiles']['Row']
// Nouvelles colonnes:
// - is_admin: boolean
// - is_merchant: boolean

// shops
type Shop = Database['public']['Tables']['shops']['Row']
// Nouvelles colonnes:
// - plan_id: number
// - deactivated_at: string | null
// - deactivated_reason: string | null
// - deactivated_by: string | null
// - updated_by: string | null

// plans (nouvelle table)
type Plan = Database['public']['Tables']['plans']['Row']
// {
//   id: number
//   name: string
//   product_limit: number
//   price: number
//   features: string[]
//   created_at: string
// }
```

## Utilisation dans le code

```typescript
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Shop = Database['public']['Tables']['shops']['Row']
type Plan = Database['public']['Tables']['plans']['Row']

// Avec relations
type ShopWithPlan = Shop & {
  plans: Plan
}

type ShopWithOwner = Shop & {
  profiles: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>
}
```

---

**⚠️ Pense à run cette commande maintenant !**
