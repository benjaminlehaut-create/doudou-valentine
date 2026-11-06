# Le monde des doudous de Valentine — brief du projet

Lis ce fichier en entier au début de chaque session. Il fait référence.

## 1. Vision

Une application pour **Valentine, 3 ans**, utilisée sur **iPad et smartphone**. Plusieurs mini-jeux dont les héros sont **ses vrais doudous** (images dans `assets/doudous/`). L’écran d’accueil montre les doudous ; chaque porte (et plus tard chaque doudou) mène à un jeu.

Jeux, dans l’ordre de réalisation :

1. **Memory des doudous** — fait (4 paires, puis 6).
2. **Cache-cache des doudous** — fait, refait le 6 novembre 2026 car trop facile (« elle est très évoluée »). `js/jeux/cache-cache.js`. Les doudous se cachent derrière des objets dessinés en SVG (coussin rose, carton marron, plante verte, panier jaune, coffre violet, pouf bleu : chaque couleur est unique, elle sert d’indice). Rien ne dépasse des cachettes. Il faut retrouver les doudous **un par un, dans l’ordre demandé** (le doudou cherché est en grand en haut à gauche). Ouvrir la mauvaise cachette n’est pas un échec : le doudou qui s’y trouve dit bonjour (« Coucou, c’est moi Cappy ! Mais où est Debby ? ») puis se recache. Niveau 1, « Regarde bien » : on voit les 3 doudous aller se cacher, puis « Où est Debby ? ». Niveau 2, « Les indices » : on ne les voit pas se cacher ; « Sacha se cache derrière quelque chose de bleu ». Niveau 3, « La mémoire » : 4 doudous, 6 cachettes, ils se cachent vite. Pistes si c’est encore trop facile : indices de position (« à côté de la plante »), doudous qui changent de cachette, plus de cachettes.
3. **Le pique-nique** — fait (`js/jeux/pique-nique.js`, aliments dessinés en SVG dans `js/jeux/aliments.js`). Un doudou a faim : **une bulle au-dessus de lui montre ce qu’il veut** (une grosse tache de la couleur voulue, ou autant d’aliments en ombre qu’il en faut, qui se colorent un à un) et la voix le dit. **On compose l’assiette librement** (toucher un aliment du panier le pose dans l’assiette, toucher un aliment de l’assiette le remet dans le panier), puis on appuie sur le **bouton vert ✓ « valider »** (décidé le 6 novembre 2026). Juste : le doudou mange (pose « mange », bruit de croque) puis saute de joie. Faux : le doudou est un peu triste (pose « bobo »), explique gentiment (« c’est trop », « il en manque », « je ne voulais que des fraises ») et on corrige. Niveau 1, les couleurs : un fruit de la bonne couleur parmi 3. Niveau 2, les quantités : panier mélangé (5 du bon aliment + 3 d’un autre), il faut le bon aliment ET le bon nombre ; la voix compte. Après 9 s sans rien faire, le bon aliment se dandine.
4. **L’heure du dodo** — fait (`js/jeux/dodo.js`). On choisit le doudou qui dort avec Valentine ce soir, puis on remet le rituel dans l’ordre : bain, pyjama, dents, histoire, câlin, lumière (cartes illustrées en SVG ; frise en haut à gauche). Trop tôt : « Pas encore ! Qu’est-ce qu’on fait avant ? », et la bonne carte se dandine après 1 erreur (niveau 1) ou 2 (niveau 2). Chaque étape s’anime (bulles, bonnet de nuit, dents qui brillent, petite histoire dite par la voix, câlin de Valentine). Lumière : la chambre s’éteint, étoiles, berceuse (« Au clair de la lune », synthétisée), puis Valentine en grand fait un câlin au doudou choisi. Niveau 1 : 3 cartes par étape ; niveau 2 : les 6 cartes à la fois, à leur place.
5. **Le docteur des doudous** — fait (`js/jeux/docteur.js`). Valentine en blouse. Chaque doudou arrive avec un problème visible : bobo à la patte (plaie qui palpite ; seul cas avec la pose « bobo »), fièvre (vagues de chaleur), rhume (goutte au nez, il éternue), peur (petit nuage de pluie). Six outils toujours à la même place : pansement, thermomètre, sirop, mouchoir, stéthoscope (indice : boum-boum puis la voix redit le problème), câlin. Fièvre : thermomètre D’ABORD, puis sirop (sinon « Attends ! D’abord… »). Guéri : joie, fanfare, câlin de Valentine. Niveau 1 : un problème par doudou ; niveau 2 : deux.
6. **L’histoire de Valentine** — fait (`js/jeux/histoire.js`). Livre d’images raconté : carte au trésor sous l’oreiller ; elle choisit son doudou compagnon ; elle choisit le lieu (forêt enchantée, plage, lune) ; elle ramasse 3 objets dans le décor (champignons, coquillages, étoiles ; la voix compte) ; elle ouvre le coffre (couronne magique) ; retour à la maison, câlin, « Fin ». Grosse flèche rose pour tourner la page ; l’oreille relit la page. Ici Valentine est en grand (pas de coin).

L’interlocuteur (le parent) a un **profil métier, pas développeur** : explique simplement, en français, ce qui a changé et comment le voir. Code simple, lisible, commenté en français.

## 1 bis. Valentine, la guide (décidé le 6 novembre 2026)

Valentine elle-même est le personnage principal : la guide qui accompagne ses doudous dans tous les jeux.

- **Images** : `assets/valentine/` (PNG détourés 768 × 768 : `valentine-content`, `coucou`, `loupe`, `pyjama`, `docteur`, `mange`, `joie`, `calin`, `surprise`, plus `valentine-portrait`, portrait rond). Décrites dans `data/valentine.json` (nom de pose → chemin), pour remplacer ou ajouter une pose en une ligne. Les images ChatGPT arrivent souvent un peu transparentes : `node tools/opacifier.mjs assets/valentine` les rend opaques (sans risque si on le relance).
- **Confidentialité** : ce sont des portraits reconnaissables de l’enfant. `assets/valentine/` est dans `.gitignore` : **jamais publié sur GitHub** (dépôt public). Sans ces images (version en ligne), Valentine n’apparaît simplement pas et tout le reste fonctionne.
- **Code** : `js/valentine.js`. `placerValentine(conteneur, poseDeFond)` renvoie `{ pose(nom, { duree, doudou }), fond(nom) }`. Dans un jeu : `valentineDuJeu(scene, 'content')` (de `js/jeux/commun.js`) la place dans son coin, au-dessus des boutons « oreille » et « maison », à environ 25 % de la hauteur d’écran.
- **Animation** : changement de pose en fondu de 200 ms et petit rebond doux ; respiration continue (échelle 1 → 1,02).
- **Pose câlin** : le doudou choisi est superposé devant elle, entre ses bras (`pose('calin', { doudou })`). Position et taille réglables dans `data/valentine.json` (`calin` : x, y, taille en %).
- **Accueil** : Valentine debout au centre, **montrée en entier** (pas d’agrandissement à l’accueil), coucou à l’arrivée, joie si on la touche, avec la voix « Coucou Valentine ! Avec qui tu veux jouer aujourd’hui ? ». Ses doudous sont autour d’elle : autant en « ( » à sa gauche qu’en « ) » à sa droite, et, si leur nombre est impair, un au-dessus de sa tête (3 + 3 + 1 pour 7), avec un espace pour ne pas la toucher. Chacun a sa place à part : **un doudou ne doit jamais passer devant elle**. Son portrait rond orne le bouton de démarrage.
- **Poses dans les jeux** :
  - Memory : content pendant la partie, surprise quand on retourne une carte, joie quand on trouve une paire et à la fin.
  - Cache-cache : loupe pendant la recherche, surprise quand on ouvre la mauvaise cachette, joie quand on trouve un doudou.
  - Pique-nique : content, surprise quand le doudou est triste, mange quand un doudou mange, joie à la fin.
  - Dodo (à faire) : pyjama pendant tout le rituel ; à la fin, câlin avec le doudou choisi.
  - Docteur (à faire) : docteur pendant les soins ; câlin quand le doudou est guéri.
  - Histoire (à faire) : c’est l’héroïne, avec les poses selon les pages.

## 2. Règles pour une enfant de 3 ans (non négociables)

- **Elle ne sait pas lire** : toute consigne est **dite à voix haute** (Web Speech API, `fr-FR`, débit lent, réglable). Aucun texte n’est nécessaire pour jouer. Un bouton « oreille » répète la consigne.
- Voix remplaçable par des **enregistrements** : dans `data/phrases.json`, une variante peut être `{ "texte": "…", "audio": "assets/voix/xxx.mp3" }` ; si le fichier manque ou échoue, la voix de synthèse prend le relais.
- **Cibles tactiles ≥ 80 px.** Pas de glisser-déposer difficile ; s’il en faut un, zone de tolérance très large.
- **Aucun échec, aucun chrono visible, aucune pub, aucun lien externe.** Une erreur n’est jamais sanctionnée : pas de son négatif, pas de perte, on peut toujours corriger. Assoupli à la demande du parent (6 novembre 2026, car Valentine est très éveillée) : un doudou peut être **un peu triste** et l’expliquer gentiment quand la réponse est fausse (pique-nique), et les jeux peuvent demander de la réflexion (ordre, indices, mémoire).
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
- **Doudous reçus (6 novembre 2026)** : Cappy (dossier `doudou-marron`), Sacha (`chat-bleu`), Debby (`chat-rose`), Pandy Panda (`panda`), Poussin (`poussin-jaune`), Koala Doux (`koala-doux`, fichiers d’origine `koala_gris_*`), Kiki (`kiki`, d’origine `doudou_yeux_bleus_*` ; d’abord pris pour Goubi par erreur, renommé le 6 novembre 2026), Goubi (`goubi`, souris grise au cœur « Love », 6 images ChatGPT reçues le 6 novembre 2026, opacifiées et recadrées). **8 doudous.** Les illustrations d’origine (`xxx_01_content.png`…) sont renommées par pose.
- **Détourage** (refait le 6 novembre 2026) : toutes les poses sont redétourées, recadrées et centrées de la même façon (768 × 768, marge 5 %, posées en bas). Sans liseré blanc : le masque vient d’un modèle d’IA de détourage (`@imgly/background-removal`, exécuté dans le navigateur, car le Node.js du PC est en 32 bits et ne peut pas le faire tourner), puis le blanc est retiré des pixels de bord. Kiki garde son détourage d’origine, qui était bon, simplement recadré. Koala Doux a été remplacé le 6 novembre 2026 par six vraies poses illustrées (ChatGPT), déjà détourées mais un peu transparentes : opacité remontée, puis recadrage identique aux autres.
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
js/accueil.js         écran d’accueil (Valentine au centre, doudous autour, portes des jeux)
js/valentine.js       Valentine, la guide (poses, fondu, câlin)
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
- Confidentialité : le dépôt et le site GitHub Pages sont publics (sauf compte payant). Ne jamais y mettre de photo ou d’illustration ressemblante de Valentine (`assets/valentine/` est exclu de git) ni d’information personnelle au-delà de son prénom.
- Pièges déjà rencontrés : un `padding` en % se calcule sur la largeur du parent (utiliser des px) ; une hauteur en % dans une grille exige une ligne de taille fixe (`minmax(0, 1fr)`) ; dans l’aperçu caché, les animations et `requestAnimationFrame` sont gelés, donc ne jamais faire dépendre la logique du jeu de la fin d’une animation (utiliser `setTimeout`).
