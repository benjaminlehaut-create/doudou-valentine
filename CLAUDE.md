# Le monde des doudous de Valentine — brief du projet

Lis ce fichier en entier au début de chaque session. Il fait référence.

## 1. Vision

Une application pour **Valentine, 3 ans**, utilisée sur **iPad et smartphone**. Plusieurs mini-jeux dont les héros sont **ses vrais doudous** (images dans `assets/doudous/`). L’écran d’accueil montre les doudous ; chaque porte (et plus tard chaque doudou) mène à un jeu.

Jeux, dans l’ordre de réalisation :

1. **Memory des doudous** — fait (4 paires, puis 6).
2. **Cache-cache des doudous** — fait (`js/jeux/cache-cache.js`). Des doudous se cachent derrière des objets dessinés en SVG (coussin, carton, plante, panier, coffre, pouf). On touche une cachette : l’objet se pousse et le doudou sort (fête, voix, pastille du compteur qui se colore), ou l’objet se soulève sur une petite étoile (« Personne ici… cherche encore ! »). Niveau 1 : 3 doudous dans 5 cachettes, leurs oreilles dépassent. Niveau 2 : 4 doudous dans 6 cachettes, cachés ; ils pointent le bout du nez de temps en temps (indice). Seul le haut d’un doudou caché peut dépasser de son objet. **Retour du parent (6 novembre 2026) : « un peu trop facile », à revoir plus tard** (pistes : un niveau 3 avec plus de cachettes et aucun indice, des doudous qui changent de cachette, un doudou précis à trouver).
3. **Le pique-nique** — fait (`js/jeux/pique-nique.js`, aliments dessinés en SVG dans `js/jeux/aliments.js`). Un doudou a faim, on touche un aliment, il vole jusqu’à son assiette ; le doudou mange (pose « mange », bruit de croque), puis saute de joie. Niveau 1, les couleurs : « Sacha voudrait un fruit jaune » parmi 3 fruits. Niveau 2, les quantités : « Debby voudrait deux fraises », la voix compte. Un mauvais choix fait un petit bond et la demande est redite gentiment ; après 7 s, le bon aliment se dandine.
4. L’heure du dodo (rituel du coucher).
5. Le docteur des doudous.
6. L’histoire dont Valentine est l’héroïne.

L’interlocuteur (le parent) a un **profil métier, pas développeur** : explique simplement, en français, ce qui a changé et comment le voir. Code simple, lisible, commenté en français.

## 2. Règles pour une enfant de 3 ans (non négociables)

- **Elle ne sait pas lire** : toute consigne est **dite à voix haute** (Web Speech API, `fr-FR`, débit lent, réglable). Aucun texte n’est nécessaire pour jouer. Un bouton « oreille » répète la consigne.
- Voix remplaçable par des **enregistrements** : dans `data/phrases.json`, une variante peut être `{ "texte": "…", "audio": "assets/voix/xxx.mp3" }` ; si le fichier manque ou échoue, la voix de synthèse prend le relais.
- **Cibles tactiles ≥ 80 px.** Pas de glisser-déposer difficile ; s’il en faut un, zone de tolérance très large.
- **Aucun échec, aucun chrono visible, aucune pub, aucun lien externe.** Une erreur n’est jamais sanctionnée (les cartes se retournent doucement, sans son négatif).
- **Chaque réussite** = une animation + un son + un mot doux (`js/recompense.js`, `js/sons.js`, phrases « bravo »).
- **Menu parent** : appui long de **3 secondes dans le coin en haut à droite** (un anneau se remplit). Prénom, volumes, vitesse et choix de la voix, doudous actifs, durée de jeu (écran « pause » quand elle est atteinte). Ce coin doit rester libre sur tous les écrans.
- Pas de zoom, pas de sélection de texte, pas de menu contextuel. Mode paysage (un écran « tourne la tablette » s’affiche en portrait).

## 3. Technique

- **Priorité actuelle (décidé le 6 novembre 2026)** : faire tourner l’app sur le PC Windows du parent (navigateur, `Lancer.bat`, souris). Le test et l’installation sur iPad viendront plus tard ; ne rien faire qui les bloque.

- **Vanilla JS en modules ES, sans étape de compilation** (pas de Vite pour l’instant : le dossier se déploie tel quel). Pas de framework.
- **PWA** : `manifest.webmanifest` (plein écran, paysage), `sw.js` (hors ligne). Le service worker met en cache les fichiers essentiels, toutes les images listées dans `data/doudous.json` et `data/images-a-generer.json`, puis applique « cache d’abord, mise à jour en arrière-plan » : une modification apparaît au **deuxième** lancement. Sur `localhost`, le service worker est volontairement désactivé (et nettoyé) pour voir chaque modification tout de suite ; le hors-ligne se teste sur GitHub Pages. Si tu ajoutes un fichier JS ou CSS, **ajoute-le à la liste `ESSENTIELS` de `sw.js`** et augmente `VERSION`.
- **Tous les chemins sont relatifs** (`assets/…`, jamais `/assets/…`) : le site est servi depuis un sous-dossier sur GitHub Pages.
- **iOS** : le son et la voix ne démarrent qu’après un toucher → écran de démarrage avec un gros bouton « jouer ». Pas de plein écran par API sur iPhone : il vient de « Ajouter à l’écran d’accueil ». Le service worker exige HTTPS (ou `localhost`).
- **Doudous** : `data/doudous.json`, **une ligne par doudou** : `id`, `nom` (dit par la voix), `couleur` dominante, `dossier` (ex. `assets/doudous/panda`). Chaque dossier contient six poses PNG détourées 768 × 768 : `face.png` (content), `coucou.png`, `dodo.png` (endormi), `bobo.png` (triste, pour le docteur), `mange.png` (pique-nique), `joie.png` (saute de joie). Une pose manquante est remplacée par `face.png` ; sans aucune image, un doudou dessiné en SVG (`forme` : `ours`, `lapin`, `chat`, `souris`, `panda`) prend le relais. Un champ `images` explicite par pose reste possible.
- **Doudous reçus (6 novembre 2026)** : Cappy (dossier `doudou-marron`), Sacha (`chat-bleu`), Debby (`chat-rose`), Pandy Panda (`panda`), Poussin (`poussin-jaune`), Koala Doux (`koala-doux`, fichiers d’origine `koala_gris_*`), Goubi (`goubi`, d’origine `doudou_yeux_bleus_*`). Un dernier doit arriver. Les illustrations d’origine (`xxx_01_content.png`…) sont renommées par pose.
- **Détourage** (refait le 6 novembre 2026) : toutes les poses sont redétourées, recadrées et centrées de la même façon (768 × 768, marge 5 %, posées en bas). Sans liseré blanc : le masque vient d’un modèle d’IA de détourage (`@imgly/background-removal`, exécuté dans le navigateur, car le Node.js du PC est en 32 bits et ne peut pas le faire tourner), puis le blanc est retiré des pixels de bord. Goubi garde son détourage d’origine, qui était bon, simplement recadré. Koala Doux a été remplacé le 6 novembre 2026 par six vraies poses illustrées (ChatGPT), déjà détourées mais un peu transparentes : opacité remontée, puis recadrage identique aux autres.
- **Images générées** : `node tools/generate-assets.mjs` (clé `OPENAI_API_KEY` dans l’environnement ou dans un fichier `.env` non versionné), modèle `gpt-image-1`, liste dans `data/images-a-generer.json`, préfixe de style commun (peluche 3D douce, lumière chaleureuse). Le script **ne régénère jamais un fichier existant** (`--force` pour forcer, `--essai` pour lister sans rien appeler). Une entrée avec `reference` (photo d’un vrai doudou) passe par l’API d’édition pour garder sa ressemblance. Les décors sont posés en CSS **par-dessus un dégradé de secours** : l’app marche sans eux.
- **Animations** : CSS/JS. Plus tard, option de courts clips Gemini/Veo (`GEMINI_API_KEY`), toujours avec repli automatique sur le CSS.
- **Sons** : synthétisés en Web Audio (`js/sons.js`). Remplaçables plus tard par des fichiers.
- **Déploiement** : GitHub Pages, branche `main`, dossier racine. Aucun build.
- Icônes : `node tools/icones.mjs` régénère `assets/icones/*.png` (dessin d’ourson provisoire).

## 4. Structure

```
index.html            page unique (écrans injectés dans #scene)
manifest.webmanifest  PWA
sw.js                 service worker (hors ligne)
css/style.css         tout le style
js/app.js             démarrage, navigation (#accueil, #memory), pause
js/accueil.js         écran d’accueil (portes des jeux + ronde des doudous)
js/jeux/memory.js     jeu 1
js/doudous.js         chargement des doudous, images, dessins provisoires
js/voix.js            voix (synthèse ou enregistrement)
js/sons.js            sons synthétisés
js/recompense.js      cœurs, confettis
js/parent.js          coin secret et menu parent
js/minuteur.js        durée de jeu
js/reglages.js        réglages (localStorage « doudous-reglages »)
js/icones.js          pictogrammes SVG
data/doudous.json     les doudous
data/phrases.json     tout ce que dit la voix ({prenom}, {nom} remplacés)
data/images-a-generer.json  liste des images à générer
tools/serveur.mjs     serveur local (ordinateur + iPad sur le même Wi-Fi)
tools/generate-assets.mjs, tools/icones.mjs
```

Les jeux partagent `js/jeux/commun.js` (barre « oreille » et « maison », écran de fin, mélange). Les doudous de l’accueil vivent tout seuls grâce à leurs poses (saut de joie, coucou, dodo avec des « z », tourbillon, respiration) : `SCENES` dans `js/accueil.js`.

Ajouter un jeu : un module `js/jeux/xxx.js` qui exporte `ouvrirXxx(scene, { aller })` et renvoie une fonction de nettoyage ; l’inscrire dans `ECRANS` (`js/app.js`), dans `JEUX` (`js/accueil.js`), dans `ESSENTIELS` (`sw.js`), et ses phrases dans `data/phrases.json`. Un jeu laisse libre le coin haut droit (menu parent) et propose toujours un bouton « maison » et un bouton « oreille ».

## 5. Méthode

- Petites étapes visibles. Vérifie toi-même dans le navigateur (aperçu, captures, format téléphone paysage 844 × 390 et iPad 1180 × 820) avant de dire qu’une étape est finie.
- Un commit git par étape réussie.
- Textes en français, typographie française (’ « » espaces insécables).
- Confidentialité : le dépôt et le site GitHub Pages sont publics (sauf compte payant). Ne jamais y mettre de photo de Valentine ni d’information personnelle au-delà de son prénom.
