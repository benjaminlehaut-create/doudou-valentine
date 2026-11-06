// Jeu 3 : le pique-nique des doudous.
// Un doudou a faim : la bulle au-dessus de lui montre ce qu’il veut, et la voix le dit.
// On compose son assiette : toucher un aliment du panier le pose dans l’assiette,
// toucher un aliment de l’assiette le remet dans le panier. Puis on appuie sur le bouton vert ✓.
// Juste : le doudou mange et saute de joie. Faux : le doudou est un peu triste et explique gentiment
// (« c’est trop », « il en manque »…) ; on corrige et on revalide. Jamais de son négatif.
// Niveau 1, les couleurs : « Sacha voudrait un fruit jaune » (trois fruits au choix).
// Niveau 2, les quantités : « Debby voudrait deux fraises » (panier mélangé : il faut le bon aliment ET le bon nombre).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, croque, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, melanger, valentineDuJeu } from './commun.js';
import { ALIMENTS, COULEURS, A_COMPTER, TEINTES, nombre, quantite } from './aliments.js';

const NIVEAUX = [
  { type: 'couleur', choix: 3, demandes: 3 },
  { type: 'compte', max: 3, demandes: 3, leurres: 3 },
];
const INDICE_APRES = 9000; // ms sans rien faire avant que le bon aliment se dandine

const COCHE = `<svg viewBox="0 0 48 48"><path d="M10 25 L20 35 L38 13" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function ouvrirPiqueNique(scene, { aller }) {
  scene.classList.add('ecran-pique');
  scene.innerHTML = `
    <div class="pre">
      <div class="progres"></div>
      <div class="convive"></div>
      <div class="bulle cache"></div>
      <div class="assiette"><div class="dans-assiette"></div></div>
      <button class="valider" aria-label="Valider">${COCHE}</button>
      <div class="panier"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const pre = scene.querySelector('.pre');
  const progres = scene.querySelector('.progres');
  const convive = scene.querySelector('.convive');
  const bulle = scene.querySelector('.bulle');
  const dansAssiette = scene.querySelector('.dans-assiette');
  const boutonValider = scene.querySelector('.valider');
  const panier = scene.querySelector('.panier');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let actif = true;
  let minuteries = [];
  let indice = null;
  let demande = null; // la demande en cours : { doudou, aliment, idBon, n, assiette: [...], verrou }
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const redire = () => {
    if (!demande) return;
    if (demande.type === 'couleur') dire('pique-couleur', { nom: demande.doudou.nom, couleur: demande.aliment.couleur });
    else dire('pique-compte', { nom: demande.doudou.nom, quantite: quantite(demande.n, demande.aliment) });
  };
  brancherBarre(scene, { ecouter: redire, aller });
  const valentine = valentineDuJeu(scene, 'content');
  boutonValider.addEventListener('click', valider);

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    valentine.fond('content');
    const regle = NIVEAUX[niveau];
    const convives = melanger([...doudousActifs()]).slice(0, regle.demandes);
    progres.replaceChildren(...convives.map((d) => {
      const p = document.createElement('div');
      p.className = 'pastille';
      p.append(imageDoudou(d));
      return p;
    }));
    dire(niveau === 0 ? 'pique-consigne' : 'pique-consigne-2');
    plusTard(() => prochaineDemande(convives, 0), 4200);
  }

  function prochaineDemande(convives, rang) {
    const regle = NIVEAUX[niveau];
    if (rang >= convives.length) return partieGagnee();
    const doudou = convives[rang];
    progres.children[rang]?.classList.add('en-cours');

    if (regle.type === 'couleur') {
      const choix = melanger([...COULEURS]).slice(0, regle.choix);
      const bon = choix[0];
      demande = { type: 'couleur', doudou, rang, convives, aliment: ALIMENTS[bon], idBon: bon, n: 1, assiette: [] };
      remplirPanier(melanger([...choix]));
    } else {
      const ids = melanger([...A_COMPTER]);
      const bon = ids[0];
      const leurre = ids[1];
      const n = 1 + Math.floor(Math.random() * regle.max);
      demande = { type: 'compte', doudou, rang, convives, aliment: ALIMENTS[bon], idBon: bon, n, assiette: [] };
      remplirPanier(melanger([...Array(5).fill(bon), ...Array(regle.leurres).fill(leurre)]));
    }

    // Le doudou arrive en sautillant, assiette vide
    dansAssiette.replaceChildren();
    majValider();
    convive.replaceChildren(imageDoudou(doudou));
    convive.classList.remove('arrive', 'repart', 'triste'); void convive.offsetWidth; convive.classList.add('arrive');
    plusTard(montrerBulle, 500);
    plusTard(redire, 700);
    relancerIndice();
  }

  // La bulle montre la demande sans avoir besoin de lire :
  // une grosse tache de la couleur voulue, ou autant d’aliments en ombre qu’il en faut (ils se colorent un à un).
  function montrerBulle() {
    if (!demande) return;
    if (demande.type === 'couleur') {
      bulle.innerHTML = `<div class="tache" style="--teinte:${TEINTES[demande.aliment.couleur]}"></div>`;
    } else {
      bulle.innerHTML = Array.from({ length: demande.n }, () => `<div class="voulu">${demande.aliment.svg}</div>`).join('');
    }
    bulle.classList.remove('cache', 'secoue');
    majBulle();
  }

  function majBulle() {
    if (!demande || demande.type !== 'compte') return;
    const bons = combienDeBons();
    [...bulle.children].forEach((v, k) => v.classList.toggle('recu', k < bons));
  }

  function secouerBulle() {
    bulle.classList.remove('secoue'); void bulle.offsetWidth; bulle.classList.add('secoue');
  }

  function remplirPanier(ids) {
    panier.classList.toggle('compte', ids.length > 3);
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
      if (!actif || !demande || demande.verrou) return;
      panier.querySelectorAll(`.aliment[data-id="${demande.idBon}"]:not(.parti)`).forEach((b) => {
        b.classList.remove('indice'); void b.offsetWidth; b.classList.add('indice');
      });
      relancerIndice();
    }, INDICE_APRES);
  }

  const combienDeBons = () => demande.assiette.filter((x) => x.id === demande.idBon).length;

  function majValider() {
    boutonValider.classList.toggle('pret', Boolean(demande && demande.assiette.length));
  }

  // Panier → assiette
  function donner(bouton, id) {
    if (!demande || demande.verrou || bouton.classList.contains('parti')) return;
    relancerIndice();
    pop();
    const item = { id, bouton, el: null };
    demande.assiette.push(item);
    envoler(bouton, item);
    if (demande.type === 'compte' && id === demande.idBon) {
      dire('pique-nombre', { mot: nombre(combienDeBons(), ALIMENTS[id].genre) });
    }
    majBulle();
    majValider();
  }

  // Assiette → panier
  function reprendre(item) {
    if (!demande || demande.verrou) return;
    relancerIndice();
    douceur();
    demande.assiette = demande.assiette.filter((x) => x !== item);
    item.el?.remove();
    item.bouton.classList.remove('parti');
    disposerAssiette();
    majBulle();
    majValider();
  }

  // L’aliment vole du panier jusqu’à l’assiette.
  function envoler(bouton, item) {
    bouton.classList.add('parti');
    const depart = bouton.getBoundingClientRect();
    const arrivee = dansAssiette.getBoundingClientRect();
    const volant = document.createElement('div');
    volant.className = 'volant';
    volant.innerHTML = ALIMENTS[item.id].svg;
    Object.assign(volant.style, { left: depart.left + 'px', top: depart.top + 'px', width: depart.width + 'px', height: depart.height + 'px' });
    document.body.append(volant);
    const taille = Math.min(arrivee.height, depart.width);
    const dx = arrivee.left + arrivee.width / 2 - taille / 2 - depart.left;
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
      // arrivé trop tard (ce n’est plus son tour), ou déjà repris
      if (!actif || demande !== pourQui || pourQui.mange || !pourQui.assiette.includes(item)) return;
      const pose = document.createElement('button');
      pose.className = 'servi';
      pose.setAttribute('aria-label', 'Enlever');
      pose.innerHTML = ALIMENTS[item.id].svg;
      pose.addEventListener('click', () => reprendre(item));
      item.el = pose;
      dansAssiette.append(pose);
      disposerAssiette();
    }, 580);
  }

  function disposerAssiette() {
    const els = [...dansAssiette.children];
    const n = els.length;
    const pas = Math.min(55, 220 / Math.max(n, 1));
    els.forEach((el, i) => el.style.setProperty('--x', (i - (n - 1) / 2) * pas + '%'));
  }

  // Le bouton vert : le doudou regarde son assiette.
  function valider() {
    if (!demande || demande.verrou) return;
    relancerIndice();
    if (!demande.assiette.length) {
      douceur();
      secouerBulle();
      dire('pique-vide');
      return;
    }
    const bons = combienDeBons();
    const autres = demande.assiette.length - bons;
    const vars = { nom: demande.doudou.nom, couleur: demande.aliment.couleur, quantite: quantite(demande.n, demande.aliment), pluriel: demande.aliment.pluriel };

    if (autres === 0 && bons === demande.n) return manger();

    let raison;
    if (demande.type === 'couleur') raison = bons === 0 ? 'pique-pas-couleur' : 'pique-trop-couleur';
    else raison = autres > 0 ? 'pique-pas-ca' : bons < demande.n ? 'pique-manque' : 'pique-trop';
    triste(raison, vars);
  }

  // Pas tout à fait ce qu’il voulait : un petit air triste, une explication douce, et on peut corriger.
  function triste(raison, vars) {
    const { doudou } = demande;
    demande.verrou = true;
    convive.replaceChildren(imageDoudou(doudou, 'bobo'));
    convive.classList.add('triste');
    valentine.pose('surprise', { duree: 2200 });
    secouerBulle();
    dire(raison, vars);
    plusTard(() => {
      if (!demande || demande.doudou !== doudou) return;
      convive.classList.remove('triste');
      convive.replaceChildren(imageDoudou(doudou));
      demande.verrou = false;
    }, 2800);
  }

  // Le doudou mange (pose « mange »), puis saute de joie et laisse la place au suivant.
  function manger() {
    const { doudou, rang, convives } = demande;
    demande.mange = true;
    demande.verrou = true;
    clearTimeout(indice);
    boutonValider.classList.remove('pret');
    convive.replaceChildren(imageDoudou(doudou, 'mange'));
    convive.classList.add('mange');
    bulle.classList.add('cache');
    valentine.pose('mange', { duree: 1400 });
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
    valentine.fond('joie');
    demande = null;
    clearTimeout(indice);
    majValider();
    panier.replaceChildren();
    convive.replaceChildren();
    bulle.classList.add('cache');
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
