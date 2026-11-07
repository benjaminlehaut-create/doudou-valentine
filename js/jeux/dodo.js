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
  { id: 'bain', svg: `<img src="assets/objets/dodo-bain.png" alt="">` },
  { id: 'pyjama', svg: `<img src="assets/objets/dodo-pyjama.png" alt="">` },
  { id: 'dents', svg: `<img src="assets/objets/dodo-brosse.png" alt="">` },
  { id: 'histoire', svg: `<img src="assets/objets/dodo-livre.png" alt="">` },
  { id: 'calin', svg: `<img src="assets/objets/dodo-calin.png" alt="">` },
  { id: 'lumiere', svg: `<img src="assets/objets/dodo-veilleuse.png" alt="">` },
];

// Le bonnet de nuit (posé sur la tête du doudou après le pyjama)
const BONNET = `<img src="assets/objets/dodo-bonnet.png" alt="">`;

const LIT = `<img src="assets/objets/dodo-lit.png" alt="">`;

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
