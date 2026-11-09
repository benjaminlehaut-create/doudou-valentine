// Jeu 9 : le jeu des sons (pré-lecture, sans lecture jamais nécessaire), avec Goubi et Kiki.
// Niveau 1, les syllabes : une image, le mot dit syllabe par syllabe, on tape sur le tambour
// autant de fois qu'il y a de syllabes.
// Niveau 2, les rimes : « Qu'est-ce qui rime avec… » et 3 images, trouver celle qui rime.
// Niveau 3, le son du début : « Qu'est-ce qui commence comme sssserpent » et 3 images (des sons
// qu'on peut prolonger à l'oral : S, M, F, L, CH, R).
// Jamais de mauvaise réponse punie : rien ne se passe (syllabes), ou on réessaie (rimes/sons).

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { BARRE, brancherBarre, afficherFin, ecranNiveaux, melanger, valentineDuJeu } from './commun.js';
import { debloquer } from '../progres.js';
import { IMAGE, MOTS_SYLLABES, TOUS_LES_MOTS, RIMES, SONS_DEBUT } from './phonologie-donnees.js';

const TAMBOUR = `<svg viewBox="0 0 100 100"><path d="M12 30 V62 Q12 78 50 78 Q88 78 88 62 V30" fill="#ff8fab" stroke="#e8a93f" stroke-width="4"/>
  <ellipse cx="50" cy="30" rx="38" ry="16" fill="#ffd36b" stroke="#e8a93f" stroke-width="4"/>
  ${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${50 + 38 * Math.cos(a * Math.PI / 180)}" cy="${62 + 16 * Math.sin(a * Math.PI / 180)}" r="3" fill="#e8a93f"/>`).join('')}</svg>`;

const NIVEAUX = [
  { type: 'syllabes', demandes: 5 },
  { type: 'rimes', demandes: RIMES.length },
  { type: 'sons', demandes: SONS_DEBUT.length },
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
  const fin = scene.querySelector('.fin');

  let niveau = null;
  let actif = true;
  let minuteries = [];
  let demande = null; // { type, mot?, motVoix?, correcte?, n?, tapes?, rang }
  let listeRonde = [];
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));

  const deuxHotes = doudousActifs().filter((d) => d.id === 'goubi' || d.id === 'kiki');

  const redire = () => {
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
    const regle = NIVEAUX[niveau];
    if (regle.type === 'syllabes') listeRonde = melanger(Object.keys(MOTS_SYLLABES)).slice(0, regle.demandes);
    else if (regle.type === 'rimes') listeRonde = melanger([...RIMES]);
    else listeRonde = melanger([...SONS_DEBUT]);
    progres.replaceChildren(...listeRonde.map(() => pastille()));
    dire(['sons-consigne', 'sons-consigne-2', 'sons-consigne-3'][niveau] || 'sons-consigne');
    plusTard(() => prochaineDemande(0), 3400);
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
