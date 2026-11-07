// Jeu 6 : l’histoire dont Valentine est l’héroïne.
// Un livre d’images raconté à voix haute. Chaque histoire est différente :
//   1. Le début (au hasard) : carte au trésor, lettre magique, petite porte dorée, oiseau à la fenêtre.
//   2. Valentine choisit son doudou compagnon.
//   3. Elle choisit le transport (3 au hasard parmi vélo, montgolfière, bateau, fusée, train) → petit voyage animé.
//   4. Elle choisit le lieu (3 au hasard parmi 6) : forêt, plage, lune, château, montagne enneigée, fond de la mer.
//   5. L’arrivée sur place (juste une phrase, pour profiter du décor).
//   6. Une rencontre (au hasard) : un petit animal a perdu son ballon d’une couleur ; il faut trouver le bon.
//   7. Un petit défi sur le chemin, différent à chaque histoire : soit un obstacle (rocher, buisson, flaque)
//      qu’un simple geste suffit à dégager, soit plusieurs chemins parmi lesquels trouver le bon par sa couleur.
//   8. Elle ramasse de 3 à 5 objets dans le décor (la voix compte) — avant ou après la rencontre, au hasard.
//   9. Le personnage rencontré se joint au voyage (juste une phrase).
//   10. Elle choisit une clé pour ouvrir le coffre : chaque clé donne un trésor différent.
//   11. Retour à la maison dans le même transport, et une fin au hasard (dodo, fête, ou on raconte tout à Maman).
// Les étapes purement racontées (arrivée, compagnon qui rejoint) alternent avec celles où l’on agit, l’ordre
// et le type du petit défi changent d’une histoire à l’autre : jamais deux fois exactement la même aventure,
// au-delà du décor. Les ingrédients sont dans js/jeux/histoire-donnees.js.
// Chaque page tourne avec une petite animation, et le décor bouge tout doucement (effet « film d’animation »).
// Grosse flèche rose : page suivante. Oreille : relire.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger } from './commun.js';
import { placerValentine, valentineLa } from '../valentine.js';
import { SUIVANT } from '../icones.js';
import { DEBUTS, TRANSPORTS, LIEUX, ANIMAUX, OBSTACLES, chemin, BALLONS, ballon, CLES, cle, COFFRE_FERME, COFFRE_OUVERT, TRESORS, FINS, DECORS } from './histoire-donnees.js';

const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];
const NOMBRES = { m: ['', 'un', 'deux', 'trois', 'quatre', 'cinq'], f: ['', 'une', 'deux', 'trois', 'quatre', 'cinq'] };
const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export function ouvrirHistoire(scene, { aller }) {
  scene.classList.add('ecran-histoire');
  scene.innerHTML = `
    <div class="livre">
      <div class="decor"></div>
      <div class="heroine"></div>
      <div class="compagnon"></div>
      <div class="interactif"></div>
      <div class="voyage"></div>
      <button class="tourner cache" aria-label="Page suivante">${SUIVANT}</button>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const livre = scene.querySelector('.livre');
  const heroine = scene.querySelector('.heroine');
  const compagnon = scene.querySelector('.compagnon');
  const interactif = scene.querySelector('.interactif');
  const voyage = scene.querySelector('.voyage');
  const tourner = scene.querySelector('.tourner');
  const fin = scene.querySelector('.fin');

  let actif = true;
  let minuteries = [];
  let etape = 0;
  let recit = null;   // tous les choix de cette histoire
  let lecture = null; // la phrase de la page (pour l’oreille)
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const valentine = placerValentine(heroine, 'content');
  if (!valentineLa()) heroine.classList.add('cache');

  brancherBarre(scene, { ecouter: () => lecture && lecture(), aller });
  tourner.addEventListener('click', () => { douceur(); suivante(); });

  // Les valeurs communes à toutes les phrases
  const vars = (plus = {}) => ({
    nom: recit.doudou?.nom, id: recit.doudou?.id,
    transport: recit.transport && TRANSPORTS[recit.transport].nom,
    lieu: recit.lieu && LIEUX[recit.lieu].nom,
    ...plus,
  });

  // Lit la page ; montre la flèche ensuite (si la page n’attend pas un choix)
  function raconter(cle, plus = {}, avecFleche = true) {
    tourner.classList.add('cache');
    lecture = () => dire(cle, vars(plus));
    const fleche = () => { if (actif && avecFleche) tourner.classList.remove('cache'); };
    lecture().then(() => plusTard(fleche, 300));
    if (avecFleche) plusTard(fleche, 10000); // au cas où la voix serait muette
  }

  function decor(classe) {
    // On ne retire que les anciennes classes « page-… » : la classe « tourne » (transition) reste posée
    [...livre.classList].filter((c) => c.startsWith('page-')).forEach((c) => livre.classList.remove(c));
    livre.classList.add('page-' + classe);
    interactif.replaceChildren();
    // Dans un lieu, son dessin devient le grand décor de la page
    const fond = livre.querySelector('.decor');
    fond.innerHTML = DECORS[classe] || '';
  }

  function suivante() {
    // Petite animation de « tournage de page » à chaque changement
    livre.classList.remove('tourne'); void livre.offsetWidth; livre.classList.add('tourne');
    etape++;
    ETAPES[etape]?.();
  }

  // Une rangée de gros boutons de choix
  function choixEnImages(classe, options, quandChoisi) {
    const rangee = document.createElement('div');
    rangee.className = 'choix-images ' + classe;
    let choisi = false;
    rangee.replaceChildren(...options.map(({ id, svg, label }, i) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', label || id);
      if (svg instanceof Node) b.append(svg); else b.innerHTML = svg;
      b.addEventListener('click', () => {
        if (choisi) return;
        const resultat = quandChoisi(id, b);
        if (resultat === false) return; // mauvais choix : on peut réessayer
        choisi = true;
        douceur();
        gerbeSur(b, 10);
        b.classList.add('elu');
      });
      return b;
    }));
    interactif.append(rangee);
    return rangee;
  }

  // La rencontre : retrouver le ballon de la bonne couleur
  function etapeRencontre() {
    decor(recit.lieu);
    valentine.fond('content');
    const { animal, couleur } = recit.rencontre;
    const genre = ANIMAUX[animal].genre === 'f' ? '-f' : '';
    raconter('h-rencontre' + genre, { animal: ANIMAUX[animal].nom, couleur }, false);
    const bete = document.createElement('div');
    bete.className = 'animal triste';
    bete.innerHTML = `<img src="${ANIMAUX[animal].image}" alt="">`;
    interactif.append(bete);
    const couleurs = melanger([couleur, ...melanger(Object.keys(BALLONS).filter((c) => c !== couleur)).slice(0, 2)]);
    choixEnImages('ballons', couleurs.map((c) => ({ id: c, label: 'ballon ' + c, svg: ballon(BALLONS[c]) })), (c, bouton) => {
      if (c !== couleur) {
        pop();
        bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
        valentine.pose('surprise', { duree: 1200 });
        dire('h-rencontre-pas-ca', { couleur });
        return false;
      }
      carillon();
      valentine.pose('joie', { duree: 2400 });
      bete.classList.replace('triste', 'heureux');
      bete.insertAdjacentHTML('beforeend', `<div class="ballon-rendu">${ballon(BALLONS[c])}</div>`);
      dire('h-rencontre-merci' + genre, { animal: ANIMAUX[animal].nom });
      plusTard(() => tourner.classList.remove('cache'), 4500);
      return true;
    });
  }

  // L’obstacle sur le chemin : un seul geste (toucher) suffit à le dégager
  function etapeObstacle() {
    decor(recit.lieu);
    valentine.fond('content');
    const o = OBSTACLES[recit.obstacle];
    raconter('h-obstacle', { obstacle: o.nom }, false);
    const bloc = document.createElement('button');
    bloc.className = 'obstacle';
    bloc.setAttribute('aria-label', o.nom);
    bloc.innerHTML = o.svg;
    bloc.addEventListener('click', () => {
      bloc.classList.add('degage');
      pop();
      gerbeSur(bloc, 8);
      carillon();
      valentine.pose('joie', { duree: 1800 });
      dire('h-obstacle-degage');
      plusTard(() => tourner.classList.remove('cache'), 1600);
    }, { once: true });
    interactif.append(bloc);
  }

  // L’autre petit défi possible : plusieurs chemins, retrouver celui de la bonne couleur
  function etapeChemin() {
    decor(recit.lieu);
    valentine.fond('loupe');
    const couleur = recit.cheminCouleur;
    raconter('h-chemin', { couleur }, false);
    const couleurs = melanger([couleur, ...melanger(Object.keys(BALLONS).filter((c) => c !== couleur)).slice(0, 2)]);
    choixEnImages('chemins', couleurs.map((c) => ({ id: c, label: 'chemin ' + c, svg: chemin(BALLONS[c]) })), (c, bouton) => {
      if (c !== couleur) {
        pop();
        bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
        dire('h-chemin-pas-ca', { couleur });
        return false;
      }
      carillon();
      valentine.pose('joie', { duree: 1800 });
      dire('h-chemin-trouve');
      plusTard(() => tourner.classList.remove('cache'), 2600);
      return true;
    });
  }

  // ---- Les étapes de l’histoire ----
  // 1. Le début
  function etapeDebut() {
    decor('chambre');
    compagnon.replaceChildren();
    valentine.fond('surprise');
    const objet = document.createElement('div');
    objet.className = 'objet-debut';
    objet.innerHTML = DEBUTS[recit.debut];
    interactif.append(objet);
    raconter('h-debut-' + recit.debut);
  }
  // 2. Le doudou compagnon
  function etapeCompagnon() {
    decor('choix');
    valentine.fond('content');
    raconter('h-compagnon', {}, false);
    choixEnImages('doudous', doudousActifs().map((d) => ({ id: d.id, label: d.nom, svg: imageDoudou(d) })), (id) => {
      recit.doudou = doudousActifs().find((d) => d.id === id);
      compagnon.replaceChildren(imageDoudou(recit.doudou, 'coucou'));
      dire('h-compagnon-choisi', vars());
      plusTard(suivante, 3200);
    });
  }
  // 3. Le transport, puis le voyage
  function etapeTransport() {
    decor('choix');
    compagnon.replaceChildren(imageDoudou(recit.doudou));
    raconter('h-transport', {}, false);
    const proposes = melanger(Object.keys(TRANSPORTS)).slice(0, 3);
    choixEnImages('transports', proposes.map((id) => ({ id, label: TRANSPORTS[id].nom, svg: TRANSPORTS[id].svg })), (id) => {
      recit.transport = id;
      dire('h-transport-choisi', vars());
      plusTard(() => voyager(id), 1600);
      plusTard(suivante, 5200);
    });
  }
  // 4. Le lieu
  function etapeLieu() {
    decor('choix');
    valentine.fond('content');
    raconter('h-lieu', {}, false);
    const proposes = melanger(Object.keys(LIEUX)).slice(0, 3);
    choixEnImages('lieux', proposes.map((id) => ({ id, label: LIEUX[id].nom, svg: LIEUX[id].dessin })), (id) => {
      recit.lieu = id;
      dire('h-lieu-choisi', vars());
      plusTard(suivante, 2600);
    });
  }
  // 5. L’arrivée : une phrase, juste pour profiter du décor
  function etapeArrivee() {
    decor(recit.lieu);
    valentine.fond('content');
    raconter('h-arrivee');
  }
  // Ramasser des objets (de 3 à 5)
  function etapeRamasser() {
    const lieu = LIEUX[recit.lieu];
    decor(recit.lieu);
    valentine.fond('loupe');
    const n = recit.combien;
    raconter('h-ramasser', { quantite: `${NOMBRES[lieu.genre][n]} ${lieu.objets}` }, false);
    const places = melanger([[16, 22], [40, 14], [66, 24], [88, 16], [28, 52], [56, 50], [82, 54], [44, 82], [74, 84]]).slice(0, n);
    let trouves = 0;
    places.forEach(([x, y], i) => {
      const b = document.createElement('button');
      b.className = 'trouvaille';
      b.style.left = x + '%';
      b.style.top = y + '%';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', lieu.objet);
      b.innerHTML = lieu.trouvaille;
      b.addEventListener('click', () => {
        if (b.classList.contains('ramasse')) return;
        b.classList.add('ramasse');
        trouves++;
        pop();
        gerbeSur(b, 6);
        dire('histoire-compte', { mot: majuscule(NOMBRES[lieu.genre][trouves]) });
        if (trouves === n) {
          carillon();
          valentine.pose('joie', { duree: 2000 });
          plusTard(suivante, 1800);
        }
      });
      interactif.append(b);
    });
  }
  // Le compagnon rencontré se joint au voyage : une phrase
  function etapeCompagnonRejoint() {
    interactif.replaceChildren();
    const { animal } = recit.rencontre;
    const genre = ANIMAUX[animal].genre === 'f' ? '-f' : '';
    valentine.fond('joie');
    raconter('h-compagnon-rejoint' + genre, { animal: ANIMAUX[animal].nom });
  }
  // Le coffre et les trois clés
  function etapeCoffre() {
    interactif.replaceChildren();
    valentine.fond('surprise');
    raconter('h-coffre', {}, false);
    const coffre = document.createElement('div');
    coffre.className = 'coffre-tresor';
    coffre.innerHTML = COFFRE_FERME;
    interactif.append(coffre);
    // chaque clé cache un trésor différent
    const tresors = melanger(Object.keys(TRESORS)).slice(0, 3);
    const cles = Object.keys(CLES);
    choixEnImages('cles', cles.map((id) => ({ id, label: 'clé ' + id, svg: cle(CLES[id]) })), (id) => {
      const tresor = tresors[cles.indexOf(id)];
      recit.tresor = tresor;
      coffre.innerHTML = COFFRE_OUVERT;
      fanfare();
      confettis(50);
      coffre.insertAdjacentHTML('beforeend', `<div class="tresor">${TRESORS[tresor].svg}</div>`);
      valentine.fond('joie');
      compagnon.replaceChildren(imageDoudou(recit.doudou, 'joie'));
      raconter('h-tresor', { tresor: TRESORS[tresor].nom });
    });
  }
  // Le retour, et la fin
  function etapeRetour() {
    voyager(recit.transport, true);
    raconter('h-retour', {}, false);
    plusTard(finir, 4600);
  }

  // Construit la liste des étapes pour cette histoire : le défi (obstacle ou chemin) et l’ordre
  // avec le ramassage changent à chaque fois, pour que l’aventure varie au-delà du simple décor.
  function construireEtapes() {
    const defi = recit.defi === 'chemin' ? etapeChemin : etapeObstacle;
    const aventure = recit.ramasserDabord
      ? [etapeRamasser, etapeRencontre, defi]
      : [etapeRencontre, defi, etapeRamasser];
    return [
      etapeDebut, etapeCompagnon, etapeTransport, etapeLieu, etapeArrivee,
      ...aventure,
      etapeCompagnonRejoint, etapeCoffre, etapeRetour,
    ];
  }
  let ETAPES = [];

  // Le transport traverse la page (Valentine et son doudou sont dedans)
  function voyager(id, retour = false) {
    voyage.innerHTML = `<div class="vehicule ${id}">${TRANSPORTS[id].svg}</div>`;
    voyage.classList.remove('part', 'revient'); void voyage.offsetWidth;
    voyage.classList.add(retour ? 'revient' : 'part');
    livre.classList.add('en-voyage');
    plusTard(() => livre.classList.remove('en-voyage'), 3400);
  }

  function finir() {
    decor('chambre');
    const laFin = recit.fin;
    if (laFin === 'dodo') {
      valentine.pose('calin', { doudou: recit.doudou });
      compagnon.replaceChildren(valentineLa() ? '' : imageDoudou(recit.doudou, 'dodo'));
      livre.classList.add('nuit-histoire');
    } else if (laFin === 'fete') {
      valentine.fond('joie');
      compagnon.replaceChildren();
      const ronde = document.createElement('div');
      ronde.className = 'fete-doudous';
      doudousActifs().forEach((d, i) => { const e = imageDoudou(d, 'joie'); e.style.setProperty('--i', i); ronde.append(e); });
      interactif.append(ronde);
      confettis(60);
    } else {
      valentine.fond('coucou');
      compagnon.replaceChildren(imageDoudou(recit.doudou, 'coucou'));
      interactif.innerHTML = `<div class="tresor-final">${TRESORS[recit.tresor].svg}</div>`;
    }
    raconter('h-fin-' + laFin, { tresor: TRESORS[recit.tresor].nom }, false);
    plusTard(() => afficherFin(fin, { dernier: true, rejouer: nouvelleHistoire, aller }), 10000);
  }

  function nouvelleHistoire() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    livre.classList.remove('nuit-histoire');
    recit = {
      debut: auHasard(Object.keys(DEBUTS)),
      doudou: null,
      transport: null,
      lieu: null,
      rencontre: { animal: auHasard(Object.keys(ANIMAUX)), couleur: auHasard(Object.keys(BALLONS)) },
      obstacle: auHasard(Object.keys(OBSTACLES)),
      cheminCouleur: auHasard(Object.keys(BALLONS)),
      defi: auHasard(['obstacle', 'chemin']),
      ramasserDabord: Math.random() < 0.5,
      combien: 3 + Math.floor(Math.random() * 3),
      tresor: null,
      fin: auHasard(FINS),
    };
    ETAPES = construireEtapes();
    etape = 0;
    ETAPES[0]();
  }

  nouvelleHistoire();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
