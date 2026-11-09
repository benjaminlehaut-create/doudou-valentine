// Jeu 8 : l'atelier peinture. On choisit d'abord avec qui peindre : Poussin ou Sacha.
// Niveau 1, mélanger : on touche deux pots, ils se versent dans le bol, la couleur se mélange en
// tourbillonnant et la voix annonce le résultat (« Jaune et bleu… ça fait VERT ! »). Pas de bonne
// ou de mauvaise réponse : on découvre librement, jusqu'à avoir trouvé les 3 mélanges possibles.
// Niveau 2, deviner : le doudou choisi demande une couleur pour un objet (bulle avec une tache de
// la couleur voulue, comme au pique-nique). Il faut trouver les deux bons pots pour la fabriquer.
// Niveau 3, clair/foncé : les pots blanc et noir s'ajoutent (rose, gris, marron en plus).
// Toujours deux pots à la fois, jamais de glisser-déposer : on touche, ils se versent tout seuls.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, ecranNiveaux, melanger, valentineDuJeu } from './commun.js';
import { debloquer } from '../progres.js';
import { POTS, TEINTES_RESULTAT, trouverRecette, melangeParDefaut, OBJETS } from './peinture-donnees.js';

const NIVEAUX = [
  { type: 'decouverte', pots: ['rouge', 'jaune', 'bleu'] },
  { type: 'deviner', pots: ['rouge', 'jaune', 'bleu'], cibles: ['vert', 'orange', 'violet'], demandes: 3 },
  { type: 'deviner', pots: ['rouge', 'jaune', 'bleu', 'blanc', 'noir'], cibles: ['rose', 'gris', 'marron', 'vert', 'orange', 'violet'], demandes: 4 },
];

export function ouvrirPeinture(scene, { aller }) {
  scene.classList.add('ecran-peinture');
  scene.innerHTML = `
    <div class="atelier">
      <div class="progres"></div>
      <div class="hote-peinture"></div>
      <div class="bulle cache"></div>
      <div class="objet-peint cache"></div>
      <div class="bol"><div class="bol-contenu"></div></div>
      <div class="pots"></div>
      <div class="choix-dodo doudous cache"></div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const progres = scene.querySelector('.progres');
  const hote = scene.querySelector('.hote-peinture');
  const bulle = scene.querySelector('.bulle');
  const objetPeint = scene.querySelector('.objet-peint');
  const bol = scene.querySelector('.bol');
  const bolContenu = scene.querySelector('.bol-contenu');
  const pots = scene.querySelector('.pots');
  const choixPeintre = scene.querySelector('.choix-dodo');
  const fin = scene.querySelector('.fin');

  let niveau = null;
  let actif = true;
  let minuteries = [];
  let choix = null;      // le premier pot touché, en attente du second
  let verrou = false;    // le bol est occupé (en train de mélanger, ou résultat affiché)
  let demande = null;    // { cible, objet, rang }
  let cibleListe = [];
  let trouvailles = new Set(); // les recettes déjà découvertes (niveau 1)
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  let doudouHote = null;

  const redire = () => {
    if (!doudouHote) { dire('peinture-qui'); return; }
    if (!demande) { dire(['peinture-consigne', 'peinture-consigne-2', 'peinture-consigne-3'][niveau] || 'peinture-consigne'); return; }
    dire('peinture-demande', { nom: doudouHote.nom, id: doudouHote.id, objet: OBJETS[demande.objet].le, couleur: demande.cible });
  };
  brancherBarre(scene, { ecouter: redire, aller });
  const valentine = valentineDuJeu(scene, 'content');

  // On choisit d'abord avec qui peindre : Poussin ou Sacha (un seul des deux si l'autre est désactivé).
  function choisirPeintre() {
    const deux = doudousActifs().filter((d) => d.id === 'poussin-jaune' || d.id === 'chat-bleu');
    const liste = deux.length ? deux : doudousActifs().slice(0, 1);
    if (liste.length <= 1) { installerHote(liste[0] || doudousActifs()[0]); return; }
    choixPeintre.classList.remove('cache');
    choixPeintre.replaceChildren(...liste.map((d, i) => {
      const b = document.createElement('button');
      b.className = 'candidat';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', d.nom);
      b.append(imageDoudou(d));
      b.addEventListener('click', () => {
        if (doudouHote) return;
        douceur();
        gerbeSur(b, 10);
        b.classList.add('elu');
        dire('peinture-choisi', { nom: d.nom, id: d.id });
        plusTard(() => { choixPeintre.classList.add('cache'); installerHote(d); }, 1800);
      });
      return b;
    }));
    dire('peinture-qui');
  }

  function installerHote(d) {
    doudouHote = d;
    hote.append(imageDoudou(doudouHote));
    ecranNiveaux(scene, { jeu: 'peinture', total: NIVEAUX.length, choisir: (i) => { niveau = i; nouvellePartie(); } });
  }

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    valentine.fond('content');
    choix = null;
    verrou = false;
    demande = null;
    trouvailles = new Set();
    const regle = NIVEAUX[niveau];
    remplirPots(regle.pots);
    bol.classList.remove('plein', 'tourbillonne');
    if (regle.type === 'decouverte') {
      progres.replaceChildren(...Array.from({ length: 3 }, () => pastille()));
      objetPeint.classList.add('cache');
      bulle.classList.add('cache');
      dire('peinture-consigne');
    } else {
      cibleListe = melanger([...regle.cibles]).slice(0, regle.demandes);
      progres.replaceChildren(...cibleListe.map(() => pastille()));
      dire(niveau === 1 ? 'peinture-consigne-2' : 'peinture-consigne-3');
      plusTard(() => prochaineDemande(0), 3400);
    }
  }

  function pastille() {
    const p = document.createElement('div');
    p.className = 'pastille';
    return p;
  }

  function remplirPots(ids) {
    pots.replaceChildren(...ids.map((id, i) => {
      const b = document.createElement('button');
      b.className = 'pot';
      b.dataset.id = id;
      b.style.setProperty('--i', i);
      b.style.setProperty('--teinte', POTS[id]);
      b.setAttribute('aria-label', 'pot ' + id);
      b.addEventListener('click', () => toucherPot(id, b));
      return b;
    }));
  }

  function prochaineDemande(rang) {
    if (rang >= cibleListe.length) return partieGagnee();
    const cible = cibleListe[rang];
    const ids = Object.keys(OBJETS);
    const objet = ids[Math.floor(Math.random() * ids.length)];
    demande = { cible, objet, rang };
    progres.children[rang]?.classList.add('en-cours');
    objetPeint.className = 'objet-peint';
    objetPeint.innerHTML = OBJETS[objet].svg('#d8d8d8');
    bulle.innerHTML = `<div class="tache" style="--teinte:${TEINTES_RESULTAT[cible]}"></div>`;
    bulle.classList.remove('cache', 'secoue');
    plusTard(redire, 500);
  }

  function toucherPot(id, bouton) {
    if (verrou) return;
    if (choix && choix.id === id && choix.bouton === bouton) {
      choix.bouton.classList.remove('choisi');
      choix = null;
      douceur();
      return;
    }
    pop();
    bouton.classList.add('choisi');
    if (!choix) { choix = { id, bouton }; return; }
    const premier = choix;
    choix = null;
    verrou = true;
    melangerPots(premier, { id, bouton });
  }

  function melangerPots(p1, p2) {
    [p1.bouton, p2.bouton].forEach((b) => b.classList.remove('choisi'));
    const recette = trouverRecette(p1.id, p2.id);
    const teinte = recette ? TEINTES_RESULTAT[recette.resultat] : melangeParDefaut(p1.id, p2.id);
    bolContenu.style.setProperty('--teinte', teinte);
    bol.classList.remove('plein');
    void bol.offsetWidth;
    bol.classList.add('plein', 'tourbillonne');

    plusTard(() => {
      if (!demande) {
        // Niveau découverte : on annonce juste ce que ça donne, jamais faux.
        if (recette) {
          dire('peinture-resultat', { pot1: recette.a, pot2: recette.b, resultat: recette.resultat });
          const cle = [recette.a, recette.b].sort().join('-');
          if (!trouvailles.has(cle)) {
            trouvailles.add(cle);
            progres.children[trouvailles.size - 1]?.classList.add('repu');
          }
        } else {
          dire('peinture-resultat-doux');
        }
        plusTard(() => {
          bol.classList.remove('plein', 'tourbillonne');
          verrou = false;
          if (trouvailles.size >= 3) plusTard(partieGagnee, 600);
        }, 2200);
        return;
      }
      if (recette && recette.resultat === demande.cible) reussite();
      else rate();
    }, 700);
  }

  function reussite() {
    const { objet, cible, rang } = demande;
    carillon();
    objetPeint.innerHTML = OBJETS[objet].svg(TEINTES_RESULTAT[cible]);
    gerbeSur(objetPeint, 10);
    valentine.pose('joie', { duree: 1600 });
    dire('peinture-bravo', { nom: doudouHote.nom, id: doudouHote.id });
    progres.children[rang]?.classList.replace('en-cours', 'repu');
    demande = null;
    plusTard(() => {
      bol.classList.remove('plein', 'tourbillonne');
      verrou = false;
      prochaineDemande(rang + 1);
    }, 1800);
  }

  function rate() {
    douceur();
    bulle.classList.remove('secoue'); void bulle.offsetWidth; bulle.classList.add('secoue');
    dire('peinture-rate');
    plusTard(() => {
      bol.classList.remove('plein', 'tourbillonne');
      verrou = false;
    }, 1600);
  }

  function partieGagnee() {
    debloquer('peinture', niveau);
    valentine.fond('joie');
    demande = null;
    objetPeint.classList.add('cache');
    bulle.classList.add('cache');
    confettis();
    dire('peinture-gagne').then(() => { if (actif) dire('peinture-encore'); });
    plusTard(() => afficherFin(fin, {
      dernier: niveau >= NIVEAUX.length - 1,
      suivant: () => { niveau++; nouvellePartie(); },
      rejouer: nouvellePartie,
      aller,
    }), 1800);
  }

  choisirPeintre();

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
