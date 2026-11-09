// Écran d’accueil : Valentine debout au centre, tous ses doudous en arc de cercle autour d’elle, les portes des jeux en dessous.

import { doudousActifs, imageDoudou } from './doudous.js';
import { dire } from './voix.js';
import { douceur } from './sons.js';
import { gerbeSur } from './recompense.js';
import { OBJETS } from './jeux/cache-cache.js';
import { ALIMENTS } from './jeux/aliments.js';
import { ETAPES } from './jeux/dodo.js';
import { OUTILS } from './jeux/docteur.js';
import { placerValentine, valentineLa, portraitValentine } from './valentine.js';

// Les jeux disponibles. Ajouter ici les prochains (cache-cache, pique-nique…).
const JEUX = [
  { id: 'memory', nom: 'Memory', illustration: illustrationMemory },
  { id: 'cache-cache', nom: 'Cache-cache', illustration: illustrationCache },
  { id: 'pique-nique', nom: 'Pique-nique', illustration: illustrationPique },
  { id: 'dodo', nom: 'L’heure du dodo', illustration: illustrationDodo },
  { id: 'docteur', nom: 'Le docteur', illustration: illustrationDocteur },
  { id: 'histoire', nom: 'L’histoire de Valentine', illustration: illustrationHistoire },
  { id: 'reveille', nom: 'Réveille-doudous', illustration: illustrationReveille },
  { id: 'peinture', nom: 'L’atelier peinture', illustration: illustrationPeinture },
];

export function ouvrirAccueil(scene, { aller }) {
  scene.classList.add('ecran-accueil');
  scene.innerHTML = `
    <div class="cercle">
      <div class="cote gauche"></div>
      <div class="milieu">
        <div class="dessus"></div>
        <button class="valentine-centre" aria-label="Valentine"><div class="valentine-ici"></div></button>
      </div>
      <div class="cote droite"></div>
    </div>
    <div class="portes"></div>
    <div class="ciel-accueil" aria-hidden="true">
      <span class="nuage n1"></span><span class="nuage n2"></span><span class="nuage n3"></span>
      ${Array.from({ length: 12 }, (_, k) => `<span class="bulle-deco" style="--k:${k}"></span>`).join('')}
    </div>`;

  // Valentine au centre : coucou à l’arrivée, puis contente ; un toucher, elle saute de joie.
  const centre = scene.querySelector('.valentine-centre');
  const valentine = placerValentine(centre.querySelector('.valentine-ici'), 'content');
  if (valentineLa()) {
    valentine.pose('coucou', { duree: 2600 });
    centre.addEventListener('click', () => {
      valentine.pose('joie', { duree: 1800 });
      douceur();
      gerbeSur(centre, 12);
      dire('accueil');
    });
  } else {
    centre.remove();
  }

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

  // Les doudous autour d’elle : autant en « ( » à sa gauche qu’en « ) » à sa droite,
  // et, si leur nombre est impair, un au-dessus de sa tête (3 + 3 + 1 pour 7 doudous).
  // Chacun a sa propre place : ils ne peuvent jamais passer devant elle.
  // Un toucher, et le doudou fait coucou.
  const gauche = scene.querySelector('.cote.gauche');
  const droite = scene.querySelector('.cote.droite');
  const dessus = scene.querySelector('.dessus');
  const liste = doudous.slice(0, 11);
  const auDessus = liste.length % 2;                  // 1 doudou au-dessus si impair
  const moitie = (liste.length - auDessus) / 2;       // nombre de doudous de chaque côté
  scene.classList.toggle('avec-dessus', auDessus === 1);
  const amis = liste.map((d, i) => {
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
    if (auDessus && i === liste.length - 1) {
      dessus.append(ami);
      return vivant;
    }
    const aGauche = i < moitie;
    const rang = aGauche ? i : i - moitie;
    const t = moitie > 1 ? rang / (moitie - 1) : 0.5;      // 0 = en haut, 1 = en bas
    const ecart = 55 * Math.sin(Math.PI * (0.15 + 0.7 * t)); // plus loin d’elle au milieu : une parenthèse
    ami.style.left = (aGauche ? 80 - ecart : 20 + ecart) + '%';
    ami.style.top = 18 + 66 * t + '%';
    (aGauche ? gauche : droite).append(ami);
    return vivant;
  });
  scene.style.setProperty('--n', amis.length);

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

// Une nappe à carreaux et deux fruits
function illustrationPique() {
  const boite = document.createElement('div');
  boite.className = 'illu-pique';
  boite.innerHTML = `<div class="nappe"></div><div class="fruit">${ALIMENTS.pomme.svg}</div><div class="fruit">${ALIMENTS.banane.svg}</div>`;
  return boite;
}

// Une lune et un doudou endormi
function illustrationDodo(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-dodo';
  boite.innerHTML = `<div class="lune-illu">${ETAPES[5].svg}</div>`;
  const d = imageDoudou(doudous[2] || doudous[0], 'dodo');
  d.classList.add('dort');
  boite.append(d);
  return boite;
}

// Un doudou avec un pansement, et la croix du docteur
function illustrationDocteur(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-docteur';
  boite.append(imageDoudou(doudous[3] || doudous[0], 'bobo'));
  boite.insertAdjacentHTML('beforeend', `<div class="croix"></div><div class="mini-outil">${OUTILS.pansement.svg}</div>`);
  return boite;
}

// Un livre ouvert, avec le portrait de Valentine (ou un doudou)
function illustrationHistoire(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-histoire';
  boite.innerHTML = `<svg class="livre-illu" viewBox="0 0 100 70"><path d="M50 14 Q32 4 4 8 V62 Q32 58 50 68 Z" fill="#fff6ee" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/><path d="M50 14 Q68 4 96 8 V62 Q68 58 50 68 Z" fill="#fff" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const portrait = portraitValentine();
  if (portrait) boite.insertAdjacentHTML('beforeend', `<img class="portrait-illu" src="${portrait}" alt="" draggable="false">`);
  else boite.append(imageDoudou(doudous[4] || doudous[0], 'coucou'));
  boite.insertAdjacentHTML('beforeend', '<span class="etoile-illu">★</span><span class="etoile-illu">★</span>');
  return boite;
}

// Un doudou qui saute de joie, et un rond qui « touche » (bien différent de la porte du dodo)
function illustrationReveille(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-reveille';
  boite.append(imageDoudou(doudous[6] || doudous[0], 'joie'));
  boite.insertAdjacentHTML('beforeend', '<span class="toucher-illu"></span>');
  return boite;
}

// Trois petits pots de peinture colorés
function illustrationPeinture(doudous) {
  const boite = document.createElement('div');
  boite.className = 'illu-peinture';
  boite.innerHTML = `<span class="pot-illu" style="--teinte:#ef4d5a"></span><span class="pot-illu" style="--teinte:#ffd23a"></span><span class="pot-illu" style="--teinte:#4f78d8"></span>`;
  const d = imageDoudou(doudous[4] || doudous[0]);
  d.classList.add('peintre-illu');
  boite.append(d);
  return boite;
}
