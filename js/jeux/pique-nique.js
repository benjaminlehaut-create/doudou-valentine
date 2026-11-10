// Jeu 3 : le pique-nique des doudous.
// Un doudou a faim : la bulle au-dessus de lui montre ce qu’il veut, et la voix le dit.
// On compose son assiette : toucher un aliment du panier le pose dans l’assiette,
// toucher un aliment de l’assiette le remet dans le panier. Puis on appuie sur le bouton vert ✓.
// Juste : le doudou mange et saute de joie. Faux : le doudou est un peu triste et explique gentiment
// (« c’est trop », « il en manque »…) ; on corrige et on revalide. Jamais de son négatif.
// Niveau 1, les couleurs : « Sacha voudrait un fruit jaune » (trois fruits au choix).
// Niveau 2, les quantités : « Debby voudrait deux fraises » (panier mélangé : il faut le bon aliment ET le bon nombre).
// Niveau 3, le mélange : « il voudrait deux fruits rouges » (la couleur ET le nombre, peu importe lequel des
// fruits de cette couleur ; le panier mélange plusieurs couleurs et plusieurs fruits).
// Niveau 4 et 5 : les mêmes quantités, mais jusqu’à 5 puis jusqu’à 10.
// Niveau 6, le chiffre : un chiffre écrit s’affiche (sans le dire) ; il faut donner le bon nombre.
// Niveau 7, le partage : deux doudous en même temps, chacun avec sa propre quantité d’un aliment différent
// (un panier commun) ; toucher un aliment l’envoie tout seul dans la bonne assiette (jamais les deux à la fois).
// Niveau 8, l’addition : un doudou a déjà quelques aliments, on lui en donne un de plus ; elle touche le bon
// chiffre parmi 3 (pas de bouton valider ici : la réponse se donne directement).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, croque, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, ecranNiveaux, melanger, valentineDuJeu } from './commun.js';
import { ALIMENTS, COULEURS, A_COMPTER, TEINTES, COULEURS_PLURIEL, nombre, quantite } from './aliments.js';
import { debloquer } from '../progres.js';
import { COCHE } from '../icones.js';

const NIVEAUX = [
  { type: 'couleur', choix: 3, demandes: 3 },
  { type: 'compte', max: 3, demandes: 3, leurres: 3 },
  { type: 'melange', max: 3, demandes: 4, leurres: 2 },
  { type: 'compte', max: 5, demandes: 3, leurres: 4 },
  { type: 'compte', max: 10, demandes: 3, leurres: 2 },
  { type: 'chiffre', max: 5, demandes: 3, leurres: 4 },
  { type: 'partage', max: 3, demandes: 2 },
  { type: 'addition', max: 3, demandes: 3 },
];

// « deux fruits rouges », « un fruit rouge »
const texteMelange = (n, couleur) => `${nombre(n, 'm')} fruit${n > 1 ? 's' : ''} ${n > 1 ? COULEURS_PLURIEL[couleur] : couleur}`;
const INDICE_APRES = 9000; // ms sans rien faire avant que le bon aliment se dandine

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
      <div class="duos cache">
        <div class="duo"><div class="duo-convive"></div><div class="duo-bulle"></div><div class="duo-assiette"></div></div>
        <div class="duo"><div class="duo-convive"></div><div class="duo-bulle"></div><div class="duo-assiette"></div></div>
      </div>
      <div class="addition cache">
        <div class="addition-depart"></div>
        <div class="addition-choix"></div>
      </div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const pre = scene.querySelector('.pre');
  const progres = scene.querySelector('.progres');
  const convive = scene.querySelector('.convive');
  const bulle = scene.querySelector('.bulle');
  const assiette = scene.querySelector('.assiette');
  const dansAssiette = scene.querySelector('.dans-assiette');
  const boutonValider = scene.querySelector('.valider');
  const panier = scene.querySelector('.panier');
  const duos = scene.querySelector('.duos');
  const addition = scene.querySelector('.addition');
  const fin = scene.querySelector('.fin');

  let niveau = null;
  let actif = true;
  let minuteries = [];
  let indice = null;
  let demande = null; // la demande en cours (sa forme dépend du type : voir chaque niveau)
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const redire = () => {
    if (!demande) return;
    if (demande.type === 'couleur') dire('pique-couleur', { nom: demande.doudou.nom, couleur: demande.aliment.couleur });
    else if (demande.type === 'melange') dire('pique-compte', { nom: demande.doudou.nom, quantite: texteMelange(demande.n, demande.couleur) });
    else if (demande.type === 'chiffre') dire('pique-chiffre', { nom: demande.doudou.nom });
    else if (demande.type === 'partage') {
      const [a, b] = demande.cibles;
      dire('pique-partage', { nom1: a.doudou.nom, quantite1: quantite(a.n, a.aliment), nom2: b.doudou.nom, quantite2: quantite(b.n, b.aliment) });
    } else if (demande.type === 'addition') {
      dire('pique-addition', { nom: demande.doudou.nom, depart: quantite(demande.depart, demande.aliment) });
    } else dire('pique-compte', { nom: demande.doudou.nom, quantite: quantite(demande.n, demande.aliment) });
  };

  // Un aliment convient-il à la demande en cours ? (pour l’indice qui dandine, dans le panier commun)
  const correspond = (id) => {
    if (!demande) return false;
    if (demande.type === 'melange') return ALIMENTS[id].couleur === demande.couleur;
    if (demande.type === 'partage') return demande.cibles.some((c) => c.idBon === id);
    return id === demande.idBon;
  };
  brancherBarre(scene, { ecouter: redire, aller });
  const valentine = valentineDuJeu(scene, 'content');
  boutonValider.addEventListener('click', valider);

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    valentine.fond('content');
    duos.classList.add('cache');
    addition.classList.add('cache');
    assiette.classList.remove('cache');
    boutonValider.classList.remove('cache');
    panier.classList.remove('cache');
    const regle = NIVEAUX[niveau];
    const convives = regle.type === 'partage'
      ? Array.from({ length: regle.demandes }, () => melanger([...doudousActifs()]).slice(0, 2))
      : melanger([...doudousActifs()]).slice(0, regle.demandes);
    progres.replaceChildren(...convives.map((d) => {
      const p = document.createElement('div');
      p.className = 'pastille';
      p.append(imageDoudou(Array.isArray(d) ? d[0] : d));
      return p;
    }));
    dire(['pique-consigne', 'pique-consigne-2', 'pique-consigne-3', 'pique-consigne-4', 'pique-consigne-5', 'pique-consigne-6', 'pique-consigne-7', 'pique-consigne-8'][niveau] || 'pique-consigne-2');
    plusTard(() => prochaineDemande(convives, 0), 4200);
  }

  function prochaineDemande(convives, rang) {
    const regle = NIVEAUX[niveau];
    if (rang >= convives.length) return partieGagnee();
    progres.children[rang]?.classList.add('en-cours');

    if (regle.type === 'partage') { demarrerPartage(convives, rang); return; }
    if (regle.type === 'addition') { demarrerAddition(convives, rang); return; }

    const doudou = convives[rang];
    if (regle.type === 'couleur') {
      const choix = melanger([...COULEURS]).slice(0, regle.choix);
      const bon = choix[0];
      demande = { type: 'couleur', doudou, rang, convives, aliment: ALIMENTS[bon], idBon: bon, n: 1, assiette: [] };
      remplirPanier(melanger([...choix]));
    } else if (regle.type === 'melange') {
      const couleur = melanger(Object.keys(TEINTES))[0];
      const idsBons = Object.keys(ALIMENTS).filter((id) => ALIMENTS[id].couleur === couleur);
      const idsAutres = melanger(Object.keys(ALIMENTS).filter((id) => ALIMENTS[id].couleur !== couleur)).slice(0, regle.leurres);
      const n = 1 + Math.floor(Math.random() * regle.max);
      demande = { type: 'melange', doudou, rang, convives, couleur, idsBons, n, assiette: [] };
      const poolBons = Array.from({ length: 5 }, (_, i) => idsBons[i % idsBons.length]);
      remplirPanier(melanger([...poolBons, ...idsAutres.flatMap((id) => [id, id])]));
    } else {
      // « compte » et « chiffre » partagent la même mécanique : un seul bon aliment, le bon nombre.
      const ids = melanger([...A_COMPTER]);
      const bon = ids[0];
      const leurre = ids[1];
      const n = 1 + Math.floor(Math.random() * regle.max);
      demande = { type: regle.type, doudou, rang, convives, aliment: ALIMENTS[bon], idBon: bon, n, assiette: [] };
      const pool = Math.max(n, 5); // assez de copies du bon aliment pour CETTE demande (pas le maximum du niveau : ça tiendrait mal à l’écran)
      remplirPanier(melanger([...Array(pool).fill(bon), ...Array(regle.leurres).fill(leurre)]));
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
    } else if (demande.type === 'melange') {
      bulle.innerHTML = Array.from({ length: demande.n }, () => `<div class="voulu tache" style="--teinte:${TEINTES[demande.couleur]}"></div>`).join('');
    } else if (demande.type === 'chiffre') {
      bulle.innerHTML = `<div class="chiffre-geant">${demande.n}</div>`;
    } else {
      bulle.innerHTML = Array.from({ length: demande.n }, () => `<div class="voulu">${demande.aliment.svg}</div>`).join('');
    }
    bulle.classList.toggle('chiffre-bulle', demande.type === 'chiffre');
    bulle.classList.remove('cache', 'secoue');
    majBulle();
  }

  function majBulle() {
    if (!demande || (demande.type !== 'compte' && demande.type !== 'melange')) return;
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
      b.addEventListener('click', () => {
        if (demande && demande.type === 'partage') donnerPartage(b, id);
        else donner(b, id);
      });
      return b;
    }));
  }

  function relancerIndice() {
    clearTimeout(indice);
    indice = setTimeout(() => {
      if (!actif || !demande || demande.verrou) return;
      panier.querySelectorAll('.aliment:not(.parti)').forEach((b) => {
        if (!correspond(b.dataset.id)) return;
        b.classList.remove('indice'); void b.offsetWidth; b.classList.add('indice');
      });
      relancerIndice();
    }, INDICE_APRES);
  }

  const combienDeBons = () => demande.assiette.filter((x) => correspond(x.id)).length;

  function majValider() {
    if (demande && demande.type === 'partage') {
      boutonValider.classList.toggle('pret', demande.cibles.some((c) => c.assiette.length));
      return;
    }
    boutonValider.classList.toggle('pret', Boolean(demande && demande.assiette.length));
  }

  // Panier → assiette
  function donner(bouton, id) {
    if (!demande || demande.verrou || bouton.classList.contains('parti')) return;
    relancerIndice();
    pop();
    const item = { id, bouton, el: null };
    demande.assiette.push(item);
    envoler(bouton, item, dansAssiette, () => {
      if (!demande || !demande.assiette.includes(item)) return;
      const pose = document.createElement('button');
      pose.className = 'servi';
      pose.setAttribute('aria-label', 'Enlever');
      pose.innerHTML = ALIMENTS[item.id].svg;
      pose.addEventListener('click', () => reprendre(item));
      item.el = pose;
      dansAssiette.append(pose);
      disposerElements(dansAssiette);
    });
    if (demande.type !== 'couleur' && correspond(id)) {
      // Niveau mélange : on compte des « fruits » (masculin), comme dans la demande elle-même
      // (« un fruit rouge ») — jamais le genre de l’aliment précis qui a été touché.
      const genre = demande.type === 'melange' ? 'm' : ALIMENTS[id].genre;
      dire('pique-nombre', { mot: nombre(combienDeBons(), genre) });
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
    disposerElements(dansAssiette);
    majBulle();
    majValider();
  }

  // L’aliment vole du panier jusqu’à destinationEl ; une fois arrivé (et si toujours pertinent), surArrivee().
  function envoler(bouton, item, destinationEl, surArrivee) {
    bouton.classList.add('parti');
    const depart = bouton.getBoundingClientRect();
    const arrivee = destinationEl.getBoundingClientRect();
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
      if (!actif || demande !== pourQui || pourQui.mange) return;
      surArrivee();
    }, 580);
  }

  function disposerElements(conteneur) {
    const els = [...conteneur.children];
    const n = els.length;
    const pas = Math.min(55, 220 / Math.max(n, 1));
    els.forEach((el, i) => el.style.setProperty('--x', (i - (n - 1) / 2) * pas + '%'));
  }

  // Le bouton vert : le doudou regarde son assiette.
  function valider() {
    if (!demande || demande.verrou) return;
    if (demande.type === 'addition') return; // ce niveau répond en touchant un chiffre, pas de bouton
    relancerIndice();
    if (demande.type === 'partage') return validerPartage();
    if (!demande.assiette.length) {
      douceur();
      secouerBulle();
      dire('pique-vide');
      return;
    }
    const bons = combienDeBons();
    const autres = demande.assiette.length - bons;
    const vars = demande.type === 'melange'
      ? { nom: demande.doudou.nom, couleur: demande.couleur, quantite: texteMelange(demande.n, demande.couleur), pluriel: `fruits ${COULEURS_PLURIEL[demande.couleur]}` }
      : { nom: demande.doudou.nom, couleur: demande.aliment.couleur, quantite: quantite(demande.n, demande.aliment), pluriel: demande.aliment.pluriel };

    if (autres === 0 && bons === demande.n) return manger();

    let raison;
    if (demande.type === 'couleur') raison = bons === 0 ? 'pique-pas-couleur' : 'pique-trop-couleur';
    else if (demande.type === 'chiffre') raison = autres > 0 ? 'pique-pas-ca' : bons < demande.n ? 'pique-chiffre-manque' : 'pique-chiffre-trop';
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
      const nomAliment = demande.type === 'melange'
        ? `${demande.n > 1 ? 'les' : 'le'} fruit${demande.n > 1 ? 's' : ''} ${demande.n > 1 ? COULEURS_PLURIEL[demande.couleur] : demande.couleur}`
        : demande.aliment.le;
      dire('pique-bon', { aliment: nomAliment, nom: doudou.nom, id: doudou.id });
    }, 1200);
    plusTard(() => {
      convive.classList.remove('content');
      convive.classList.add('repart');
    }, 3400);
    plusTard(() => prochaineDemande(convives, rang + 1), 4000);
  }

  // ---- Niveau 7 : le partage entre deux doudous ----

  function demarrerPartage(convives, rang) {
    const regle = NIVEAUX[niveau];
    const [doudouA, doudouB] = convives[rang];
    const [idA, idB] = melanger([...A_COMPTER]).slice(0, 2);
    const nA = 1 + Math.floor(Math.random() * regle.max);
    const nB = 1 + Math.floor(Math.random() * regle.max);
    demande = {
      type: 'partage', rang, convives,
      cibles: [
        { doudou: doudouA, aliment: ALIMENTS[idA], idBon: idA, n: nA, assiette: [] },
        { doudou: doudouB, aliment: ALIMENTS[idB], idBon: idB, n: nB, assiette: [] },
      ],
    };
    convive.replaceChildren();
    bulle.classList.add('cache');
    assiette.classList.add('cache');
    duos.classList.remove('cache');
    [...duos.children].forEach((duo, i) => {
      const cible = demande.cibles[i];
      duo.classList.remove('triste');
      duo.querySelector('.duo-convive').replaceChildren(imageDoudou(cible.doudou));
      duo.querySelector('.duo-bulle').replaceChildren(...Array.from({ length: cible.n }, () => {
        const v = document.createElement('div');
        v.className = 'voulu';
        v.innerHTML = cible.aliment.svg;
        return v;
      }));
      duo.querySelector('.duo-assiette').replaceChildren();
    });
    majValider();
    const pool = [idA, idB].flatMap((id) => Array(Math.max(regle.max, 5)).fill(id));
    remplirPanier(melanger(pool));
    plusTard(redire, 700);
    relancerIndice();
  }

  function majBulleDuo(i) {
    const cible = demande.cibles[i];
    const duoBulle = duos.children[i].querySelector('.duo-bulle');
    [...duoBulle.children].forEach((v, k) => v.classList.toggle('recu', k < cible.assiette.length));
  }

  function secouerDuoBulle(i) {
    const b = duos.children[i].querySelector('.duo-bulle');
    b.classList.remove('secoue'); void b.offsetWidth; b.classList.add('secoue');
  }

  // Panier commun → la bonne assiette, toute seule (chaque aliment n’appartient qu’à un seul doudou).
  function donnerPartage(bouton, id) {
    if (!demande || demande.verrou || bouton.classList.contains('parti')) return;
    const i = demande.cibles.findIndex((c) => c.idBon === id);
    if (i === -1) return;
    relancerIndice();
    pop();
    const cible = demande.cibles[i];
    const item = { id, bouton, el: null };
    cible.assiette.push(item);
    const destinationEl = duos.children[i].querySelector('.duo-assiette');
    envoler(bouton, item, destinationEl, () => {
      if (!demande || !cible.assiette.includes(item)) return;
      const pose = document.createElement('button');
      pose.className = 'servi';
      pose.setAttribute('aria-label', 'Enlever');
      pose.innerHTML = ALIMENTS[item.id].svg;
      pose.addEventListener('click', () => reprendrePartage(i, item));
      item.el = pose;
      destinationEl.append(pose);
      disposerElements(destinationEl);
    });
    dire('pique-nombre', { mot: nombre(cible.assiette.length, ALIMENTS[id].genre) });
    majBulleDuo(i);
    majValider();
  }

  function reprendrePartage(i, item) {
    if (!demande || demande.verrou) return;
    relancerIndice();
    douceur();
    const cible = demande.cibles[i];
    cible.assiette = cible.assiette.filter((x) => x !== item);
    item.el?.remove();
    item.bouton.classList.remove('parti');
    disposerElements(duos.children[i].querySelector('.duo-assiette'));
    majBulleDuo(i);
    majValider();
  }

  function validerPartage() {
    const [a, b] = demande.cibles;
    if (!a.assiette.length && !b.assiette.length) {
      douceur();
      secouerDuoBulle(0); secouerDuoBulle(1);
      dire('pique-vide');
      return;
    }
    const okA = a.assiette.length === a.n;
    const okB = b.assiette.length === b.n;
    if (okA && okB) return mangerPartage();
    const i = !okA ? 0 : 1;
    const cible = demande.cibles[i];
    const manque = cible.assiette.length < cible.n;
    tristePartage(i, manque ? 'pique-partage-manque' : 'pique-partage-trop', { nom: cible.doudou.nom, pluriel: cible.aliment.pluriel });
  }

  function tristePartage(i, raison, vars) {
    const cible = demande.cibles[i];
    demande.verrou = true;
    const duo = duos.children[i];
    duo.querySelector('.duo-convive').replaceChildren(imageDoudou(cible.doudou, 'bobo'));
    duo.classList.add('triste');
    valentine.pose('surprise', { duree: 2200 });
    secouerDuoBulle(i);
    dire(raison, vars);
    plusTard(() => {
      if (!demande) return;
      duo.classList.remove('triste');
      duo.querySelector('.duo-convive').replaceChildren(imageDoudou(cible.doudou));
      demande.verrou = false;
    }, 2800);
  }

  function mangerPartage() {
    const { rang, convives, cibles } = demande;
    demande.mange = true;
    demande.verrou = true;
    clearTimeout(indice);
    boutonValider.classList.remove('pret');
    cibles.forEach((cible, i) => duos.children[i].querySelector('.duo-convive').replaceChildren(imageDoudou(cible.doudou, 'mange')));
    croque();
    plusTard(() => croque(), 450);
    plusTard(() => {
      cibles.forEach((cible, i) => {
        const duo = duos.children[i];
        duo.querySelector('.duo-assiette').replaceChildren();
        duo.querySelector('.duo-convive').replaceChildren(imageDoudou(cible.doudou, 'joie'));
      });
      carillon();
      gerbeSur(duos, 14);
      progres.children[rang]?.classList.replace('en-cours', 'repu');
      dire('pique-partage-bon', { nom1: cibles[0].doudou.nom, nom2: cibles[1].doudou.nom });
    }, 1200);
    plusTard(() => prochaineDemande(convives, rang + 1), 4000);
  }

  // ---- Niveau 8 : les premières additions ----

  function demarrerAddition(convives, rang) {
    const regle = NIVEAUX[niveau];
    const doudou = convives[rang];
    const idAliment = melanger([...A_COMPTER])[0];
    const aliment = ALIMENTS[idAliment];
    const depart = 1 + Math.floor(Math.random() * regle.max);
    const reponse = depart + 1;
    demande = { type: 'addition', doudou, rang, convives, aliment, depart, reponse };

    convive.replaceChildren(imageDoudou(doudou));
    convive.classList.remove('arrive', 'repart', 'triste'); void convive.offsetWidth; convive.classList.add('arrive');
    bulle.classList.add('cache');
    duos.classList.add('cache');
    assiette.classList.add('cache');
    boutonValider.classList.add('cache');
    panier.classList.add('cache');
    addition.classList.remove('cache');

    const departZone = addition.querySelector('.addition-depart');
    departZone.replaceChildren(...Array.from({ length: depart }, () => {
      const d = document.createElement('div');
      d.className = 'addition-item';
      d.innerHTML = aliment.svg;
      return d;
    }));
    const plusUn = document.createElement('div');
    plusUn.className = 'addition-item addition-plus-un';
    plusUn.innerHTML = aliment.svg;
    departZone.append(plusUn);

    const choix = melanger([reponse - 1, reponse, reponse + 1]);
    addition.querySelector('.addition-choix').replaceChildren(...choix.map((n) => {
      const b = document.createElement('button');
      b.className = 'lettre-choix';
      b.textContent = n;
      b.addEventListener('click', () => repondreAddition(n, b));
      return b;
    }));

    plusTard(redire, 900);
  }

  function repondreAddition(n, bouton) {
    if (!demande || demande.verrou || demande.type !== 'addition') return;
    if (n !== demande.reponse) {
      pop();
      bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
      dire('pique-addition-rate');
      return;
    }
    demande.verrou = true;
    douceur();
    carillon();
    gerbeSur(bouton, 10);
    bouton.classList.add('elu');
    convive.replaceChildren(imageDoudou(demande.doudou, 'joie'));
    convive.classList.add('content');
    progres.children[demande.rang]?.classList.replace('en-cours', 'repu');
    dire('pique-addition-bravo', { nom: demande.doudou.nom, id: demande.doudou.id });
    const { rang, convives } = demande;
    plusTard(() => {
      convive.classList.remove('content');
      convive.classList.add('repart');
    }, 1800);
    plusTard(() => prochaineDemande(convives, rang + 1), 2600);
  }

  function partieGagnee() {
    debloquer('pique-nique', niveau);
    valentine.fond('joie');
    demande = null;
    clearTimeout(indice);
    majValider();
    panier.replaceChildren();
    convive.replaceChildren();
    bulle.classList.add('cache');
    duos.classList.add('cache');
    addition.classList.add('cache');
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

  ecranNiveaux(scene, { jeu: 'pique-nique', total: NIVEAUX.length, choisir: (i) => { niveau = i; nouvellePartie(); } });

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    clearTimeout(indice);
    document.querySelectorAll('.volant').forEach((v) => v.remove());
    taire();
  };
}
