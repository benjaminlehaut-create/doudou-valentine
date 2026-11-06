// Valentine, la guide qui accompagne ses doudous dans tous les jeux.
// Ses poses sont décrites dans data/valentine.json. Si ses images ne sont pas là
// (par exemple sur la version en ligne, où elles ne sont pas publiées), elle n’apparaît simplement pas.

import { imageDoudou } from './doudous.js';

let donnees = null;
const dispo = {};
let portrait = null;

function imageExiste(url) {
  return new Promise((ok) => {
    if (!url) return ok(false);
    const img = new Image();
    img.onload = () => ok(true);
    img.onerror = () => ok(false);
    img.src = url;
  });
}

export async function chargerValentine() {
  try { donnees = await (await fetch('data/valentine.json')).json(); } catch { return; }
  await Promise.all(Object.entries(donnees.poses || {}).map(async ([pose, url]) => {
    if (await imageExiste(url)) dispo[pose] = url;
  }));
  if (await imageExiste(donnees.portrait)) portrait = donnees.portrait;
}

export function valentineLa() {
  return Boolean(dispo.content);
}

export function portraitValentine() {
  return portrait;
}

// Place Valentine dans « conteneur » et renvoie de quoi changer sa pose :
//   v.pose('joie')                                  change de pose
//   v.pose('surprise', { duree: 900 })               puis revient à la pose de fond
//   v.pose('calin', { doudou })                      la serre avec le doudou dans les bras
//   v.fond('loupe')                                  change la pose de fond (celle où l’on revient)
export function placerValentine(conteneur, poseDeFond = 'content') {
  const rien = { pose() {}, fond() {} };
  if (!valentineLa() || !conteneur) { conteneur?.classList.add('cache'); return rien; }

  conteneur.classList.add('valentine');
  conteneur.innerHTML = '<div class="souffle"></div>';
  const souffle = conteneur.querySelector('.souffle');
  let fond = poseDeFond;
  let actuelle = null;
  let retour = null;

  function afficher(nom, doudou) {
    const cle = nom + (doudou ? ':' + doudou.id : '');
    if (cle === actuelle) return;
    actuelle = cle;

    const calque = document.createElement('div');
    calque.className = 'pose-v';
    const img = new Image();
    img.src = dispo[nom] || dispo.content;
    img.alt = '';
    img.draggable = false;
    calque.append(img);
    if (nom === 'calin' && doudou) {
      const c = donnees.calin || { x: 50, y: 46, taille: 42 };
      const bras = imageDoudou(doudou);
      bras.classList.add('dans-les-bras');
      bras.style.setProperty('--x', c.x + '%');
      bras.style.setProperty('--y', c.y + '%');
      bras.style.setProperty('--t', c.taille + '%');
      calque.append(bras);
    }

    // Fondu enchaîné (200 ms) et petit rebond
    const anciens = [...souffle.children];
    souffle.append(calque);
    void calque.offsetWidth;
    calque.classList.add('visible');
    anciens.forEach((a) => { a.classList.remove('visible'); setTimeout(() => a.remove(), 260); });
    conteneur.classList.remove('rebond'); void conteneur.offsetWidth; conteneur.classList.add('rebond');
  }

  function pose(nom, { duree, doudou } = {}) {
    clearTimeout(retour);
    afficher(nom, doudou);
    if (duree) retour = setTimeout(() => afficher(fond), duree);
  }

  afficher(fond);
  return {
    pose,
    fond(nom) { fond = nom; pose(nom); },
  };
}
