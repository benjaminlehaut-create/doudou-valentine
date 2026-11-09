// Morceaux partagés par tous les jeux : boutons « oreille » et « maison », écran de fin, mélange.

import { douceur } from '../sons.js';
import { MAISON, OREILLE, REJOUER, SUIVANT, CADENAS } from '../icones.js';
import { placerValentine } from '../valentine.js';
import { niveauDebloque } from '../progres.js';

// Valentine dans le coin du jeu (renvoie de quoi changer sa pose, voir js/valentine.js).
export function valentineDuJeu(scene, poseDeFond = 'content') {
  return placerValentine(scene.querySelector('.barre .coin-valentine'), poseDeFond);
}

// Colonne de droite : Valentine (dans son coin), puis les boutons réécouter et accueil.
export const BARRE = `
  <div class="barre">
    <div class="coin-valentine"></div>
    <div class="boutons">
      <button class="bouton-rond ecouter" aria-label="Réécouter la consigne">${OREILLE}</button>
      <button class="bouton-rond maison" aria-label="Les jeux">${MAISON}</button>
    </div>
  </div>`;

export function brancherBarre(scene, { ecouter, aller }) {
  scene.querySelector('.barre .ecouter').addEventListener('click', () => { douceur(); ecouter(); });
  scene.querySelector('.barre .maison').addEventListener('click', () => { douceur(); aller('jeux'); });
}

// Écran de fin : « niveau suivant » (s’il y en a un), « rejouer », « maison ».
export function afficherFin(fin, { dernier, suivant, rejouer, aller }) {
  fin.innerHTML = `
    ${dernier ? '' : `<button class="bouton-rond geant suivant" aria-label="Niveau suivant">${SUIVANT}</button>`}
    <button class="bouton-rond ${dernier ? 'geant' : ''} rejouer" aria-label="Rejouer">${REJOUER}</button>
    <button class="bouton-rond maison" aria-label="Accueil">${MAISON}</button>`;
  fin.querySelector('.suivant')?.addEventListener('click', () => { douceur(); suivant(); });
  fin.querySelector('.rejouer').addEventListener('click', () => { douceur(); rejouer(); });
  fin.querySelector('.maison').addEventListener('click', () => { douceur(); aller('jeux'); });
  fin.classList.remove('cache');
}

// Écran « à quel niveau tu joues ? » au lancement d’un jeu qui en a plusieurs : une pastille par
// niveau, dans l’ordre. Verrouillée (cadenas) tant que le niveau d’avant n’est pas fini ; le
// déblocage est gardé d’une fois sur l’autre (js/progres.js). S’il n’y a qu’un niveau, on saute
// l’écran. Appelle choisir(i) avec l’indice du niveau touché.
export function ecranNiveaux(scene, { jeu, total, choisir }) {
  if (total <= 1) { choisir(0); return null; }
  const debloque = niveauDebloque(jeu);
  const ecran = document.createElement('div');
  ecran.className = 'ecran-niveaux';
  ecran.innerHTML = Array.from({ length: total }, (_, i) => {
    const verrouille = i > debloque;
    const classe = verrouille ? 'verrouille' : i < debloque ? 'fait' : '';
    return `<button class="pastille-niveau ${classe}" style="--i:${i}" ${verrouille ? 'disabled' : ''} aria-label="Niveau ${i + 1}">${verrouille ? CADENAS : ''}</button>`;
  }).join('');
  scene.append(ecran);
  ecran.querySelectorAll('.pastille-niveau:not(.verrouille)').forEach((b, i) => {
    b.addEventListener('click', () => { douceur(); ecran.remove(); choisir(i); });
  });
  return ecran;
}

export function melanger(liste) {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }
  return liste;
}
