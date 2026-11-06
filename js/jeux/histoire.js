// Jeu 6 : l’histoire dont Valentine est l’héroïne.
// Un livre d’images raconté à voix haute, où Valentine fait des choix qui changent l’histoire :
//   1. Valentine trouve une carte au trésor sous son oreiller.
//   2. Elle choisit le doudou qui part avec elle.
//   3. Elle choisit où aller : la forêt enchantée, la plage ou la lune.
//   4. Pour trouver le trésor, elle ramasse 3 objets cachés dans le décor (la voix compte).
//   5. Elle ouvre le coffre au trésor.
//   6. Retour à la maison, un gros câlin, et « Fin ».
// Une grosse flèche passe à la page suivante. Le bouton « oreille » relit la page.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger } from './commun.js';
import { placerValentine, valentineLa } from '../valentine.js';
import { SUIVANT } from '../icones.js';

// Les trois lieux de l’aventure, avec l’objet à ramasser
const LIEUX = {
  foret: {
    nom: 'la forêt enchantée',
    objet: 'champignon',
    objets: 'champignons',
    genre: 'm',
    dessin: `<svg viewBox="0 0 100 100"><circle cx="50" cy="44" r="40" fill="#8fd09b"/><circle cx="30" cy="56" r="26" fill="#6db87c"/><circle cx="72" cy="56" r="26" fill="#78c086"/><rect x="44" y="64" width="12" height="30" rx="4" fill="#a8774f"/><circle cx="40" cy="36" r="5" fill="#ff8fab"/><circle cx="64" cy="30" r="5" fill="#fff3a6"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M14 52 Q14 14 50 12 Q86 14 86 52 Z" fill="#ef4d5a"/><circle cx="34" cy="34" r="7" fill="#fff"/><circle cx="60" cy="26" r="5" fill="#fff"/><circle cx="68" cy="42" r="6" fill="#fff"/><path d="M36 52 H64 V82 Q64 90 50 90 Q36 90 36 82 Z" fill="#fff4e6" stroke="#f2c9a8" stroke-width="3"/></svg>`,
  },
  plage: {
    nom: 'la plage',
    objet: 'coquillage',
    objets: 'coquillages',
    genre: 'm',
    dessin: `<svg viewBox="0 0 100 100"><circle cx="72" cy="28" r="14" fill="#ffd36b"/><path d="M0 60 Q25 50 50 60 T100 60 V100 H0 Z" fill="#6cc4e8"/><path d="M0 78 Q25 70 50 78 T100 78 V100 H0 Z" fill="#f6dfb0"/><path d="M14 58 q6 -6 12 0 M60 56 q6 -6 12 0" stroke="#fff" stroke-width="3" fill="none"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 88 L14 40 Q30 12 50 12 Q70 12 86 40 Z" fill="#ffb3c9" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/><path d="M50 88 L32 22 M50 88 L50 12 M50 88 L68 22 M50 88 L22 34 M50 88 L78 34" stroke="#e98aa8" stroke-width="3"/><rect x="40" y="82" width="20" height="10" rx="4" fill="#e98aa8"/></svg>`,
  },
  lune: {
    nom: 'la lune',
    objet: 'étoile',
    objets: 'étoiles',
    genre: 'f',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#3b3f7a"/><circle cx="50" cy="58" r="30" fill="#e9e4d4"/><circle cx="40" cy="50" r="6" fill="#cfc8b4"/><circle cx="60" cy="66" r="8" fill="#cfc8b4"/><circle cx="58" cy="44" r="4" fill="#cfc8b4"/><circle cx="18" cy="18" r="2" fill="#fff"/><circle cx="82" cy="22" r="2.5" fill="#fff"/><circle cx="28" cy="84" r="2" fill="#fff"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="44" r="4" fill="#5a4030"/><circle cx="60" cy="44" r="4" fill="#5a4030"/><path d="M42 56 q8 8 16 0" stroke="#5a4030" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
};

const CARTE = `<svg viewBox="0 0 120 100"><path d="M8 14 L40 6 L80 14 L112 6 V86 L80 94 L40 86 L8 94 Z" fill="#f6e3b4" stroke="#d8b778" stroke-width="3" stroke-linejoin="round"/><path d="M40 6 V86 M80 14 V94" stroke="#d8b778" stroke-width="2" opacity=".6"/>
  <path d="M20 74 Q36 50 52 62 T86 34" stroke="#c0704a" stroke-width="3" stroke-dasharray="6 6" fill="none"/><path d="M84 24 l10 10 M94 24 l-10 10" stroke="#ef4d5a" stroke-width="5" stroke-linecap="round"/></svg>`;

const COFFRE = `<svg viewBox="0 0 120 100"><rect x="10" y="44" width="100" height="50" rx="8" fill="#b9773e"/><path d="M8 48 Q8 12 60 12 Q112 12 112 48 Z" fill="#cf8a4b" class="couvercle"/>
  <rect x="10" y="44" width="100" height="10" fill="#ffd36b"/><rect x="52" y="40" width="16" height="22" rx="4" fill="#ffd36b"/><circle cx="60" cy="52" r="3" fill="#7a4a22"/>
  <path d="M30 12 V94 M90 12 V94" stroke="#ffd36b" stroke-width="6"/></svg>`;

const TRESOR = `<svg viewBox="0 0 100 100"><path d="M18 70 L24 30 L40 50 L50 22 L60 50 L76 30 L82 70 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3" stroke-linejoin="round"/><rect x="18" y="68" width="64" height="12" rx="4" fill="#f0b92a"/>
  <circle cx="50" cy="20" r="5" fill="#ff8fab"/><circle cx="24" cy="28" r="4" fill="#9ad0f5"/><circle cx="76" cy="28" r="4" fill="#8fd6a8"/><circle cx="50" cy="74" r="4" fill="#ff8fab"/></svg>`;

export function ouvrirHistoire(scene, { aller }) {
  scene.classList.add('ecran-histoire');
  scene.innerHTML = `
    <div class="livre">
      <div class="decor"></div>
      <div class="heroine"></div>
      <div class="compagnon"></div>
      <div class="interactif"></div>
      <button class="tourner cache" aria-label="Page suivante">${SUIVANT}</button>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const livre = scene.querySelector('.livre');
  const decor = scene.querySelector('.decor');
  const heroine = scene.querySelector('.heroine');
  const compagnon = scene.querySelector('.compagnon');
  const interactif = scene.querySelector('.interactif');
  const tourner = scene.querySelector('.tourner');
  const fin = scene.querySelector('.fin');

  let actif = true;
  let minuteries = [];
  let page = 0;
  let recit = null; // { doudou, lieu }
  let lecture = null; // la phrase de la page (pour l’oreille)
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const valentine = placerValentine(heroine, 'content');
  if (!valentineLa()) heroine.classList.add('cache');

  brancherBarre(scene, { ecouter: () => lecture && lecture(), aller });
  tourner.addEventListener('click', () => { douceur(); pageSuivante(); });

  // Lit une phrase et montre la flèche quand elle est finie
  function raconter(cle, vars = {}, avecFleche = true) {
    tourner.classList.add('cache');
    lecture = () => dire(cle, { ...vars, nom: recit?.doudou?.nom, id: recit?.doudou?.id, lieu: recit?.lieu && LIEUX[recit.lieu].nom });
    const fleche = () => { if (actif && avecFleche) tourner.classList.remove('cache'); };
    lecture().then(() => plusTard(fleche, 300));
    if (avecFleche) plusTard(fleche, 9000); // au cas où la voix serait muette
  }

  function changerDecor(classe) {
    livre.className = 'livre page-' + classe;
    interactif.replaceChildren();
  }

  function pageSuivante() {
    page++;
    PAGES[page]?.();
  }

  // ---- Les pages ----
  const PAGES = [
    // 1. La carte au trésor
    () => {
      changerDecor('chambre');
      compagnon.replaceChildren();
      valentine.fond('surprise');
      const carte = document.createElement('div');
      carte.className = 'carte-tresor';
      carte.innerHTML = CARTE;
      interactif.append(carte);
      raconter('histoire-1');
    },
    // 2. Le choix du doudou
    () => {
      changerDecor('choix');
      valentine.fond('content');
      raconter('histoire-2', {}, false);
      const choix = document.createElement('div');
      choix.className = 'choix-histoire';
      choix.replaceChildren(...doudousActifs().map((d, i) => {
        const b = document.createElement('button');
        b.className = 'candidat';
        b.style.setProperty('--i', i);
        b.setAttribute('aria-label', d.nom);
        b.append(imageDoudou(d));
        b.addEventListener('click', () => {
          if (recit.doudou) return;
          recit.doudou = d;
          douceur();
          gerbeSur(b, 10);
          b.classList.add('elu');
          compagnon.replaceChildren(imageDoudou(d, 'coucou'));
          dire('histoire-2-choisi', { nom: d.nom, id: d.id });
          plusTard(pageSuivante, 3000);
        });
        return b;
      }));
      interactif.append(choix);
    },
    // 3. Le choix du lieu
    () => {
      changerDecor('choix');
      compagnon.replaceChildren(imageDoudou(recit.doudou));
      raconter('histoire-3', {}, false);
      const choix = document.createElement('div');
      choix.className = 'choix-lieux';
      choix.replaceChildren(...Object.entries(LIEUX).map(([id, l], i) => {
        const b = document.createElement('button');
        b.className = 'lieu';
        b.style.setProperty('--i', i);
        b.setAttribute('aria-label', l.nom);
        b.innerHTML = l.dessin;
        b.addEventListener('click', () => {
          if (recit.lieu) return;
          recit.lieu = id;
          douceur();
          gerbeSur(b, 10);
          b.classList.add('elu');
          dire('histoire-3-choisi', { lieu: l.nom });
          plusTard(pageSuivante, 2600);
        });
        return b;
      }));
      interactif.append(choix);
    },
    // 4. Ramasser 3 objets cachés dans le décor
    () => {
      const lieu = LIEUX[recit.lieu];
      changerDecor(recit.lieu);
      valentine.fond('loupe');
      compagnon.replaceChildren(imageDoudou(recit.doudou));
      raconter('histoire-4', { objets: lieu.objets }, false);
      const places = melanger([[38, 22], [56, 62], [74, 30], [88, 70], [46, 80], [66, 12]]).slice(0, 3);
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
          const mots = lieu.genre === 'f' ? ['', 'Une', 'Deux', 'Trois'] : ['', 'Un', 'Deux', 'Trois'];
          dire('histoire-compte', { mot: mots[trouves] });
          if (trouves === 3) {
            carillon();
            valentine.pose('joie', { duree: 2000 });
            plusTard(pageSuivante, 1800);
          }
        });
        interactif.append(b);
      });
    },
    // 5. Le coffre au trésor
    () => {
      interactif.replaceChildren();
      valentine.fond('surprise');
      compagnon.replaceChildren(imageDoudou(recit.doudou));
      raconter('histoire-5', {}, false);
      const coffre = document.createElement('button');
      coffre.className = 'coffre-tresor';
      coffre.setAttribute('aria-label', 'Ouvrir le coffre');
      coffre.innerHTML = COFFRE;
      coffre.addEventListener('click', () => {
        if (coffre.classList.contains('ouvert')) return;
        coffre.classList.add('ouvert');
        fanfare();
        confettis(50);
        const t = document.createElement('div');
        t.className = 'tresor';
        t.innerHTML = TRESOR;
        coffre.append(t);
        valentine.fond('joie');
        compagnon.replaceChildren(imageDoudou(recit.doudou, 'joie'));
        raconter('histoire-5-ouvert');
      });
      interactif.append(coffre);
    },
    // 6. Retour à la maison, câlin, fin
    () => {
      changerDecor('chambre');
      compagnon.replaceChildren();
      valentine.pose('calin', { doudou: recit.doudou });
      if (!valentineLa()) compagnon.replaceChildren(imageDoudou(recit.doudou, 'dodo'));
      raconter('histoire-6', {}, false);
      plusTard(() => {
        afficherFin(fin, { dernier: true, rejouer: nouvelleHistoire, aller });
      }, 9000);
    },
  ];

  function nouvelleHistoire() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    recit = { doudou: null, lieu: null };
    page = 0;
    PAGES[0]();
  }

  nouvelleHistoire();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
