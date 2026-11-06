// Écran d’accueil : les portes des jeux et la ronde des doudous.

import { doudousActifs, imageDoudou } from './doudous.js';
import { dire } from './voix.js';
import { douceur } from './sons.js';
import { gerbeSur } from './recompense.js';
import { OBJETS } from './jeux/cache-cache.js';

// Les jeux disponibles. Ajouter ici les prochains (cache-cache, pique-nique…).
const JEUX = [
  { id: 'memory', nom: 'Memory', illustration: illustrationMemory },
  { id: 'cache-cache', nom: 'Cache-cache', illustration: illustrationCache },
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
  const amis = doudous.slice(0, 8).map((d, i) => {
    const ami = document.createElement('button');
    ami.className = 'ami';
    ami.style.setProperty('--i', i);
    ami.setAttribute('aria-label', d.nom);
    ami.append(imageDoudou(d));
    const vivant = { ami, doudou: d, minuterie: null, occupe: false };
    ami.addEventListener('click', () => {
      jouerScene(vivant, 'coucou');
      douceur();
      gerbeSur(ami, 8);
      dire('coucou-ami', { nom: d.nom, id: d.id });
    });
    ronde.append(ami);
    return vivant;
  });
  ronde.style.setProperty('--n', amis.length);

  // Petites scènes de vie : de temps en temps, un doudou au hasard bouge tout seul.
  const vie = setInterval(() => {
    const libres = amis.filter((a) => !a.occupe);
    if (!libres.length) return;
    const choix = libres[Math.floor(Math.random() * libres.length)];
    jouerScene(choix, SCENES[Math.floor(Math.random() * SCENES.length)]);
  }, 2600);

  dire('accueil');

  return () => {
    clearInterval(vie);
    amis.forEach((a) => clearTimeout(a.minuterie));
  };
}

// Chaque scène : une pose du doudou, une animation CSS (classe), une durée.
const SCENES_DEFINIES = {
  coucou: { pose: 'coucou', duree: 1800 },
  saute: { pose: 'joie', duree: 1200 },
  tourbillon: { pose: 'joie', duree: 1300 },
  dodo: { pose: 'dodo', duree: 3600 },
};
const SCENES = ['saute', 'coucou', 'dodo', 'tourbillon', 'saute'];

function jouerScene(vivant, nom) {
  const { ami, doudou } = vivant;
  const scene = SCENES_DEFINIES[nom];
  clearTimeout(vivant.minuterie);
  vivant.occupe = true;
  ami.className = 'ami';
  ami.replaceChildren(imageDoudou(doudou, scene.pose));
  if (nom === 'dodo') ami.insertAdjacentHTML('beforeend', '<span class="zzz-mini"><span>z</span><span>z</span><span>z</span></span>');
  void ami.offsetWidth; // relance l’animation même si c’est la même
  ami.classList.add('scene-' + nom);
  vivant.minuterie = setTimeout(() => {
    ami.className = 'ami';
    ami.replaceChildren(imageDoudou(doudou));
    vivant.occupe = false;
  }, scene.duree);
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

// Un doudou qui pointe les oreilles derrière un coussin
function illustrationCache(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-cache';
  const cachee = document.createElement('div');
  cachee.className = 'cachee';
  cachee.append(imageDoudou(doudous[1] || doudous[0]));
  const objet = document.createElement('div');
  objet.className = 'objet';
  objet.innerHTML = OBJETS.coussin;
  boite.append(cachee, objet);
  return boite;
}
