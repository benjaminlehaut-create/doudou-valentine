// Jeu 7 : Réveille-doudous — un jeu de réflexes.
// Les doudous apparaissent l'un après l'autre sur leur petit lit, les yeux de plus en plus lourds.
// Il faut les toucher avant qu'ils s'endorment pour gagner un point. Pas de pénalité si on arrive
// trop tard : le doudou s'endort juste tout doucement, sans bruit triste, et un autre apparaît.
// La nuit tombe peu à peu sur le décor pendant la manche (jamais de chronomètre affiché) ; à la fin,
// tous les doudous réveillés sont alignés, et on fête un nouveau record s'il y en a un (jamais de
// commentaire si ce n'est pas le cas : juste « bravo », comme toujours).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { carillon, douceur, fanfare } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, valentineDuJeu } from './commun.js';

const DUREE_RONDE = 42000;   // la manche entière (jamais montré comme un chiffre : la nuit tombe à la place)
const AVANT_ENDORMI = 2700;  // le temps qu'a le doudou avant de s'endormir pour de bon
const NB_PLACES = 6;

const CLE_RECORD = 'doudous-record-reveille';
const lireRecord = () => { try { return Number(localStorage.getItem(CLE_RECORD)) || 0; } catch { return 0; } };
const ecrireRecord = (n) => { try { localStorage.setItem(CLE_RECORD, String(n)); } catch { /* stockage indisponible */ } };

export function ouvrirReveille(scene, { aller }) {
  scene.classList.add('ecran-reveille');
  scene.innerHTML = `
    <div class="nuit-reveille">
      <div class="ciel-reveille"></div>
      <div class="trophees"></div>
      <div class="places"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const nuit = scene.querySelector('.nuit-reveille');
  const trophees = scene.querySelector('.trophees');
  const places = scene.querySelector('.places');
  const fin = scene.querySelector('.fin');

  let actif = true;    // l’écran existe encore
  let enCours = false; // une manche se joue en ce moment
  let minuteries = [];
  let score = 0;
  let placesLibres = [];
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  brancherBarre(scene, { ecouter: () => dire('reveille-consigne'), aller });
  const valentine = valentineDuJeu(scene, 'content');

  places.replaceChildren(...Array.from({ length: NB_PLACES }, (_, i) => {
    const p = document.createElement('div');
    p.className = 'place-nuit';
    p.style.setProperty('--i', i);
    return p;
  }));

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    nuit.classList.remove('couchee', 'en-cours');
    valentine.fond('content');
    score = 0;
    trophees.replaceChildren();
    places.querySelectorAll('.doudou-nuit').forEach((b) => b.remove());
    placesLibres = [...places.children];
    enCours = true;
    dire('reveille-consigne');
    nuit.style.setProperty('--duree', DUREE_RONDE + 'ms');
    void nuit.offsetWidth;
    nuit.classList.add('en-cours');
    plusTard(planifierApparition, 1800);
    plusTard(finManche, DUREE_RONDE);
  }

  // Un nouveau doudou apparaît de temps en temps, tant que la manche n’est pas finie.
  function planifierApparition() {
    if (!actif || !enCours) return;
    apparaitre();
    plusTard(planifierApparition, 1000 + Math.random() * 1200);
  }

  function apparaitre() {
    if (!placesLibres.length) return;
    const doudous = doudousActifs();
    if (!doudous.length) return;
    const doudou = doudous[Math.floor(Math.random() * doudous.length)];
    const i = Math.floor(Math.random() * placesLibres.length);
    const place = placesLibres.splice(i, 1)[0];

    const bouton = document.createElement('button');
    bouton.className = 'doudou-nuit apparait';
    bouton.setAttribute('aria-label', doudou.nom);
    bouton.style.setProperty('--duree', AVANT_ENDORMI + 'ms');
    bouton.append(imageDoudou(doudou));
    bouton.insertAdjacentHTML('beforeend', '<span class="zzz-leger"><span>z</span><span>z</span><span>z</span></span>');

    let fini = false;
    bouton.addEventListener('click', () => {
      if (fini || !enCours) return;
      fini = true;
      attraper(doudou, bouton, place);
    });
    place.append(bouton);

    plusTard(() => {
      if (fini) return;
      fini = true;
      bouton.classList.add('endormi');
      bouton.replaceChildren(imageDoudou(doudou, 'dodo'));
      plusTard(() => { bouton.remove(); if (enCours) placesLibres.push(place); }, 1400);
    }, AVANT_ENDORMI);
  }

  // Touché à temps : un point, et le doudou se réveille tout content.
  function attraper(doudou, bouton, place) {
    score++;
    douceur();
    carillon();
    gerbeSur(bouton, 8);
    bouton.classList.remove('apparait');
    bouton.classList.add('reveille');
    bouton.replaceChildren(imageDoudou(doudou, 'joie'));
    valentine.pose('joie', { duree: 900 });
    dire('reveille-attrape', { nom: doudou.nom, id: doudou.id });

    const vignette = document.createElement('div');
    vignette.className = 'trophee';
    vignette.style.setProperty('--i', trophees.children.length);
    vignette.append(imageDoudou(doudou, 'joie'));
    trophees.append(vignette);

    plusTard(() => { bouton.remove(); if (enCours) placesLibres.push(place); }, 700);
  }

  // La nuit est tombée : fin de la manche.
  function finManche() {
    enCours = false;
    nuit.classList.remove('en-cours');
    nuit.classList.add('couchee');
    places.querySelectorAll('.doudou-nuit').forEach((b) => b.remove());
    valentine.fond('joie');
    confettis();
    fanfare();
    const record = lireRecord();
    const bat = score > record && score > 0;
    if (bat) ecrireRecord(score);
    dire('reveille-fin').then(() => { if (actif && bat) dire('reveille-record'); });
    plusTard(() => afficherFin(fin, { dernier: true, rejouer: nouvellePartie, aller }), 2600);
  }

  nouvellePartie();

  return () => {
    actif = false;
    enCours = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
