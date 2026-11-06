// Les doudous : chargement de data/doudous.json, images par pose,
// et dessin provisoire en SVG quand une image n’existe pas encore.

import { reglages } from './reglages.js';

let tous = [];

// Les poses rangées dans le dossier de chaque doudou (face.png, coucou.png…)
export const POSES = ['face', 'coucou', 'dodo', 'bobo', 'mange', 'joie'];

export async function chargerDoudous() {
  const donnees = await (await fetch('data/doudous.json')).json();
  tous = (donnees.doudous || []).filter((d) => d && d.id && d.nom);
  tous.forEach((d) => {
    if (d.dossier && !d.images) d.images = Object.fromEntries(POSES.map((p) => [p, `${d.dossier}/${p}.png`]));
  });
  await Promise.all(tous.map(verifierImages));
  return tous;
}

export function tousLesDoudous() {
  return tous;
}

// Les doudous cochés dans le menu parent (au moins deux, sinon tous).
export function doudousActifs() {
  const choisis = reglages.actifs ? tous.filter((d) => reglages.actifs.includes(d.id)) : tous;
  return choisis.length >= 2 ? choisis : tous;
}

// Renvoie un élément prêt à afficher : la vraie image si elle existe, sinon le dessin.
export function imageDoudou(doudou, pose = 'face') {
  const boite = document.createElement('div');
  boite.className = 'doudou pose-' + pose;
  const url = doudou.dispo[pose] || doudou.dispo.face;
  if (url) {
    const img = new Image();
    img.src = url;
    img.alt = '';
    img.draggable = false;
    boite.append(img);
  } else {
    boite.innerHTML = dessinProvisoire(doudou, pose);
  }
  return boite;
}

// --- Vérifie quelles images existent vraiment ---

function imageExiste(url) {
  return new Promise((reponse) => {
    if (!url) return reponse(false);
    const img = new Image();
    img.onload = () => reponse(true);
    img.onerror = () => reponse(false);
    img.src = url;
  });
}

async function verifierImages(doudou) {
  doudou.dispo = {};
  await Promise.all(Object.entries(doudou.images || {}).map(async ([pose, url]) => {
    if (await imageExiste(url)) doudou.dispo[pose] = url;
  }));
}

// --- Dessin provisoire (ours, lapin, chat, souris, panda) ---

function nuance(hex, f) { // f > 0 éclaircit, f < 0 assombrit
  const n = parseInt((hex || '#b98058').slice(1), 16);
  const canal = (v) => Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f));
  return `rgb(${canal(n >> 16)},${canal((n >> 8) & 255)},${canal(n & 255)})`;
}

let numero = 0;

function dessinProvisoire(d, pose) {
  const id = 'dd' + (numero++);
  const c = d.couleur || '#b98058';
  const forme = d.forme || 'ours';
  const clair = nuance(c, 0.5);
  const fonce = nuance(c, -0.3);
  const panda = forme === 'panda';
  const noir = '#3d3540';
  const rose = '#f7b6c6';
  const peau = `url(#${id})`;
  const dort = pose === 'dodo';
  const salue = pose === 'coucou';

  let oreille = '';
  if (forme === 'lapin') {
    oreille = `<ellipse cx="72" cy="36" rx="15" ry="40" transform="rotate(-12 72 36)" fill="${peau}"/>
               <ellipse cx="72" cy="40" rx="7" ry="28" transform="rotate(-12 72 40)" fill="${rose}"/>`;
  } else if (forme === 'chat') {
    oreille = `<path d="M46 74 L56 16 L94 46 Z" fill="${peau}" stroke="${fonce}" stroke-width="2" stroke-linejoin="round"/>
               <path d="M57 60 L61 32 L82 50 Z" fill="${rose}"/>`;
  } else if (forme === 'souris') {
    oreille = `<circle cx="46" cy="52" r="32" fill="${peau}"/><circle cx="46" cy="52" r="20" fill="${rose}"/>`;
  } else {
    oreille = `<circle cx="54" cy="46" r="24" fill="${panda ? noir : peau}"/>
               <circle cx="54" cy="46" r="12" fill="${panda ? '#5a5060' : clair}"/>`;
  }

  const yeux = dort
    ? `<path d="M68 92 q10 9 20 0 M112 92 q10 9 20 0" stroke="#3b2a28" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="78" cy="90" r="7.5" fill="#2e2226"/><circle cx="122" cy="90" r="7.5" fill="#2e2226"/>
       <circle cx="80.5" cy="87.5" r="2.6" fill="#fff"/><circle cx="124.5" cy="87.5" r="2.6" fill="#fff"/>`;

  const taches = panda
    ? `<ellipse cx="78" cy="92" rx="15" ry="19" transform="rotate(25 78 92)" fill="${noir}"/>
       <ellipse cx="122" cy="92" rx="15" ry="19" transform="rotate(-25 122 92)" fill="${noir}"/>`
    : '';
  const yeuxPanda = panda && !dort
    ? `<circle cx="78" cy="90" r="6" fill="#fff"/><circle cx="122" cy="90" r="6" fill="#fff"/>
       <circle cx="78" cy="90" r="3.8" fill="#2e2226"/><circle cx="122" cy="90" r="3.8" fill="#2e2226"/>`
    : yeux;

  const museau = (forme === 'chat' || forme === 'souris')
    ? `<ellipse cx="100" cy="114" rx="17" ry="12" fill="${clair}"/>`
    : `<ellipse cx="100" cy="114" rx="23" ry="17" fill="${panda ? '#fff' : clair}"/>`;

  const moustaches = (forme === 'chat' || forme === 'souris')
    ? `<path d="M70 112 h-22 M70 119 l-20 5 M130 112 h22 M130 119 l20 5" stroke="${fonce}" stroke-width="2" stroke-linecap="round"/>`
    : '';

  const brasDroit = salue
    ? `<g class="bras"><ellipse cx="160" cy="122" rx="15" ry="22" transform="rotate(25 160 122)" fill="${panda ? noir : peau}"/></g>`
    : `<ellipse cx="148" cy="170" rx="17" ry="14" fill="${panda ? noir : peau}"/>`;

  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stop-color="${clair}"/>
        <stop offset="0.55" stop-color="${c}"/>
        <stop offset="1" stop-color="${fonce}"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="194" rx="62" ry="6" fill="rgba(90,50,30,.18)"/>
    <g id="o${id}">${oreille}</g>
    <use href="#o${id}" transform="translate(200 0) scale(-1 1)"/>
    <ellipse cx="100" cy="164" rx="52" ry="32" fill="${peau}"/>
    <ellipse cx="100" cy="170" rx="30" ry="19" fill="${panda ? '#fff' : clair}"/>
    <ellipse cx="52" cy="170" rx="17" ry="14" fill="${panda ? noir : peau}"/>
    ${brasDroit}
    <circle cx="100" cy="95" r="58" fill="${peau}"/>
    ${taches}
    ${museau}
    ${moustaches}
    ${yeuxPanda}
    <ellipse cx="100" cy="107" rx="7.5" ry="5.5" fill="#4a3030"/>
    <path d="M92 118 q8 8 16 0" stroke="#4a3030" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="64" cy="112" r="9" fill="#ff9fb3" opacity=".55"/>
    <circle cx="136" cy="112" r="9" fill="#ff9fb3" opacity=".55"/>
  </svg>`;
}
