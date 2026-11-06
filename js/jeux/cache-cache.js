// Jeu 2 : le cache-cache des doudous.
// Des doudous se cachent derrière des objets de la chambre. On touche une cachette :
// l’objet se pousse, et soit un doudou apparaît (fête !), soit c’est vide (on cherche encore, sans reproche).
// Niveau 1 : 3 doudous, 5 cachettes, les oreilles dépassent.
// Niveau 2 : 4 doudous, 6 cachettes, bien cachés (ils ne pointent le bout du nez que de temps en temps).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger } from './commun.js';

const NIVEAUX = [
  { doudous: 3, cachettes: 5, oreilles: true },
  { doudous: 4, cachettes: 6, oreilles: false },
];

// Emplacements (en % de l’aire de jeu) : x = centre, y = bas de l’objet, t = taille.
const EMPLACEMENTS = [
  { x: 18, y: 54, t: 0.8 }, { x: 50, y: 52, t: 0.8 }, { x: 82, y: 54, t: 0.8 },
  { x: 17, y: 96, t: 1 }, { x: 50, y: 97, t: 1 }, { x: 83, y: 96, t: 1 },
];

// Les cachettes, dessinées en SVG (120 × 100).
export const OBJETS = {
  coussin: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="52" ry="4" fill="rgba(120,60,40,.18)"/>
    <rect x="5" y="22" width="110" height="74" rx="32" fill="#f4a3bd"/>
    <rect x="12" y="27" width="96" height="30" rx="15" fill="#f9c4d4" opacity=".7"/>
    <path d="M12 30 Q60 62 108 30 M12 90 Q60 56 108 90" stroke="#e48aa7" stroke-width="3" fill="none"/>
    <circle cx="60" cy="59" r="6" fill="#e07898"/></svg>`,
  carton: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="52" ry="4" fill="rgba(120,60,40,.18)"/>
    <path d="M10 36 L4 16 L56 16 L60 36 Z" fill="#e8bb84"/><path d="M110 36 L116 16 L64 16 L60 36 Z" fill="#e3b078"/>
    <rect x="10" y="34" width="100" height="62" rx="6" fill="#d9a066"/>
    <rect x="52" y="34" width="16" height="62" fill="#efe0b0" opacity=".8"/>
    <path d="M20 50 h20 M20 58 h14" stroke="#b97f45" stroke-width="3" stroke-linecap="round"/></svg>`,
  plante: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="40" ry="4" fill="rgba(120,60,40,.18)"/>
    <circle cx="34" cy="44" r="28" fill="#7cc48a"/><circle cx="86" cy="44" r="28" fill="#6db87c"/>
    <circle cx="60" cy="30" r="30" fill="#8fd09b"/><circle cx="60" cy="52" r="26" fill="#78c086"/>
    <circle cx="48" cy="22" r="8" fill="#b4e3bb" opacity=".7"/>
    <path d="M30 64 H90 L82 97 H38 Z" fill="#e58a6b"/><rect x="26" y="60" width="68" height="12" rx="5" fill="#f0a083"/></svg>`,
  panier: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="50" ry="4" fill="rgba(120,60,40,.18)"/>
    <path d="M6 40 H114 L102 96 H18 Z" fill="#e6b468"/>
    <path d="M10 56 H110 M13 72 H107 M16 87 H104" stroke="#c98f4a" stroke-width="3"/>
    <path d="M30 40 V96 M50 40 V96 M70 40 V96 M90 40 V96" stroke="#d6a056" stroke-width="2.5"/>
    <path d="M8 38 Q10 12 40 14 Q60 4 82 14 Q112 12 112 38 Z" fill="#f7c6d4"/>
    <path d="M20 30 h80" stroke="#fbe0e8" stroke-width="5" stroke-dasharray="8 7" stroke-linecap="round"/>
    <rect x="2" y="34" width="116" height="10" rx="5" fill="#d9a052"/></svg>`,
  coffre: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="54" ry="4" fill="rgba(120,60,40,.18)"/>
    <rect x="6" y="40" width="108" height="56" rx="10" fill="#b9a3e6"/>
    <path d="M4 42 Q4 14 60 14 Q116 14 116 42 Z" fill="#cbb8f0"/>
    <rect x="2" y="36" width="116" height="10" rx="5" fill="#a58fd8"/>
    <rect x="50" y="40" width="20" height="18" rx="5" fill="#ffd36b"/>
    <circle cx="30" cy="72" r="8" fill="#ffb3c9"/><path d="M84 64 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-10 6 l3 -11 l-8 -7 l11 -1 z" fill="#fff3b0"/></svg>`,
  pouf: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="97" rx="54" ry="4" fill="rgba(120,60,40,.18)"/>
    <path d="M8 80 Q2 30 40 18 Q60 10 82 18 Q118 30 112 80 Q110 96 60 96 Q10 96 8 80 Z" fill="#9ccff2"/>
    <path d="M30 26 Q44 18 60 18" stroke="#c8e6fa" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M60 18 Q50 56 60 96 M24 30 Q22 64 30 94 M96 30 Q100 64 90 94" stroke="#7fbbe6" stroke-width="3" fill="none"/></svg>`,
};

export function ouvrirCacheCache(scene, { aller }) {
  scene.classList.add('ecran-cache');
  scene.innerHTML = `
    <div class="chambre">
      <div class="compteur"></div>
      <div class="cachettes"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const chambre = scene.querySelector('.chambre');
  const compteur = scene.querySelector('.compteur');
  const zone = scene.querySelector('.cachettes');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let numeroPartie = 0;
  let actif = true;
  let restants = 0;
  let minuteries = [];
  let coucous = null;
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const consigne = () => {
    const cle = niveau === 0 ? 'cache-consigne' : 'cache-consigne-2';
    if (restants > 0 && zone.querySelector('.trouve')) dire('cache-reste', { n: restants === 1 ? 'un' : restants });
    else dire(cle);
  };
  brancherBarre(scene, { ecouter: consigne, aller });

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    clearInterval(coucous);
    numeroPartie++;
    fin.classList.add('cache');

    const regle = NIVEAUX[niveau];
    const actifs = doudousActifs();
    const nbDoudous = Math.min(regle.doudous, actifs.length);
    const caches = melanger([...actifs]).slice(0, nbDoudous);
    const emplacements = melanger([...EMPLACEMENTS]).slice(0, regle.cachettes)
      .sort((a, b) => a.y - b.y); // ceux du fond d’abord, ceux de devant par-dessus
    const objets = melanger(Object.keys(OBJETS));
    const contenus = melanger([...caches, ...Array(regle.cachettes - nbDoudous).fill(null)]);
    restants = nbDoudous;
    chambre.classList.toggle('oreilles', regle.oreilles);

    // Compteur : une pastille par doudou caché, en ombre, qui se colore quand on le trouve.
    compteur.replaceChildren(...caches.map((d) => {
      const p = document.createElement('div');
      p.className = 'pastille';
      p.dataset.id = d.id;
      p.append(imageDoudou(d));
      return p;
    }));

    zone.replaceChildren(...emplacements.map((e, i) => {
      const doudou = contenus[i];
      const c = document.createElement('button');
      c.className = 'cachette';
      c.style.setProperty('--x', e.x + '%');
      c.style.setProperty('--y', e.y + '%');
      c.style.setProperty('--t', e.t);
      c.style.setProperty('--i', i);
      c.innerHTML = `<div class="cachee"></div><div class="objet">${OBJETS[objets[i % objets.length]]}</div>`;
      if (doudou) c.querySelector('.cachee').append(imageDoudou(doudou));
      c.addEventListener('click', () => chercher(c, doudou));
      return c;
    }));

    // De temps en temps, un doudou caché pointe le bout de son nez (un indice).
    coucous = setInterval(() => {
      const caches = [...zone.querySelectorAll('.cachette:not(.trouve)')].filter((c) => c.querySelector('.doudou'));
      if (!caches.length) return;
      const c = caches[Math.floor(Math.random() * caches.length)];
      c.classList.remove('pointe'); void c.offsetWidth; c.classList.add('pointe');
    }, regle.oreilles ? 3500 : 5000);

    consigne();
  }

  function chercher(cachette, doudou) {
    if (cachette.classList.contains('bouge')) return;

    // Déjà trouvé : il refait coucou, pour le plaisir.
    if (cachette.classList.contains('trouve')) {
      douceur();
      montrerPose(cachette, doudou, 'coucou', 'joie', 1400);
      dire('coucou-ami', { nom: doudou.nom, id: doudou.id });
      return;
    }

    pop();
    if (!doudou) {
      // Personne ici : l’objet se soulève et retombe, une petite étoile s’envole.
      cachette.classList.add('bouge', 'vide');
      dire('cache-vide');
      plusTard(() => cachette.classList.remove('bouge', 'vide'), 1100);
      return;
    }

    // Trouvé !
    cachette.classList.add('bouge', 'trouve');
    montrerPose(cachette, doudou, 'coucou');
    carillon();
    gerbeSur(cachette, 10);
    dire('cache-trouve', { nom: doudou.nom, id: doudou.id });
    compteur.querySelector(`[data-id="${doudou.id}"]`)?.classList.add('trouvee');
    restants--;
    plusTard(() => {
      cachette.classList.remove('bouge');
      montrerPose(cachette, doudou, 'joie');
      if (restants === 0) partieGagnee();
    }, 1500);
  }

  function montrerPose(cachette, doudou, pose, ensuite, delai) {
    cachette.querySelector('.cachee').replaceChildren(imageDoudou(doudou, pose));
    if (ensuite) plusTard(() => cachette.querySelector('.cachee').replaceChildren(imageDoudou(doudou, ensuite)), delai);
  }

  function partieGagnee() {
    clearInterval(coucous);
    confettis();
    fanfare();
    zone.querySelectorAll('.cachette.trouve').forEach((c) => c.classList.add('danse'));
    const cettePartie = numeroPartie;
    plusTard(() => {
      dire('cache-gagne').then(() => {
        if (actif && cettePartie === numeroPartie) dire('cache-encore');
      });
    }, 900);
    plusTard(() => afficherFin(fin, {
      dernier: niveau >= NIVEAUX.length - 1,
      suivant: () => { niveau++; nouvellePartie(); },
      rejouer: nouvellePartie,
      aller,
    }), 2200);
  }

  nouvellePartie();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    clearInterval(coucous);
    taire();
  };
}
