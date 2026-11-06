// Jeu 5 : le docteur des doudous.
// Un doudou arrive avec un problème qu’on VOIT : un bobo à la patte, de la fièvre (vagues de chaleur),
// un rhume (il éternue), ou de la peur (un petit nuage de pluie au-dessus de lui).
// On choisit le bon outil parmi six : pansement, thermomètre, sirop, mouchoir, stéthoscope, câlin magique.
// Il faut réfléchir : pour la fièvre, on mesure D’ABORD avec le thermomètre, PUIS on donne le sirop.
// Le stéthoscope sert d’indice : on entend le cœur, puis la voix redit le problème.
// Mauvais outil : explication douce, rien de perdu. Guéri : le doudou saute de joie et Valentine lui fait un câlin.
// Niveau 1 : un problème par doudou. Niveau 2 : deux problèmes par doudou.
// Valentine est en blouse de docteur pendant les soins.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, douceur, battement, atchoum } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger, valentineDuJeu } from './commun.js';

const NIVEAUX = [
  { patients: 3, problemes: 1 },
  { patients: 3, problemes: 2 },
];

// Les outils du docteur (dessins 100 × 100) et ce que dit la voix.
export const OUTILS = {
  pansement: { le: 'le pansement', svg: `<svg viewBox="0 0 100 100"><g transform="rotate(-35 50 50)"><rect x="8" y="34" width="84" height="32" rx="16" fill="#f6c99b" stroke="#e3a873" stroke-width="3"/><rect x="34" y="38" width="32" height="24" rx="6" fill="#fde7d0"/>
    ${[[40, 44], [50, 44], [60, 44], [40, 56], [50, 56], [60, 56], [18, 50], [82, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#e3a873"/>`).join('')}</g><path d="M48 46 l4 0 M50 44 l0 4" stroke="#ff8fab" stroke-width="3" stroke-linecap="round"/></svg>` },
  thermometre: { le: 'le thermomètre', svg: `<svg viewBox="0 0 100 100"><g transform="rotate(35 50 50)"><rect x="42" y="6" width="16" height="66" rx="8" fill="#fff" stroke="#9ccff2" stroke-width="3"/><rect x="47" y="30" width="6" height="46" rx="3" fill="#ff6b7d"/><circle cx="50" cy="80" r="13" fill="#ff6b7d" stroke="#fff" stroke-width="3"/>
    <path d="M58 18 h6 M58 28 h4 M58 38 h6 M58 48 h4 M58 58 h6" stroke="#9ccff2" stroke-width="2.5" stroke-linecap="round"/></g></svg>` },
  sirop: { le: 'le sirop', svg: `<svg viewBox="0 0 100 100"><rect x="30" y="6" width="22" height="12" rx="3" fill="#ffffff" stroke="#c9b5f2" stroke-width="3"/><path d="M26 24 Q26 18 34 18 H48 Q56 18 56 24 V84 Q56 92 48 92 H34 Q26 92 26 84 Z" fill="#c78fe0"/>
    <rect x="30" y="44" width="22" height="22" rx="4" fill="#fff"/><path d="M41 49 v12 M35 55 h12" stroke="#ff6b7d" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="78" cy="70" rx="12" ry="8" fill="#e8e8f0" stroke="#b9b9cc" stroke-width="2.5"/><ellipse cx="78" cy="70" rx="7" ry="4" fill="#c78fe0"/><path d="M68 74 L56 94" stroke="#b9b9cc" stroke-width="5" stroke-linecap="round"/></svg>` },
  mouchoir: { le: 'le mouchoir', svg: `<svg viewBox="0 0 100 100"><path d="M36 40 Q30 14 50 10 Q70 14 64 40 Z" fill="#fff" stroke="#cfe3f2" stroke-width="3"/><rect x="14" y="38" width="72" height="50" rx="10" fill="#9ccff2"/><rect x="34" y="34" width="32" height="10" rx="5" fill="#7fb6e0"/>
    <path d="M24 70 q6 -8 12 0 t12 0 t12 0 t12 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></svg>` },
  stethoscope: { le: 'le stéthoscope', svg: `<svg viewBox="0 0 100 100"><path d="M24 8 V34 Q24 54 44 54 Q64 54 64 34 V8" fill="none" stroke="#5e6b8a" stroke-width="6" stroke-linecap="round"/><circle cx="24" cy="8" r="5" fill="#5e6b8a"/><circle cx="64" cy="8" r="5" fill="#5e6b8a"/>
    <path d="M44 54 V70 Q44 84 60 84 Q72 84 72 74" fill="none" stroke="#5e6b8a" stroke-width="6" stroke-linecap="round"/><circle cx="74" cy="66" r="13" fill="#c9d3e8" stroke="#5e6b8a" stroke-width="5"/><circle cx="74" cy="66" r="5" fill="#fff"/></svg>` },
  calin: { le: 'le câlin', svg: `<svg viewBox="0 0 100 100"><path d="M50 88 C22 70 6 52 8 34 C10 18 30 10 42 20 Q48 25 50 30 Q52 25 58 20 C70 10 90 18 92 34 C94 52 78 70 50 88 Z" fill="#ff8fab"/>
    <path d="M70 6 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#ffd36b"/><ellipse cx="30" cy="34" rx="8" ry="11" fill="#fff" opacity=".45" transform="rotate(-25 30 34)"/></svg>` },
};

// Les problèmes, les outils qui les soignent (dans l’ordre) et l’indice.
const PROBLEMES = {
  bobo: { soins: ['pansement'] },
  fievre: { soins: ['thermometre', 'sirop'] },
  rhume: { soins: ['mouchoir'] },
  peur: { soins: ['calin'] },
};

const NUAGE = `<svg viewBox="0 0 120 80"><path d="M24 54 Q6 54 8 38 Q10 24 26 26 Q30 8 52 10 Q72 8 78 24 Q98 20 104 36 Q110 54 92 56 Z" fill="#a9b3c9"/><path d="M34 62 l-4 10 M58 62 l-4 10 M82 62 l-4 10" stroke="#7fb6e0" stroke-width="4" stroke-linecap="round"/></svg>`;

export function ouvrirDocteur(scene, { aller }) {
  scene.classList.add('ecran-docteur');
  scene.innerHTML = `
    <div class="cabinet">
      <div class="progres"></div>
      <div class="patient"><div class="table-soin"></div><div class="malade"></div><div class="maux"></div></div>
      <div class="outils"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const progres = scene.querySelector('.progres');
  const malade = scene.querySelector('.malade');
  const maux = scene.querySelector('.maux');
  const outils = scene.querySelector('.outils');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let actif = true;
  let minuteries = [];
  let soin = null; // { doudou, rang, patients, aSoigner: [ {probleme, etape} ], occupe }
  let eternue = null;
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const decrire = () => {
    if (!soin) return dire('docteur-consigne');
    const reste = soin.aSoigner.find((p) => !p.gueri);
    if (reste) dire('docteur-' + reste.probleme, { nom: soin.doudou.nom, id: soin.doudou.id });
  };
  brancherBarre(scene, { ecouter: decrire, aller });
  const valentine = valentineDuJeu(scene, 'docteur');

  // La boîte à outils (toujours les six, toujours à la même place)
  outils.replaceChildren(...Object.entries(OUTILS).map(([id, o], i) => {
    const b = document.createElement('button');
    b.className = 'outil';
    b.dataset.id = id;
    b.style.setProperty('--i', i);
    b.setAttribute('aria-label', o.le);
    b.innerHTML = o.svg;
    b.addEventListener('click', () => utiliser(id, b));
    return b;
  }));

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    clearInterval(eternue);
    fin.classList.add('cache');
    valentine.fond('docteur');
    const regle = NIVEAUX[niveau];
    const patients = melanger([...doudousActifs()]).slice(0, regle.patients);
    progres.replaceChildren(...patients.map((d) => {
      const p = document.createElement('div');
      p.className = 'pastille';
      p.append(imageDoudou(d));
      return p;
    }));
    soin = null;
    malade.replaceChildren();
    maux.replaceChildren();
    dire('docteur-consigne');
    plusTard(() => accueillir(patients, 0), 4500);
  }

  // Un patient arrive, avec ses problèmes bien visibles
  function accueillir(patients, rang) {
    if (rang >= patients.length) return partieGagnee();
    const regle = NIVEAUX[niveau];
    const doudou = patients[rang];
    progres.children[rang]?.classList.add('en-cours');
    const problemes = melanger(Object.keys(PROBLEMES)).slice(0, regle.problemes);
    soin = { doudou, rang, patients, aSoigner: problemes.map((p) => ({ probleme: p, etape: 0, gueri: false })), occupe: false };

    malade.className = 'malade arrive';
    // La pose « bobo » (pansement sur la tête) seulement pour un bobo ; sinon, un doudou tout triste sans pansement
    malade.replaceChildren(imageDoudou(doudou, problemes.includes('bobo') ? 'bobo' : 'face'));
    malade.classList.toggle('patraque', !problemes.includes('bobo'));
    maux.replaceChildren(...problemes.map((p) => {
      const m = document.createElement('div');
      m.className = 'mal mal-' + p;
      if (p === 'bobo') m.innerHTML = '<span class="plaie"></span>';
      if (p === 'fievre') m.innerHTML = '<span></span><span></span><span></span>';
      if (p === 'rhume') m.innerHTML = '<span class="goutte"></span>';
      if (p === 'peur') m.innerHTML = NUAGE;
      return m;
    }));
    // Le rhume : il éternue de temps en temps
    clearInterval(eternue);
    if (problemes.includes('rhume')) {
      eternue = setInterval(() => {
        if (!soin || soin.aSoigner.find((p) => p.probleme === 'rhume')?.gueri) return;
        atchoum();
        malade.classList.remove('eternue'); void malade.offsetWidth; malade.classList.add('eternue');
      }, 4200);
    }
    plusTard(decrire, 900);
  }

  function utiliser(id, bouton) {
    if (!soin || soin.occupe) return;
    bouton.classList.remove('utilise'); void bouton.offsetWidth; bouton.classList.add('utilise');
    const vars = { nom: soin.doudou.nom, id: soin.doudou.id, outil: OUTILS[id].le };

    // Le stéthoscope : boum boum, puis l’indice
    if (id === 'stethoscope') {
      soin.occupe = true;
      montrerOutil(id);
      battement();
      dire('docteur-ecoute').then(() => { if (actif && soin) decrire(); });
      plusTard(() => { if (soin) soin.occupe = false; }, 2200);
      return;
    }

    const reste = soin.aSoigner.filter((p) => !p.gueri);
    const cible = reste.find((p) => PROBLEMES[p.probleme].soins[p.etape] === id);
    if (!cible) {
      pop();
      bouton.classList.add('non');
      plusTard(() => bouton.classList.remove('non'), 600);
      // Sirop sans avoir mesuré la fièvre : on explique l’ordre
      const fievre = reste.find((p) => p.probleme === 'fievre' && p.etape === 0);
      if (id === 'sirop' && fievre) dire('docteur-dabord', vars);
      else dire('docteur-pas-ca', vars);
      return;
    }

    // Bon outil !
    soin.occupe = true;
    douceur();
    montrerOutil(id);
    cible.etape++;
    const fini = cible.etape >= PROBLEMES[cible.probleme].soins.length;
    dire('docteur-soin-' + id, vars);
    plusTard(() => {
      carillon();
      gerbeSur(malade, 8);
      if (fini) {
        cible.gueri = true;
        guerirMal(cible.probleme);
      } else {
        maux.querySelector('.mal-fievre')?.classList.add('mesuree');
      }
      if (soin.aSoigner.every((p) => p.gueri)) plusTard(gueri, 900);
      else plusTard(() => { soin.occupe = false; decrire(); }, 1600);
    }, 1700);
  }

  // L’outil apparaît en grand sur le doudou et fait son geste
  function montrerOutil(id) {
    const o = document.createElement('div');
    o.className = 'outil-en-action geste-' + id;
    o.innerHTML = OUTILS[id].svg;
    maux.append(o);
    plusTard(() => o.remove(), 1700);
  }

  function guerirMal(probleme) {
    const m = maux.querySelector('.mal-' + probleme);
    if (!m) return;
    m.classList.add('soigne');
    if (probleme === 'bobo') m.innerHTML = `<span class="pose-pansement">${OUTILS.pansement.svg}</span>`;
    else plusTard(() => m.remove(), 900);
  }

  // Guéri : il saute de joie, câlin de Valentine, puis au suivant
  function gueri() {
    const { doudou, rang, patients } = soin;
    clearInterval(eternue);
    malade.replaceChildren(imageDoudou(doudou, 'joie'));
    malade.className = 'malade content';
    progres.children[rang]?.classList.replace('en-cours', 'repu');
    fanfare();
    gerbeSur(malade, 14);
    valentine.pose('calin', { doudou, duree: 3200 });
    dire('docteur-gueri', { nom: doudou.nom, id: doudou.id });
    plusTard(() => { malade.className = 'malade repart'; }, 3600);
    plusTard(() => { maux.replaceChildren(); accueillir(patients, rang + 1); }, 4300);
  }

  function partieGagnee() {
    soin = null;
    valentine.fond('joie');
    malade.className = 'malade';
    malade.replaceChildren();
    confettis();
    fanfare();
    dire('docteur-gagne').then(() => { if (actif && !soin) dire('docteur-encore'); });
    plusTard(() => afficherFin(fin, {
      dernier: niveau >= NIVEAUX.length - 1,
      suivant: () => { niveau++; nouvellePartie(); },
      rejouer: nouvellePartie,
      aller,
    }), 2400);
  }

  nouvellePartie();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    clearInterval(eternue);
    taire();
  };
}
