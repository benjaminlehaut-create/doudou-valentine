// Jeu 7 : Réveille-doudous — un jeu de réflexes.
// Les doudous apparaissent l'un après l'autre sur leur petit lit, les yeux de plus en plus lourds,
// puis s'endorment pour de bon (ça brille doucement : c'est le signal). C'est SEULEMENT à ce moment-là
// qu'il faut les toucher, dans une petite fenêtre, pour gagner un point et les réveiller tout contents.
// Toucher trop tôt (avant qu'ils dorment) ne fait rien. Pas de pénalité si on arrive trop tard : le
// doudou s'en va tout doucement, sans bruit triste, et un autre apparaît.
// La nuit tombe peu à peu sur le décor pendant la manche, en plus d'un petit chronomètre (20 s) et
// du nombre de doudous réveillés, affichés en chiffres (demandé par le parent, 9 novembre 2026).
// À la fin, tous les doudous réveillés sont alignés, et on fête un nouveau record s'il y en a un
// (jamais de commentaire si ce n'est pas le cas : juste « bravo », comme toujours).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { carillon, douceur, fanfare } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, valentineDuJeu } from './commun.js';

const DUREE_RONDE = 20000;   // la manche entière
const AVANT_ENDORMI = 2400;  // le temps qu'a le doudou avant de s'endormir (pas encore touchable)
const FENETRE_REVEIL = 2200; // une fois endormi, le temps qu'on a pour le toucher et le réveiller
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
      <div class="score-reveille">0</div>
      <div class="chrono-reveille">20</div>
      <div class="places"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const nuit = scene.querySelector('.nuit-reveille');
  const trophees = scene.querySelector('.trophees');
  const scoreAffichage = scene.querySelector('.score-reveille');
  const chronoAffichage = scene.querySelector('.chrono-reveille');
  const places = scene.querySelector('.places');
  const fin = scene.querySelector('.fin');

  let actif = true;    // l’écran existe encore
  let enCours = false; // une manche se joue en ce moment
  let minuteries = [];
  let score = 0;
  let placesLibres = [];
  let intervalleChrono = null;
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
    clearInterval(intervalleChrono);
    fin.classList.add('cache');
    nuit.classList.remove('couchee', 'en-cours');
    valentine.fond('content');
    score = 0;
    scoreAffichage.textContent = '0';
    trophees.replaceChildren();
    places.querySelectorAll('.doudou-nuit').forEach((b) => b.remove());
    placesLibres = [...places.children];
    enCours = true;
    dire('reveille-consigne');
    nuit.style.setProperty('--duree', DUREE_RONDE + 'ms');
    void nuit.offsetWidth;
    nuit.classList.add('en-cours');

    let secondesRestantes = Math.round(DUREE_RONDE / 1000);
    chronoAffichage.textContent = secondesRestantes;
    intervalleChrono = setInterval(() => {
      secondesRestantes = Math.max(0, secondesRestantes - 1);
      chronoAffichage.textContent = secondesRestantes;
      chronoAffichage.classList.remove('tic'); void chronoAffichage.offsetWidth; chronoAffichage.classList.add('tic');
      if (secondesRestantes <= 0) clearInterval(intervalleChrono);
    }, 1000);

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

    let endormi = false; // tant qu’il n’est pas endormi, le toucher ne fait rien
    let fini = false;
    bouton.addEventListener('click', () => {
      if (fini || !enCours || !endormi) return;
      fini = true;
      attraper(doudou, bouton, place);
    });
    place.append(bouton);

    // Il s’endort pour de bon : c’est maintenant qu’il faut le toucher.
    plusTard(() => {
      if (fini) return;
      endormi = true;
      bouton.classList.remove('apparait');
      bouton.classList.add('endormi');
      bouton.replaceChildren(imageDoudou(doudou, 'dodo'));
      bouton.style.setProperty('--duree', FENETRE_REVEIL + 'ms');
      // Pas touché à temps : il s’en va tout doucement, sans bruit triste.
      plusTard(() => {
        if (fini) return;
        fini = true;
        bouton.classList.add('reparti');
        plusTard(() => { bouton.remove(); if (enCours) placesLibres.push(place); }, 500);
      }, FENETRE_REVEIL);
    }, AVANT_ENDORMI);
  }

  // Touché pendant son sommeil : un point, et le doudou se réveille tout content.
  function attraper(doudou, bouton, place) {
    score++;
    scoreAffichage.textContent = String(score);
    douceur();
    carillon();
    gerbeSur(bouton, 8);
    bouton.classList.remove('endormi');
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
    clearInterval(intervalleChrono);
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
    clearInterval(intervalleChrono);
    taire();
  };
}
