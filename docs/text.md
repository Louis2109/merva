
---

### I. Architecture & Logique Métier

Pour un projet simple et maintenable par une IA, nous allons utiliser une architecture **Monolithe Modulaire** (tout dans un seul projet, mais bien séparé).

#### 1. Le Modèle de Données (La base de tout)

Si ton modèle de données est clair, Copilot écrira un code parfait. Voici les entités dont tu as besoin :

* **Users (Utilisateurs) :** Ils s'inscrivent. Ils possèdent les données d'authentification (email, password).
* **Shops (Boutiques) :** Chaque utilisateur a une boutique (relation 1-1 pour simplifier au début).
* Champs : Nom de la boutique, Description, Numéro WhatsApp (Crucial !), Logo.


* **Categories (Catégories) :** Électronique, Mode, Maison, etc.
* **Products (Articles) :** Ce que la boutique vend.
* Champs : Titre, Description, Prix, Image URL, ID de la boutique, ID de la catégorie.



#### 2. Les Flux Utilisateurs (User Flows)

* **Le Vendeur (Merchant Flow) :** Inscription -> Création de sa boutique (Setup du numéro WhatsApp) -> Dashboard -> Ajouter/Modifier/Supprimer des produits.
* **L'Acheteur (Visitor Flow) :** Arrive sur la Home -> Voit les produits par catégorie -> Clique sur un produit -> Clique sur "Acheter sur WhatsApp" -> Redirection automatique.

---

### II. La Stack Technique (Choix Stratégique)

Pour un Junior utilisant l'IA, je te recommande cette stack "Golden Path". C'est celle où les IA sont les plus performantes car il y a énormément de documentation.

1. **Framework : Next.js (App Router)**. C'est du React, mais avec tout inclus (Routing, API, optimisation).
2. **Langage : TypeScript**. *Obligatoire.* L'IA fait moins d'erreurs quand elle connait les types de données.
3. **Base de données & Auth : Supabase**. C'est une alternative à Firebase mais basée sur SQL. L'IA est excellente pour générer du SQL et les règles de sécurité Supabase.
4. **Styling : Tailwind CSS**. Copilot est un génie du CSS avec Tailwind.
5. **Stockage Image :** Supabase Storage (pour les images des produits).

---

### III. Roadmap de Développement "Step-by-Step"

Voici comment tu vas construire cela, étape par étape, en utilisant l'IA. Ne saute pas les étapes.

#### Étape 1 : Initialisation & Base de données (Le Fondement)

Avant de coder du React, on prépare le terrain.

* **Action :** Crée un projet Supabase.
* **Prompt pour l'IA :** Demande à Copilot de générer le script SQL pour tes tables.
* **Exemple de Prompt :** "Agis comme un architecte DB. Écris-moi le code SQL pour Supabase pour créer les tables : profiles (liés à auth.users), shops (avec un numéro whatsapp), categories, et products. Un user a un shop. Un shop a plusieurs products."

#### Étape 2 : Setup du Projet Frontend

* **Action :** Initialise Next.js avec Tailwind et TypeScript.
* **Prompt pour l'IA :** "Comment installer et configurer le client Supabase dans un projet Next.js 14 App Router ? Montre-moi le fichier utils/supabase/client.ts."

#### Étape 3 : Authentification & Création de Boutique

C'est la partie la plus critique.

* **Tâche :** Faire la page de Login/Register.
* **Tâche :** Une fois loggé, si l'user n'a pas de boutique, rediriger vers un formulaire "Créer ma boutique" (Nom + Numéro WhatsApp).
* **Astuce IA :** Copilot peut générer le formulaire entier si tu lui donnes le schéma de ta table `shops`.

#### Étape 4 : Le Dashboard Vendeur (CRUD)

C'est là que le vendeur gère ses articles.

* **Tâche :** Page "Mes Produits".
* **Tâche :** Formulaire "Ajouter un produit" (Upload d'image + Champs texte).
* **Prompt Context :** Dis toujours à l'IA : "Je suis dans le fichier `app/dashboard/products/page.tsx`. Utilise les Server Actions de Next.js pour insérer les données dans Supabase."

#### Étape 5 : La Vitrine Publique (Ce que tout le monde voit)

* **Tâche :** Page d'accueil qui liste toutes les catégories ou les derniers produits.
* **Tâche :** Page de détail du produit (`/product/[id]`).

#### Étape 6 : La Feature "Magic Link" WhatsApp

C'est la clé de Mervason.

* **Logique :** Le bouton "Acheter" est en fait un lien `<a>`.
* **Format du lien :** `https://wa.me/[NumeroDuVendeur]?text=Bonjour, je suis intéressé par votre article : [NomDuProduit]`
* **Prompt pour l'IA :** "Crée un composant React `WhatsAppButton` qui prend en props le `phoneNumber` et le `productName` et formate l'URL WhatsApp correctement."

---

### IV. Comment guider ton IA (Ta "Super-Productivité")

Pour être aussi bon que 10 seniors, tu ne dois pas dire "Fais-moi un site". Tu dois dire :

1. **Donne le rôle :** "Tu es un expert Next.js et Supabase."
2. **Donne le contexte :** "Voici le schéma de ma table `products` : [coller le schéma SQL ou les types TypeScript]."
3. **Donne la contrainte :** "Utilise Tailwind pour le style. Utilise Lucide-React pour les icônes."
4. **Demande l'action :** "Génère le composant Card pour afficher un produit."

---

J'ai l'impression que le signIn, register ne marche pas, d'ou viens l'erreur ? Ah ok, j'ai trouver le pb, il failais use un email reel (pas d'email fictif, c'est ok), puis aller confirmer le register dans ma boite mail. Je ne savais pas cela, il faut un message de notification pour signaler cela a l'utilisateur. 
Pourquoi ses pages sont en anglais ? Le site dois etre en francais, on vas ajouter l'anglais plutard. 
A chaque fois qu'on termine une phase ou step valider, donne moi le message pour le commit de github. 

Cool, j'aime bien ce que je vois sur le terminal, sa me permet de comprendre ce qui ce passe en temps reel. 
david@ThinkPad:~/Desktop/Projet/merva$ npm run dev

> merva@0.1.0 dev
> next dev

▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.100.90:3000
- Environments: .env.local

✓ Starting...
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
✓ Ready in 4.3s
 GET /auth/login 200 in 2.0s (compile: 1043ms, proxy.ts: 235ms, render: 751ms)
Login error: Invalid login credentials
 GET /auth/login?error=invalid 200 in 151ms (compile: 8ms, proxy.ts: 14ms, render: 130ms)
 POST /auth/login 303 in 2.2s (compile: 10ms, proxy.ts: 13ms, render: 2.2s)
 GET /auth/register 200 in 119ms (compile: 53ms, proxy.ts: 9ms, render: 58ms)
Signup error: Email address "test1@test.com" is invalid
 GET /auth/register?error=signup 200 in 106ms (compile: 5ms, proxy.ts: 9ms, render: 92ms)
 POST /auth/register 303 in 1616ms (compile: 13ms, proxy.ts: 18ms, render: 1586ms)
 GET /auth/login 200 in 48ms (compile: 5ms, proxy.ts: 6ms, render: 37ms)
Login error: Invalid login credentials
 GET /auth/login?error=invalid 200 in 135ms (compile: 11ms, proxy.ts: 11ms, render: 114ms)
 POST /auth/login 303 in 1240ms (compile: 13ms, proxy.ts: 11ms, render: 1216ms)
 GET /auth/register 200 in 100ms (compile: 13ms, proxy.ts: 20ms, render: 67ms)
 GET /auth/login?redirectTo=%2Fdashboard 200 in 99ms (compile: 5ms, proxy.ts: 10ms, render: 83ms)
 POST /auth/register 303 in 3.2s (compile: 9ms, proxy.ts: 15ms, render: 3.1s)
Login error: Email not confirmed
 GET /auth/login?error=invalid 200 in 91ms (compile: 7ms, proxy.ts: 9ms, render: 74ms)
 POST /auth/login?redirectTo=%2Fdashboard 303 in 839ms (compile: 8ms, proxy.ts: 11ms, render: 820ms)
 GET /?code=01814160-1f4b-4876-a7e9-58542c5e8a46 200 in 196ms (compile: 41ms, proxy.ts: 8ms, render: 146ms)
 GET /auth/login 200 in 98ms (compile: 11ms, proxy.ts: 14ms, render: 72ms)
 GET /auth/login 200 in 54ms (compile: 7ms, proxy.ts: 5ms, render: 42ms)
Login error: Invalid login credentials
 GET /auth/login?error=invalid 200 in 98ms (compile: 8ms, proxy.ts: 13ms, render: 78ms)
 POST /auth/login 303 in 1598ms (compile: 7ms, proxy.ts: 15ms, render: 1575ms)
 GET /dashboard 200 in 1746ms (compile: 906ms, proxy.ts: 407ms, render: 433ms)
 POST /auth/login?error=invalid 303 in 3.0s (compile: 6ms, proxy.ts: 11ms, render: 3.0s)
 GET / 200 in 691ms (compile: 10ms, proxy.ts: 640ms, render: 41ms)
 GET /products 200 in 383ms (compile: 41ms, proxy.ts: 309ms, render: 33ms)
 GET /dashboard 200 in 415ms (compile: 11ms, proxy.ts: 362ms, render: 42ms)
 GET /products 200 in 429ms (compile: 7ms, proxy.ts: 374ms, render: 49ms)
 GET / 200 in 403ms (compile: 7ms, proxy.ts: 304ms, render: 93ms)
 GET /dashboard 200 in 830ms (compile: 15ms, proxy.ts: 373ms, render: 442ms)
 POST /auth/login?error=invalid 303 in 2.2s (compile: 6ms, proxy.ts: 16ms, render: 2.2s)
 GET / 200 in 899ms (compile: 7ms, proxy.ts: 863ms, render: 29ms)
 GET /products 200 in 432ms (compile: 11ms, proxy.ts: 377ms, render: 43ms)
 GET /dashboard 200 in 504ms (compile: 15ms, proxy.ts: 407ms, render: 82ms)
 GET / 200 in 83ms (compile: 8ms, proxy.ts: 5ms, render: 70ms)
 POST /dashboard 303 in 1540ms (compile: 7ms, proxy.ts: 999ms, render: 534ms)
 GET /auth/login 200 in 102ms (compile: 10ms, proxy.ts: 15ms, render: 77ms)
 GET /dashboard 200 in 922ms (compile: 4ms, proxy.ts: 404ms, render: 515ms)
 POST /auth/login 303 in 2.1s (compile: 7ms, proxy.ts: 12ms, render: 2.1s)
 GET / 200 in 735ms (compile: 5ms, proxy.ts: 699ms, render: 32ms)
 GET / 200 in 61ms (compile: 4ms, proxy.ts: 5ms, render: 52ms)
 POST / 303 in 1769ms (compile: 8ms, proxy.ts: 1283ms, render: 478ms)
 GET /auth/login?redirectTo=%2Fdashboard 200 in 150ms (compile: 5ms, proxy.ts: 5ms, render: 141ms)
 GET /auth/login 200 in 68ms (compile: 9ms, proxy.ts: 18ms, render: 40ms)
 GET /dashboard 200 in 657ms (compile: 6ms, proxy.ts: 292ms, render: 359ms)
 POST /auth/login 303 in 1916ms (compile: 16ms, proxy.ts: 11ms, render: 1888ms)
