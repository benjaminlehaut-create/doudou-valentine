// Jeu 9 : le jeu des sons (pré-lecture, sans lecture jamais nécessaire), avec Goubi et Kiki.
// Niveau 1, les syllabes : une image, le mot dit syllabe par syllabe, on tape sur le tambour
// autant de fois qu'il y a de syllabes.
// Niveau 2, les rimes : « Qu'est-ce qui rime avec… » et 3 images, trouver celle qui rime.
// Niveau 3, le son du début : « Qu'est-ce qui commence comme sssserpent » et 3 images (des sons
// qu'on peut prolonger à l'oral : S, M, F, L, CH, R).
// Niveau 4 (bonus prénom) : retrouver la lettre V parmi 3, puis reconstituer VALENTINE en touchant
// les lettres dans l'ordre (jamais de glisser-déposer), avec le modèle toujours visible au-dessus.
// Jamais de mauvaise réponse punie : rien ne se passe (syllabes), ou on réessaie (le reste).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, douceur, fanfare } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, ecranNiveaux, melanger, valentineDuJeu } from './commun.js';
import { debloquer } from '../progres.js';
import { IMAGE, MOTS_SYLLABES, TOUS_LES_MOTS, RIMES, SONS_DEBUT } from './phonologie-donnees.js';

const PRENOM = 'VALENTINE';
const AUTRES_LETTRES = ['B', 'O', 'S'];

const TAMBOUR = `<svg viewBox="0 0 100 100"><path d="M12 30 V62 Q12 78 50 78 Q88 78 88 62 V30" fill="#ff8fab" stroke="#e8a93f" stroke-width="4"/>
  <ellipse cx="50" cy="30" rx="38" ry="16" fill="#ffd36b" stroke="#e8a93f" stroke-width="4"/>
  ${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${50 + 38 * Math.cos(a * Math.PI / 180)}" cy="${62 + 16 * Math.sin(a * Math.PI / 180)}" r="3" fill="#e8a93f"/>`).join('')}</svg>`;

const NIVEAUX = [
  { type: 'syllabes', demandes: 5 },
  { type: 'rimes', demandes: RIMES.length },
  { type: 'sons', demandes: SONS_DEBUT.length },
  { type: 'prenom' },
];

export function ouvrirPhonologie(scene, { aller }) {
  scene.classList.add('ecran-sons');
  scene.innerHTML = `
    <div class="classe-sons">
      <div class="hotes-sons"></div>
      <div class="progres"></div>
      <div class="cible-sons cache"></div>
      <div class="tambour-zone cache">
        <button class="tambour" aria-label="Tambour">${TAMBOUR}</button>
        <div class="syllabes-points"></div>
      </div>
      <div class="prenom-sons cache">
        <div class="modele-prenom"></div>
        <div class="lettres-trouver cache"></div>
        <div class="prenom-slots cache"></div>
        <div class="prenom-palette cache"></div>
      </div>
    </div>
    ${BARRE}
    <div class="fin cache"></div>`;

  const classe = scene.querySelector('.classe-sons');
  const hotes = scene.querySelector('.hotes-sons');
  const progres = scene.querySelector('.progres');
  const cible = scene.querySelector('.cible-sons');
  const tambourZone = scene.querySelector('.tambour-zone');
  const tambour = scene.querySelector('.tambour');
  const points = scene.querySelector('.syllabes-points');
  const prenomZone = scene.querySelector('.prenom-sons');
  const modelePrenom = scene.querySelector('.modele-prenom');
  const lettresTrouver = scene.querySelector('.lettres-trouver');
  const prenomSlots = scene.querySelector('.prenom-slots');
  const prenomPalette = scene.querySelector('.prenom-palette');
  const fin = scene.querySelector('.fin');

  let niveau = null;
  let actif = true;
  let minuteries = [];
  let demande = null; // { type, mot?, motVoix?, correcte?, n?, tapes?, rang }
  let listeRonde = [];
  let phasePrenom = null; // 'trouverV' | 'reconstruire' | null
  let positionPrenom = 0;
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const deuxHotes = doudousActifs().filter((d) => d.id === 'goubi' || d.id === 'kiki');

  const redire = () => {
    if (phasePrenom === 'trouverV') { dire('sons-prenom-v'); return; }
    if (phasePrenom === 'reconstruire') { dire('sons-prenom-reconstruire'); return; }
    if (!demande) { dire(['sons-consigne', 'sons-consigne-2', 'sons-consigne-3'][niveau] || 'sons-consigne'); return; }
    if (demande.type === 'syllabes') dire('sons-syllabe-' + demande.mot);
    else if (demande.type === 'rimes') dire('sons-rime-demande', { cible: demande.motVoix });
    else dire('sons-debut-demande', { debut: demande.motVoix });
  };
  brancherBarre(scene, { ecouter: redire, aller });
  const valentine = valentineDuJeu(scene, 'content');
  hotes.replaceChildren(...deuxHotes.map((d) => imageDoudou(d)));

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    fin.classList.add('cache');
    classe.querySelector('.choix-images')?.remove();
    valentine.fond('content');
    phasePrenom = null;
    const regle = NIVEAUX[niveau];
    if (regle.type === 'prenom') {
      progres.replaceChildren();
      cible.classList.add('cache');
      tambourZone.classList.add('cache');
      demarrerPrenom();
      return;
    }
    prenomZone.classList.add('cache');
    if (regle.type === 'syllabes') listeRonde = melanger(Object.keys(MOTS_SYLLABES)).slice(0, regle.demandes);
    else if (regle.type === 'rimes') listeRonde = melanger([...RIMES]);
    else listeRonde = melanger([...SONS_DEBUT]);
    progres.replaceChildren(...listeRonde.map(() => pastille()));
    dire(['sons-consigne', 'sons-consigne-2', 'sons-consigne-3'][niveau] || 'sons-consigne');
    plusTard(() => prochaineDemande(0), 3400);
  }

  // ---- Bonus prénom : 1) retrouver le V, 2) reconstituer VALENTINE ----

  function demarrerPrenom() {
    prenomZone.classList.remove('cache');
    modelePrenom.replaceChildren(...PRENOM.split('').map((l) => {
      const s = document.createElement('span');
      s.className = 'lettre-modele';
      s.textContent = l;
      return s;
    }));
    prenomSlots.classList.add('cache');
    prenomPalette.classList.add('cache');
    phasePrenom = 'trouverV';
    const choix = melanger([PRENOM[0], ...melanger([...AUTRES_LETTRES]).slice(0, 2)]);
    lettresTrouver.classList.remove('cache');
    lettresTrouver.replaceChildren(...choix.map((l) => {
      const b = document.createElement('button');
      b.className = 'lettre-choix';
      b.textContent = l;
      b.addEventListener('click', () => {
        if (phasePrenom !== 'trouverV') return;
        if (l !== PRENOM[0]) {
          pop();
          b.classList.remove('non'); void b.offsetWidth; b.classList.add('non');
          dire('sons-pas-ca');
          return;
        }
        phasePrenom = null;
        douceur();
        gerbeSur(b, 10);
        dire('sons-prenom-trouve-v');
        plusTard(() => { lettresTrouver.classList.add('cache'); demarrerReconstruction(); }, 1800);
      });
      return b;
    }));
    plusTard(redire, 500);
  }

  function demarrerReconstruction() {
    positionPrenom = 0;
    phasePrenom = 'reconstruire';
    prenomSlots.classList.remove('cache');
    prenomSlots.replaceChildren(...PRENOM.split('').map(() => {
      const s = document.createElement('div');
      s.className = 'slot-lettre';
      return s;
    }));
    prenomPalette.classList.remove('cache');
    prenomPalette.replaceChildren(...melanger(PRENOM.split('')).map((l, i) => {
      const b = document.createElement('button');
      b.className = 'lettre-choix';
      b.style.setProperty('--i', i);
      b.textContent = l;
      b.addEventListener('click', () => toucherLettrePrenom(l, b));
      return b;
    }));
    plusTard(redire, 500);
  }

  function toucherLettrePrenom(l, bouton) {
    if (phasePrenom !== 'reconstruire' || bouton.classList.contains('posee')) return;
    const attendu = PRENOM[positionPrenom];
    if (l !== attendu) {
      pop();
      bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non');
      return;
    }
    douceur();
    gerbeSur(bouton, 6);
    bouton.classList.add('posee');
    const slot = prenomSlots.children[positionPrenom];
    slot.textContent = l;
    slot.classList.add('remplie');
    positionPrenom++;
    if (positionPrenom >= PRENOM.length) {
      phasePrenom = null;
      plusTard(finPrenom, 900);
    }
  }

  function finPrenom() {
    debloquer('sons', niveau);
    valentine.fond('joie');
    confettis();
    fanfare();
    dire('sons-prenom-bravo').then(() => { if (actif) dire('sons-encore'); });
    plusTard(() => afficherFin(fin, { dernier: true, rejouer: nouvellePartie, aller }), 1800);
  }

  function pastille() {
    const p = document.createElement('div');
    p.className = 'pastille';
    return p;
  }

  function prochaineDemande(rang) {
    if (rang >= listeRonde.length) return partieGagnee();
    const regle = NIVEAUX[niveau];
    progres.children[rang]?.classList.add('en-cours');

    if (regle.type === 'syllabes') {
      const mot = listeRonde[rang];
      demande = { type: 'syllabes', mot, n: MOTS_SYLLABES[mot].syllabes, tapes: 0, rang };
      cible.innerHTML = `<img src="${IMAGE(mot)}" alt="">`;
      tambourZone.classList.remove('cache');
      points.replaceChildren(...Array.from({ length: demande.n }, () => {
        const p = document.createElement('span');
        p.className = 'point-syllabe';
        return p;
      }));
    } else {
      const entree = listeRonde[rang];
      const correcte = regle.type === 'rimes' ? entree.rime : entree.mot;
      const eviter = regle.type === 'sons' ? [entree.mot, ...entree.eviter] : [entree.mot, entree.rime];
      const pool = melanger(TOUS_LES_MOTS.filter((m) => !eviter.includes(m) && m !== correcte));
      const motVoix = regle.type === 'sons' ? entree.voix : entree.mot;
      demande = { type: regle.type, motVoix, correcte, rang };
      cible.innerHTML = `<img src="${IMAGE(entree.mot)}" alt="">`;
      tambourZone.classList.add('cache');
      proposerChoix(melanger([correcte, ...pool.slice(0, 2)]), correcte);
    }
    cible.classList.remove('cache');
    plusTard(redire, 500);
  }

  tambour.addEventListener('click', () => {
    if (!demande || demande.type !== 'syllabes') return;
    pop();
    demande.tapes++;
    points.children[demande.tapes - 1]?.classList.add('tape');
    tambour.classList.remove('frappe'); void tambour.offsetWidth; tambour.classList.add('frappe');
    if (demande.tapes >= demande.n) reussiteSyllabes();
  });

  function reussiteSyllabes() {
    const { rang } = demande;
    carillon();
    gerbeSur(tambour, 10);
    progres.children[rang]?.classList.replace('en-cours', 'repu');
    valentine.pose('joie', { duree: 1200 });
    dire('sons-bravo');
    demande = null;
    plusTard(() => {
      tambourZone.classList.add('cache');
      cible.classList.add('cache');
      prochaineDemande(rang + 1);
    }, 1800);
  }

  function proposerChoix(ids, correcte) {
    const rangee = document.createElement('div');
    rangee.className = 'choix-images';
    let choisi = false;
    rangee.replaceChildren(...ids.map((id, i) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', id);
      b.innerHTML = `<img src="${IMAGE(id)}" alt="">`;
      b.addEventListener('click', () => {
        if (choisi) return;
        if (id !== correcte) {
          pop();
          b.classList.remove('non'); void b.offsetWidth; b.classList.add('non');
          dire('sons-pas-ca');
          return;
        }
        choisi = true;
        douceur();
        gerbeSur(b, 10);
        b.classList.add('elu');
        reussiteChoix();
      });
      return b;
    }));
    classe.append(rangee);
  }

  function reussiteChoix() {
    const { rang } = demande;
    carillon();
    progres.children[rang]?.classList.replace('en-cours', 'repu');
    valentine.pose('joie', { duree: 1200 });
    dire('sons-bravo');
    demande = null;
    plusTard(() => {
      classe.querySelector('.choix-images')?.remove();
      cible.classList.add('cache');
      prochaineDemande(rang + 1);
    }, 2000);
  }

  function partieGagnee() {
    debloquer('sons', niveau);
    valentine.fond('joie');
    demande = null;
    cible.classList.add('cache');
    tambourZone.classList.add('cache');
    confettis();
    dire('sons-gagne').then(() => { if (actif) dire('sons-encore'); });
    plusTard(() => afficherFin(fin, {
      dernier: niveau >= NIVEAUX.length - 1,
      suivant: () => { niveau++; nouvellePartie(); },
      rejouer: nouvellePartie,
      aller,
    }), 1800);
  }

  ecranNiveaux(scene, { jeu: 'sons', total: NIVEAUX.length, choisir: (i) => { niveau = i; nouvellePartie(); } });

  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    taire();
  };
}
