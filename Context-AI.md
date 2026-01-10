# PROJET : MERVASON (E-commerce MVP)

## 1. Description
Mervason est une plateforme e-commerce multi-vendeurs simplifiée (MVP).
- Les utilisateurs créent des boutiques.
- Ils ajoutent des produits.
- Les visiteurs voient les produits et cliquent pour acheter.
- **Action d'achat :** Redirection immédiate vers WhatsApp avec un message pré-rempli. Pas de panier, pas de paiement en ligne.

## 2. Stack Technique (Golden Path)
- **Frontend :** Next.js 14+ (App Router), TypeScript.
- **Styling :** Tailwind CSS.
- **Icons :** Lucide-React.
- **Backend/DB :** Supabase (PostgreSQL, Auth, Storage).

## 3. Design System & UI (Strict)
- **Approche :** Mobile First (Responsive).
- **Palette :**
  - Fond : Blanc / Gris très clair (#F3F4F6).
  - Primaire (Action) : Orange Vif (ex: #F97316).
  - Secondaire (Confiance) : Bleu Profond (ex: #1E40AF).
- **Effets Visuels (Signature) :**
  - **Glassmorphism :** Utiliser `backdrop-blur`, fonds semi-transparents (`bg-white/30`), et bordures fines blanches (`border-white/20`) pour les cartes et le menu.
  - **Ombres :** Ombres douces et diffuses (`shadow-xl`, `shadow-orange/20`).
  - **Liquid Glass :** Effets de dégradés flous en arrière-plan pour donner de la profondeur.

## 4. Structure des Données (Supabase)
- **User :** id (lien auth), name, avatar.
- **shops :** id, id_user(foreign key from user), name, description, whatsapp_number, logo_url.
- **products :** id, shop_id, category_id, title, description, price, image_url.
- **categories :** id, name, icon_slug. 


## 5. Navigation (Menu)
Menu de navigation (Sticky Glassmorphism) :
1. **Accueil** (Hero section avec slogan fort + image 3D ou illustration).
Home (/)Landing Page attractive Glassmorphism, Hero section, Top Catégories, Produits Récents.
** Contact et formulaire serons sur la page d'accueil (landing page)
2. **Catégories de product** (Grille de cartes).
Produit (/product/[id])La page de décisionFocus sur l'image et le bouton WhatsApp.
3. **Boutiques de product** (Liste des boutiques populaires).
Boutique (/shop/[id]), liste uniquement les produit de ce vendeur
4. **Dashbord** 
Dashboard (/admin)L'outil du vendeurInterface propre (Style SaaS) pour gérer le CRUD.


## 6. LOGIQUE MÉTIER (Règles d'Or)
1. **Pas de panier, pas de paiement en ligne.**
2. **Achat :** Le clic sur un produit ouvre l'API WhatsApp : `https://wa.me/{phone}?text=Je veux`.
3. **Vendeur :** Doit s'inscrire pour créer une boutique et poster des articles.

## Structure du projet
merva/
├── app/                   (Le coeur de ton site - Routing)
│   ├── (auth)/            (Groupe pour Login/Register)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/         (Espace privé du vendeur)
│   │   ├── page.tsx       (Statistiques simples)
│   │   ├── products/      (CRUD des articles)
│   │   └── shop-setup/    (Création de la boutique)
│   ├── product/[id]/      (Page détail d'un article)
│   ├── shop/[id]/         (Page d'une boutique spécifique)
│   ├── layout.tsx         (Contient la Navbar Glassmorphism)
│   └── page.tsx           (Ta Landing Page / Accueil)
├── components/            (Tes briques de design réutilisables)
│   ├── ui/                (Boutons, Inputs, Cartes Glass)
│   ├── shared/            (Navbar, Footer)
│   └── product-card.tsx   (La carte produit avec l'effet shadow)
├── utils/                 (Outils techniques)
│   └── supabase/
│       ├── client.ts      (Connexion navigateur)
│       └── server.ts      (Connexion côté serveur)
├── types/                 (Définitions TypeScript pour l'IA)
│   └── database.ts
├── .env.local             (Tes clés secrètes Supabase)
└── CONTEXT_AI.md          (Ton guide pour l'IA)