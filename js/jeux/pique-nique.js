// Jeu 3 : le pique-nique des doudous.
// Un doudou a faim et le dit. On touche un aliment : il s’envole jusqu’à son assiette.
// Niveau 1, les couleurs : « Sacha voudrait un fruit jaune ». Trois aliments au choix.
// Niveau 2, les quantités : « Debby voudrait deux fraises ». La voix compte à chaque aliment donné.
// Jamais d’échec : un mauvais aliment fait un petit bond et la voix redit gentiment la demande ;
// au bout de quelques secondes, le bon aliment se dandine (indice).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, croque } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger } from './commun.js';
import { ALIMENTS, COULEURS, A_COMPTER, nombre, quantite } from './aliments.js';

const NIVEAUX = [
  { type: 'couleur', choix: 3, demandes: 3 },
  { type: 'compte', max: 3, demandes: 3 },
];
const INDICE_APRES = 7000; // ms avant que le bon aliment se dandine

export function ouvrirPiqueNique(scene, { aller }) {
  scene.classList.add('ecran-pique');
  scene.innerHTML = `
    <div class="pre">
      <div class="progres"></div>
      <div class="convive"></div>
      <div class="assiette"><div class="dans-assiette"></div></div>
      <div class="panier"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const pre = scene.querySelector('.pre');
  const progres = scene.querySelector('.progres');
  const convive = scene.querySelector('.convive');
  const dansAssiette = scene.querySelector('.dans-assiette');
  const panier = scene.querySelector('.panier');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let actif = true;
  let minuteries = [];
  let indice = null;
  let demande = null; // la demande en cours
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const redire = () => {
    if (!demande) return;
    if (demande.type === 'couleur') dire('pique-couleur', { nom: demande.doudou.nom, couleur: demande.aliment.couleur });
    else dire('pique-compte', { nom: demande.doudou.nom, quantite: quantite(demande.n, demande.aliment) });
  };
  brancherBarre(scene, { ecouter: redire, aller });

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    const regle = NIVEAUX[niveau];
    const convives = melanger([...doudousActifs()]).slice(0, regle.demandes);
    progres.replaceChildren(...convives.map((d) => {
      const p = document.createElement('div');
      p.className = 'pastille';
      p.append(imageDoudou(d));
      return p;
    }));
    dire(niveau === 0 ? 'pique-consigne' : 'pique-consigne-2');
    plusTard(() => prochaineDemande(convives, 0), 2600);
  }

  function prochaineDemande(convives, rang) {
    const regle = NIVEAUX[niveau];
    if (rang >= convives.length) return partieGagnee();
    const doudou = convives[rang];
    progres.children[rang]?.classList.add('en-cours');

    if (regle.type === 'couleur') {
      const choix = melanger([...COULEURS]).slice(0, regle.choix);
      const bon = choix[0];
      demande = { type: 'couleur', doudou, rang, convives, aliment: ALIMENTS[bon], idBon: bon };
      remplirPanier(melanger([...choix]));
    } else {
      const id = A_COMPTER[Math.floor(Math.random() * A_COMPTER.length)];
      const n = 1 + Math.floor(Math.random() * regle.max);
      demande = { type: 'compte', doudou, rang, convives, aliment: ALIMENTS[id], idBon: id, n, donnes: 0 };
      remplirPanier(Array(5).fill(id));
    }

    // Le doudou arrive en sautillant, assiette vide
    dansAssiette.replaceChildren();
    convive.replaceChildren(imageDoudou(doudou));
    convive.classList.remove('arrive', 'repart'); void convive.offsetWidth; convive.classList.add('arrive');
    plusTard(redire, 700);
    relancerIndice();
  }

  function remplirPanier(ids) {
    panier.classList.toggle('compte', demande.type === 'compte');
    panier.replaceChildren(...ids.map((id, i) => {
      const b = document.createElement('button');
      b.className = 'aliment';
      b.style.setProperty('--i', i);
      b.dataset.id = id;
      b.innerHTML = ALIMENTS[id].svg;
      b.addEventListener('click', () => donner(b, id));
      return b;
    }));
  }

  function relancerIndice() {
    clearTimeout(indice);
    indice = setTimeout(() => {
      if (!actif || !demande) return;
      panier.querySelectorAll(`.aliment[data-id="${demande.idBon}"]:not(.parti)`).forEach((b) => {
        b.classList.remove('indice'); void b.offsetWidth; b.classList.add('indice');
      });
      relancerIndice();
    }, INDICE_APRES);
  }

  function donner(bouton, id) {
    if (!demande || demande.servi || bouton.classList.contains('parti')) return;
    relancerIndice();

    // Pas le bon aliment : petit bond, et on redit la demande gentiment.
    if (id !== demande.idBon) {
      pop();
      bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
      dire('pique-autre', { aliment: ALIMENTS[id].un, nom: demande.doudou.nom, couleur: demande.aliment.couleur });
      return;
    }

    pop();
    envoler(bouton, id);

    if (demande.type === 'couleur') {
      demande.servi = true;
      plusTard(manger, 650);
    } else {
      demande.donnes++;
      dire('pique-nombre', { mot: nombre(demande.donnes, demande.aliment.genre) });
      if (demande.donnes >= demande.n) {
        demande.servi = true;
        panier.querySelectorAll('.aliment:not(.parti)').forEach((b) => b.classList.add('range'));
        plusTard(manger, 900);
      }
    }
  }

  // L’aliment vole du panier jusqu’à l’assiette.
  function envoler(bouton, id) {
    bouton.classList.add('parti');
    const depart = bouton.getBoundingClientRect();
    const arrivee = dansAssiette.getBoundingClientRect();
    const volant = document.createElement('div');
    volant.className = 'volant';
    volant.innerHTML = ALIMENTS[id].svg;
    Object.assign(volant.style, { left: depart.left + 'px', top: depart.top + 'px', width: depart.width + 'px', height: depart.height + 'px' });
    document.body.append(volant);
    const taille = Math.min(arrivee.height * 1.1, depart.width);
    const decalage = (dansAssiette.children.length - 1) * taille * 0.45;
    const dx = arrivee.left + arrivee.width / 2 - taille / 2 + decalage - depart.left;
    const dy = arrivee.top + arrivee.height / 2 - taille / 2 - depart.top;
    const echelle = taille / depart.width;
    const vol = volant.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(${(1 + echelle) / 2}) rotate(-15deg)` },
      { transform: `translate(${dx}px, ${dy}px) scale(${echelle})` },
    ], { duration: 600, easing: 'ease-in-out' });
    const pourQui = demande;
    vol.onfinish = () => volant.remove();
    setTimeout(() => {
      volant.remove();
      if (!actif || demande !== pourQui || pourQui.mange) return; // arrivé trop tard : ce n’est plus son tour
      const pose = document.createElement('div');
      pose.className = 'servi';
      pose.innerHTML = ALIMENTS[id].svg;
      dansAssiette.append(pose);
      disposerAssiette();
    }, 580);
  }

  function disposerAssiette() {
    const n = dansAssiette.children.length;
    [...dansAssiette.children].forEach((el, i) => el.style.setProperty('--x', (i - (n - 1) / 2) * 45 + '%'));
  }

  // Le doudou mange (pose « mange »), puis saute de joie et laisse la place au suivant.
  function manger() {
    const { doudou, rang, convives } = demande;
    demande.mange = true;
    clearTimeout(indice);
    convive.replaceChildren(imageDoudou(doudou, 'mange'));
    convive.classList.add('mange');
    croque();
    dansAssiette.classList.add('miam');
    plusTard(() => croque(), 450);
    plusTard(() => {
      dansAssiette.classList.remove('miam');
      dansAssiette.replaceChildren();
      convive.classList.remove('mange');
      convive.replaceChildren(imageDoudou(doudou, 'joie'));
      convive.classList.add('content');
      carillon();
      gerbeSur(convive, 10);
      progres.children[rang]?.classList.replace('en-cours', 'repu');
      dire('pique-bon', { aliment: demande.aliment.le, nom: doudou.nom, id: doudou.id });
    }, 1200);
    plusTard(() => {
      convive.classList.remove('content');
      convive.classList.add('repart');
    }, 3400);
    plusTard(() => prochaineDemande(convives, rang + 1), 4000);
  }

  function partieGagnee() {
    demande = null;
    clearTimeout(indice);
    panier.replaceChildren();
    convive.replaceChildren();
    // Tous les convives reviennent danser
    convive.classList.remove('repart', 'arrive');
    const ronde = document.createElement('div');
    ronde.className = 'ronde-repue';
    [...progres.children].forEach((p, i) => {
      const d = p.querySelector('.doudou').cloneNode(true);
      d.style.setProperty('--i', i);
      ronde.append(d);
    });
    pre.querySelector('.ronde-repue')?.remove();
    pre.append(ronde);
    confettis();
    fanfare();
    dire('pique-gagne').then(() => { if (actif && !demande) dire('pique-encore'); });
    plusTard(() => afficherFin(fin, {
      dernier: niveau >= NIVEAUX.length - 1,
      suivant: () => { ronde.remove(); niveau++; nouvellePartie(); },
      rejouer: () => { ronde.remove(); nouvellePartie(); },
      aller,
    }), 2400);
  }

  nouvellePartie();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    clearTimeout(indice);
    document.querySelectorAll('.volant').forEach((v) => v.remove());
    taire();
  };
}
