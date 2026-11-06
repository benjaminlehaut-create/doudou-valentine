# Mode d’emploi

## Jouer sur l’ordinateur

Double-cliquez sur **`Lancer.bat`**. Une fenêtre noire s’ouvre (le petit serveur), puis le navigateur affiche l’app. Pour arrêter : fermer la fenêtre noire.

## Tester sur l’iPad (même Wi-Fi que l’ordinateur)

1. Lancez `Lancer.bat`. La fenêtre noire affiche une ligne « Sur l’iPad : http://192.168.x.x:8080 ».
2. Sur l’iPad, ouvrez **Safari** et tapez cette adresse.
3. Si Windows demande d’autoriser Node.js sur le réseau, acceptez pour les **réseaux privés**.

Limites de ce test : sans HTTPS, le mode hors ligne n’est pas actif. Si la page ne s’ouvre pas sur l’iPad, c’est en général le pare-feu de l’ordinateur (fréquent sur un PC professionnel) : passez directement par GitHub Pages ci-dessous.

## Mettre en ligne (GitHub Pages, gratuit)

Une seule fois :

1. Créez un compte sur github.com, puis un **nouveau dépôt** (par exemple `doudous`). Un compte gratuit impose un dépôt **public** : n’y mettez jamais de photo de Valentine.
2. Dans ce dossier, ouvrez un terminal et tapez (en remplaçant `VOTRE-NOM`) :

   ```
   git remote add origin https://github.com/VOTRE-NOM/doudous.git
   git push -u origin main
   ```

3. Sur GitHub : **Settings › Pages › Source : Deploy from a branch › main / (root) › Save**.
4. Une à deux minutes plus tard, l’app est en ligne à `https://VOTRE-NOM.github.io/doudous/`.

À chaque modification ensuite : `git push`, et l’app se met à jour (visible au deuxième lancement sur l’iPad).

## Installer sur l’iPad ou l’iPhone

1. Ouvrez l’adresse GitHub Pages dans **Safari**.
2. Bouton **Partager** › **Sur l’écran d’accueil**.
3. Lancez l’app une fois avec Internet : ensuite, elle marche **sans Internet**.
4. Conseil : **Accès guidé** (Réglages › Accessibilité) empêche Valentine de quitter l’app.

## Voix plus naturelle sur iPad

Réglages › Accessibilité › Contenu énoncé › Voix › Français : téléchargez une voix « améliorée » ou « premium ». Puis, dans l’app, menu parent › Voix.

## Menu parent

Appui long de **3 secondes dans le coin en haut à droite** (un anneau rose se remplit).

## Ajouter un doudou

1. Créez un dossier `assets/doudous/son-nom/` avec ses images : `face.png`, `coucou.png`, `dodo.png`, `bobo.png`, `mange.png`, `joie.png`.
2. Ajoutez une ligne dans `data/doudous.json`, sur le modèle des autres.

## Générer des décors (facultatif, payant)

1. Créez un fichier `.env` à la racine contenant `OPENAI_API_KEY=sk-...` (il n’est jamais envoyé sur GitHub).
2. `node tools/generate-assets.mjs --essai` montre ce qui serait généré ; sans `--essai`, il génère. Les images déjà présentes ne sont jamais refaites.
