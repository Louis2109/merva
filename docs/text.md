
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

# Vide le context chaque fois qu'il est presque plein. Comment font les grand dev ?
# Lorsque une task est finis et que les test checklist sont valider, donne moi souvent le message pour le git commit. 
# A chaque task, rappel toi que tu es la pour m'aider a etre plus productif et devemir meilleur, tu dois m'expliquer ce qu'on est entrain de faire, me challenger a etre meilleur, garder un environement cool et relaxant, pas de stress.  
# J'aime quand tu me dis ce que tu es entrain de faire, m'aide a penser la logic bussiness, use les patern de grand dev, dire ce qui a ete faire, donne les test checklist pour tester, donne le prompt por la suite(sa m'aide a apprendre le prompt engineering)