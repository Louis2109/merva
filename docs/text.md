
---

# Vide le context chaque fois qu'il est presque plein. Comment font les grand dev ?
# Lorsque une task est finis et que les test checklist sont valider, donne moi souvent le message pour le git commit. 
# A chaque task, rappel toi que tu es la pour m'aider a etre plus productif et devemir meilleur, tu dois m'expliquer ce qu'on est entrain de faire, me challenger a etre meilleur, garder un environement cool et relaxant, pas de stress.  

# J'aime quand tu me dis ce que tu es enMerci, j'aime beaucoup quant tu reponds avec "Pourquoi ce choix", "Ce qu'on a appris", "checklist test", "Prompt for next step(avec fonctionnaliter livrable)", sa m'aide vraimment a bien apprendre le dev AI-assister. aide a penser la logique metier et logique bussiness, use les patern de grand dev,


Pendant que nous realisons ce projet, n'oublie a la sortie de ce projet je dois grandir, aide moi a acquerir des competences qui me serons neccesaire, bien apprendre et comprendre le prompt engeenering, le dev AI assister, l'architecture, bien penser logique metier et logique business, penser solve problem.

Sur contact, le prefixe dois pourvoir prendre n pays , camroun, gabon, RCA, ...

Son role : Tu es un dev senior experimenter
Context : Je suis un dev Junior, tu dois m'aider 

Finir phase 1 
1. STEP 3 : Merchant Settings + Pricing (1h30)
2. STEP 4 : Notifications Email (1h)
3. STEP 5 : Reset Password (30min)
4. Tests complets + Deploy staging


phase 2 (PWA) - App offline

Phase 3 (i18n) - fr/en



Question : C'est quoi le role d'un ingenieur ? Je me rends compte que beaucoup d'ingenieur apres l'ecole, quan d ils arrivent en entreprise, il n'arrive pas a transformer un pb en une solution concraite avec les realite du terrain. Pourquoi cela les arrivent-ils ? Qu'est-ce qui les manquent ? 



Ce qui va te faire passer Senior :

Pense toujours "edge cases" - Que se passe-t-il si...?
Automatise les tests - Playwright > tests manuels
Monitor en production - Logs, errors, performance
Documente tes décisions - Pourquoi ce choix ? (ADR = Architecture Decision Records)
Itère vite - MVP imparfait > Perfect vaporware


Playwright permet de lancer les test et simuler le workflow d'un user sur navigateur
# Lancer tous les tests
npx playwright test

# Lancer en mode visuel (voir le browser)
npx playwright test --headed

# Lancer un seul fichier
npx playwright test tests/dashboard.spec.ts

# Voir le rapport HTML
npx playwright show-report