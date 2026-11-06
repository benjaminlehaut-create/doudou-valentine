// Écran d’accueil : les portes des jeux et la ronde des doudous.

import { doudousActifs, imageDoudou } from './doudous.js';
import { dire } from './voix.js';
import { douceur } from './sons.js';
import { gerbeSur } from './recompense.js';

// Les jeux disponibles. Ajouter ici les prochains (cache-cache, pique-nique…).
const JEUX = [
  { id: 'memory', nom: 'Memory', illustration: illustrationMemory },
];

export function ouvrirAccueil(scene, { aller }) {
  scene.classList.add('ecran-accueil');
  scene.innerHTML = `
    <div class="portes"></div>
    <div class="ronde"></div>`;

  const doudous = doudousActifs();

  // Portes
  const portes = scene.querySelector('.portes');
  JEUX.forEach((jeu) => {
    const porte = document.createElement('button');
    porte.className = 'porte';
    porte.setAttribute('aria-label', jeu.nom);
    porte.append(jeu.illustration(doudous));
    porte.addEventListener('click', () => { douceur(); aller(jeu.id); });
    portes.append(porte);
  });

  // Ronde des doudous : un toucher, et le doudou fait coucou.
  const ronde = scene.querySelector('.ronde');
  doudous.slice(0, 7).forEach((d, i) => {
    const ami = document.createElement('button');
    ami.className = 'ami';
    ami.style.setProperty('--i', i);
    ami.setAttribute('aria-label', d.nom);
    ami.append(imageDoudou(d));
    let enCours = null;
    ami.addEventListener('click', () => {
      clearTimeout(enCours);
      ami.replaceChildren(imageDoudou(d, 'coucou'));
      ami.classList.remove('coucou'); void ami.offsetWidth; ami.classList.add('coucou');
      douceur();
      gerbeSur(ami, 8);
      dire('coucou-ami', { nom: d.nom, id: d.id });
      enCours = setTimeout(() => { ami.classList.remove('coucou'); ami.replaceChildren(imageDoudou(d)); }, 1800);
    });
    ronde.append(ami);
  });

  dire('accueil');
}

// Trois petites cartes en éventail
function illustrationMemory(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-memory';
  [0, 1, 2].forEach((i) => {
    const carte = document.createElement('div');
    carte.className = 'mini-carte';
    if (i === 1) carte.classList.add('mini-dos');
    else carte.append(imageDoudou(doudous[0]));
    boite.append(carte);
  });
  return boite;
}
