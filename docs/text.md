
---

# Vide le context chaque fois qu'il est presque plein. Comment font les grand dev ?
# Lorsque une task est finis et que les test checklist sont valider, donne moi souvent le message pour le git commit. 
# A chaque task, rappel toi que tu es la pour m'aider a etre plus productif et devemir meilleur, tu dois m'expliquer ce qu'on est entrain de faire, me challenger a etre meilleur, garder un environement cool et relaxant, pas de stress.  

# Merci, j'aime beaucoup quant tu reponds avec "les fonctionnels qui a ete fais", "Pourquoi ce choix tech", "Ce qu'on a appris", "checklist test", "Prompt for next step(features)", "les git commit(precis et concis) pour chaque features realiser" sa m'aide vraimment a bien apprendre le dev AI-assister, aide a penser la logique metier, logique bussiness, use les patern de grand dev,


Pendant que nous realisons ce projet, n'oublie pas, a la sortie de ce projet je dois grandir, aide moi a acquerir des competences qui me serons neccesaire, bien apprendre et comprendre le prompt engeenering, le dev AI assister, l'architecture, bien penser logique metier et logique business, penser solve problem.

Sur contact, le prefixe dois pourvoir prendre n pays , camroun, gabon, RCA, ...

AI role : Tu es un dev senior experimenter
Context : Je suis un dev Junior, tu dois m'aider 

Finir phase 1 
1. STEP 4 : Merchant Settings + dashbord admin 
3. STEP 5 : Reset Password (30min) - update auth system
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