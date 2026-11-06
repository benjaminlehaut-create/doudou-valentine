// Jeu 4 : l’heure du dodo.
// 1. On choisit le doudou qui va dormir avec Valentine ce soir.
// 2. On remet le rituel du coucher dans l’ordre : bain, pyjama, dents, histoire, câlin, lumière.
//    À chaque étape : « Qu’est-ce qu’on fait maintenant ? » et des cartes au choix.
//    Trop tôt ? « Pas encore ! Qu’est-ce qu’on fait avant ? » (jamais de son négatif) ; au besoin, la bonne carte se dandine.
//    Chaque étape réussie s’anime sur le doudou (bulles, bonnet de nuit, dents qui brillent, histoire…).
// 3. La lumière s’éteint, les étoiles s’allument, une berceuse, et Valentine fait un câlin à son doudou.
// Niveau 1 : 3 cartes à chaque étape. Niveau 2 : les 6 cartes à la fois, à leur place.
// Valentine est en pyjama pendant tout le rituel.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, douceur, berceuse } from '../sons.js';
import { gerbeSur } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger, valentineDuJeu } from './commun.js';
import { placerValentine, valentineLa } from '../valentine.js';

const NIVEAUX = [
  { cartes: 3, indiceApres: 1 },  // la bonne carte se dandine après 1 erreur
  { cartes: 6, indiceApres: 2 },
];

// Les étapes du rituel, dans l’ordre, avec leur image.
export const ETAPES = [
  { id: 'bain', svg: `<svg viewBox="0 0 100 100"><circle cx="30" cy="28" r="7" fill="#cfe9ff" stroke="#9ccff2" stroke-width="2"/><circle cx="46" cy="18" r="5" fill="#cfe9ff" stroke="#9ccff2" stroke-width="2"/><circle cx="62" cy="26" r="8" fill="#cfe9ff" stroke="#9ccff2" stroke-width="2"/>
    <path d="M8 46 H92 V58 Q92 82 66 84 H34 Q8 82 8 58 Z" fill="#fff" stroke="#9ccff2" stroke-width="4"/><path d="M12 50 H88 V58 Q88 64 84 66 H16 Q12 64 12 58 Z" fill="#8fd0f5"/>
    <path d="M26 84 L22 94 M74 84 L78 94" stroke="#9ccff2" stroke-width="5" stroke-linecap="round"/><circle cx="34" cy="48" r="7" fill="#fff"/><circle cx="48" cy="46" r="9" fill="#fff"/><circle cx="64" cy="48" r="7" fill="#fff"/></svg>` },
  { id: 'pyjama', svg: `<svg viewBox="0 0 100 100"><path d="M34 12 L20 18 L6 40 L20 48 L26 38 V90 H74 V38 L80 48 L94 40 L80 18 L66 12 Q50 26 34 12 Z" fill="#9db8f0" stroke="#7c98d8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M40 40 l3 6 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 z" fill="#fff3a6"/><path d="M62 62 l2 5 l5 1 l-4 3 l1 5 l-4 -2 l-5 2 l1 -5 l-4 -3 l5 -1 z" fill="#fff3a6"/><circle cx="58" cy="34" r="3" fill="#fff3a6"/><circle cx="40" cy="74" r="3" fill="#fff3a6"/></svg>` },
  { id: 'dents', svg: `<svg viewBox="0 0 100 100"><g transform="rotate(-32 50 55)">
    <rect x="4" y="57" width="64" height="13" rx="6.5" fill="#5fbf95"/><rect x="10" y="60" width="42" height="4" rx="2" fill="#a5e6c6"/>
    <rect x="60" y="55" width="36" height="16" rx="7" fill="#fff" stroke="#8fcff5" stroke-width="2.5"/>
    <rect x="64" y="37" width="28" height="19" rx="3" fill="#cfeeff" stroke="#8fcff5" stroke-width="2"/>
    <path d="M69 39 V54 M74.5 39 V54 M80 39 V54 M85.5 39 V54" stroke="#8fcff5" stroke-width="2"/>
    <path d="M63 33 Q68 24 73 32 Q78 24 83 32 Q88 25 93 33" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M63 33 Q68 24 73 32 Q78 24 83 32 Q88 25 93 33" fill="none" stroke="#7fd0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>
    <path d="M18 14 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 z" fill="#ffd36b"/><path d="M36 6 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" fill="#ffd36b"/></svg>` },
  { id: 'histoire', svg: `<svg viewBox="0 0 100 100"><path d="M50 26 Q32 16 8 20 V82 Q32 78 50 88 Z" fill="#ffb3c9" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/><path d="M50 26 Q68 16 92 20 V82 Q68 78 50 88 Z" fill="#ffc9d8" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M18 36 Q30 32 42 36 M18 48 Q30 44 42 48 M58 36 Q70 32 82 36 M58 48 Q70 44 82 48" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="70" cy="64" r="8" fill="#fff3a6"/></svg>` },
  { id: 'calin', svg: `<svg viewBox="0 0 100 100"><path d="M50 88 C22 70 6 52 8 34 C10 18 30 10 42 20 Q48 25 50 30 Q52 25 58 20 C70 10 90 18 92 34 C94 52 78 70 50 88 Z" fill="#ff8fab"/>
    <ellipse cx="30" cy="34" rx="8" ry="11" fill="#fff" opacity=".45" transform="rotate(-25 30 34)"/></svg>` },
  { id: 'lumiere', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#3b3f7a"/><path d="M60 22 A28 28 0 1 0 78 66 A22 22 0 1 1 60 22 Z" fill="#fff3a6"/>
    <path d="M24 26 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#fff"/><circle cx="28" cy="66" r="2.5" fill="#fff"/><circle cx="76" cy="30" r="2" fill="#fff"/></svg>` },
];

// Le bonnet de nuit (posé sur la tête du doudou après le pyjama)
const BONNET = `<svg viewBox="0 0 100 60"><path d="M10 52 Q30 4 70 8 Q92 10 96 34 Q80 22 64 26 Q50 32 52 52 Z" fill="#9db8f0"/><rect x="6" y="46" width="52" height="12" rx="6" fill="#fff"/><circle cx="94" cy="38" r="8" fill="#fff"/><path d="M40 22 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z" fill="#fff3a6"/></svg>`;

const LIT = `<svg viewBox="0 0 300 160" preserveAspectRatio="none"><rect x="6" y="6" width="40" height="150" rx="14" fill="#c99a6e"/><rect x="254" y="50" width="40" height="106" rx="14" fill="#c99a6e"/>
  <rect x="20" y="86" width="260" height="46" rx="16" fill="#fff6ee"/><path d="M60 92 H286 Q292 92 292 100 V134 Q292 144 280 144 H60 Q50 144 50 134 V100 Q50 92 60 92 Z" fill="#b8a4f0"/>
  <path d="M60 92 H286 V104 H50 Q50 92 60 92 Z" fill="#cdbdf6"/><circle cx="110" cy="122" r="6" fill="#fff3a6"/><circle cx="170" cy="116" r="6" fill="#fff3a6"/><circle cx="230" cy="124" r="6" fill="#fff3a6"/>
  <ellipse cx="80" cy="84" rx="34" ry="14" fill="#fff"/></svg>`;

export function ouvrirDodo(scene, { aller }) {
  scene.classList.add('ecran-dodo');
  scene.innerHTML = `
    <div class="nuitee">
      <div class="frise"></div>
      <div class="scene-lit">
        <div class="lit">${LIT}</div>
        <div class="dormeur"><div class="bonnet">${BONNET}</div></div>
        <div class="effet"></div>
      </div>
      <div class="choix-dodo"></div>
      <div class="ciel-nuit"><div class="lune"></div></div>
      <div class="final"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const nuitee = scene.querySelector('.nuitee');
  const frise = scene.querySelector('.frise');
  const dormeur = scene.querySelector('.dormeur');
  const effet = scene.querySelector('.effet');
  const choix = scene.querySelector('.choix-dodo');
  const final = scene.querySelector('.final');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let actif = true;
  let minuteries = [];
  let etat = null; // { doudou, etape, erreurs, occupe }
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const question = () => {
    if (!etat || !etat.doudou) return dire('dodo-choix');
    return dire('dodo-quoi');
  };
  brancherBarre(scene, { ecouter: question, aller });
  const valentine = valentineDuJeu(scene, 'pyjama');

  // ---- 1. Choisir son doudou ----
  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    final.replaceChildren();
    nuitee.classList.remove('eteint', 'en-rituel', 'finale');
    nuitee.classList.add('choisir');
    valentine.fond('pyjama');
    etat = { doudou: null, etape: 0, erreurs: 0, occupe: false };
    frise.replaceChildren();
    effet.replaceChildren();
    dormeur.classList.remove('coiffe');
    dormeur.querySelector('.doudou')?.remove();

    choix.className = 'choix-dodo doudous';
    choix.replaceChildren(...doudousActifs().map((d, i) => {
      const b = document.createElement('button');
      b.className = 'candidat';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', d.nom);
      b.append(imageDoudou(d));
      b.addEventListener('click', () => choisir(d, b));
      return b;
    }));
    dire('dodo-choix');
  }

  function choisir(doudou, bouton) {
    if (etat.doudou) return;
    etat.doudou = doudou;
    douceur();
    gerbeSur(bouton, 10);
    bouton.classList.add('elu');
    dire('dodo-choisi', { nom: doudou.nom, id: doudou.id });
    plusTard(() => {
      nuitee.classList.remove('choisir');
      nuitee.classList.add('en-rituel');
      dormeur.prepend(imageDoudou(doudou));
      frise.replaceChildren(...ETAPES.map((e) => {
        const f = document.createElement('div');
        f.className = 'case';
        f.innerHTML = e.svg;
        return f;
      }));
      proposer(true);
    }, 2600);
  }

  // ---- 2. Le rituel dans l’ordre ----
  function proposer(premiere = false) {
    const regle = NIVEAUX[niveau];
    etat.erreurs = 0;
    let cartes;
    if (regle.cartes >= ETAPES.length) {
      cartes = ETAPES; // toutes, toujours à la même place
    } else {
      const bonne = ETAPES[etat.etape];
      const autres = melanger(ETAPES.filter((e, k) => k > etat.etape)).slice(0, regle.cartes - 1);
      cartes = melanger([bonne, ...autres]);
    }
    choix.className = 'choix-dodo cartes';
    choix.replaceChildren(...cartes.map((e, i) => {
      const b = document.createElement('button');
      b.className = 'carte-dodo';
      b.style.setProperty('--i', i);
      b.dataset.id = e.id;
      b.innerHTML = e.svg;
      const fait = ETAPES.indexOf(e) < etat.etape;
      if (fait) b.classList.add('faite');
      b.addEventListener('click', () => toucher(e, b));
      return b;
    }));
    plusTard(() => dire(premiere ? 'dodo-debut' : 'dodo-quoi'), premiere ? 400 : 200);
  }

  function toucher(etape, bouton) {
    if (etat.occupe || bouton.classList.contains('faite')) return;
    const bonne = ETAPES[etat.etape];
    if (etape !== bonne) {
      pop();
      etat.erreurs++;
      bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
      valentine.pose('surprise', { duree: 1200 });
      dire('dodo-pas-encore');
      if (etat.erreurs >= NIVEAUX[niveau].indiceApres) {
        plusTard(() => {
          const b = choix.querySelector(`[data-id="${bonne.id}"]`);
          if (b) { b.classList.remove('indice'); void b.offsetWidth; b.classList.add('indice'); }
        }, 1600);
      }
      return;
    }
    // Bonne étape !
    etat.occupe = true;
    carillon();
    gerbeSur(bouton, 8);
    bouton.classList.add('faite');
    frise.children[etat.etape]?.classList.add('faite');
    jouerEtape(bonne.id);
  }

  // Chaque étape s’anime sur le doudou, puis on passe à la suivante.
  function jouerEtape(id) {
    const d = etat.doudou;
    const vars = { nom: d.nom, id: d.id };
    effet.className = 'effet ' + id;
    effet.innerHTML = '';
    let duree = 4200;

    if (id === 'bain') {
      effet.innerHTML = Array.from({ length: 14 }, (_, k) => `<span style="--k:${k}"></span>`).join('');
      dire('dodo-bain', vars);
    } else if (id === 'pyjama') {
      dormeur.classList.add('coiffe');
      dire('dodo-pyjama', vars);
      duree = 3600;
    } else if (id === 'dents') {
      effet.innerHTML = '<span>✦</span><span>✦</span><span>✦</span>';
      dire('dodo-dents', vars);
      duree = 3600;
    } else if (id === 'histoire') {
      effet.innerHTML = ETAPES[3].svg;
      // On passe à la suite quand l’histoire est finie (ou au bout de 15 s, au cas où)
      const apresHistoire = () => { if (actif && etat && etat.etape === 3 && etat.occupe) suivante(); };
      dire('dodo-histoire', vars).then(() => plusTard(apresHistoire, 800));
      plusTard(apresHistoire, 15000);
    } else if (id === 'calin') {
      valentine.pose('calin', { doudou: d });
      effet.innerHTML = '<span>❤</span><span>❤</span><span>❤</span>';
      dire('dodo-calin', vars);
    } else if (id === 'lumiere') {
      return eteindre();
    }
    if (id !== 'histoire') plusTard(suivante, duree);
  }

  function suivante() {
    if (!etat || !etat.occupe) return;
    etat.etape++;
    etat.occupe = false;
    effet.className = 'effet';
    effet.innerHTML = '';
    if (etat.etape < ETAPES.length) proposer();
  }

  // ---- 3. Bonne nuit ----
  function eteindre() {
    const d = etat.doudou;
    choix.replaceChildren();
    nuitee.classList.add('eteint');
    dormeur.querySelector('.doudou').replaceWith(imageDoudou(d, 'dodo'));
    effet.className = 'effet zzz';
    effet.innerHTML = '<span>z</span><span>z</span><span>z</span>';
    berceuse();
    dire('dodo-lumiere', { nom: d.nom, id: d.id });

    // Valentine, en grand, fait un câlin à son doudou dans la nuit.
    plusTard(() => {
      if (valentineLa()) {
        const ici = document.createElement('div');
        ici.className = 'final-valentine';
        final.replaceChildren(ici);
        placerValentine(ici, 'pyjama').pose('calin', { doudou: d });
      }
      final.classList.add('visible');
      if (valentineLa()) nuitee.classList.add('finale');
    }, 3500);

    plusTard(() => {
      dire('dodo-encore');
      afficherFin(fin, {
        dernier: niveau >= NIVEAUX.length - 1,
        suivant: () => { niveau++; nouvellePartie(); },
        rejouer: nouvellePartie,
        aller,
      });
    }, 9500);
  }

  nouvellePartie();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
