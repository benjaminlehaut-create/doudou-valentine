// Morceaux partagés par tous les jeux : boutons « oreille » et « maison », écran de fin, mélange.

import { douceur } from '../sons.js';
import { MAISON, OREILLE, REJOUER, SUIVANT } from '../icones.js';

// Colonne de droite : réécouter la consigne, revenir à l’accueil.
export const BARRE = `
  <div class="barre">
    <button class="bouton-rond ecouter" aria-label="Réécouter la consigne">${OREILLE}</button>
    <button class="bouton-rond maison" aria-label="Accueil">${MAISON}</button>
  </div>`;

export function brancherBarre(scene, { ecouter, aller }) {
  scene.querySelector('.barre .ecouter').addEventListener('click', () => { douceur(); ecouter(); });
  scene.querySelector('.barre .maison').addEventListener('click', () => { douceur(); aller('accueil'); });
}

// Écran de fin : « niveau suivant » (s’il y en a un), « rejouer », « maison ».
export function afficherFin(fin, { dernier, suivant, rejouer, aller }) {
  fin.innerHTML = `
    ${dernier ? '' : `<button class="bouton-rond geant suivant" aria-label="Niveau suivant">${SUIVANT}</button>`}
    <button class="bouton-rond ${dernier ? 'geant' : ''} rejouer" aria-label="Rejouer">${REJOUER}</button>
    <button class="bouton-rond maison" aria-label="Accueil">${MAISON}</button>`;
  fin.querySelector('.suivant')?.addEventListener('click', () => { douceur(); suivant(); });
  fin.querySelector('.rejouer').addEventListener('click', () => { douceur(); rejouer(); });
  fin.querySelector('.maison').addEventListener('click', () => { douceur(); aller('accueil'); });
  fin.classList.remove('cache');
}

export function melanger(liste) {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }
  return liste;
}
