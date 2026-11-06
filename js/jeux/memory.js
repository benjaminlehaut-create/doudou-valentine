// Jeu 1 : le Memory des doudous.
// 4 paires, puis 6. Une paire trouvée : le doudou fait coucou et la voix dit son nom.
// Une erreur n’est jamais sanctionnée : les cartes se retournent doucement.

import { doudousActifs, imageDoudou } from '../doudous.js';
import { dire, taire } from '../voix.js';
import { pop, carillon, fanfare, douceur } from '../sons.js';
import { gerbeSur, confettis } from '../recompense.js';
import { MAISON, OREILLE, REJOUER, SUIVANT } from '../icones.js';

const NIVEAUX = [4, 6];          // nombre de paires
const ATTENTE_ERREUR = 1500;     // temps pour bien voir deux cartes différentes (ms)
const DUREE_COUCOU = 1900;

export function ouvrirMemory(scene, { aller }) {
  scene.classList.add('ecran-memory');
  scene.innerHTML = `
    <div class="plateau"></div>
    <div class="barre">
      <button class="bouton-rond ecouter" aria-label="Réécouter la consigne">${OREILLE}</button>
      <button class="bouton-rond maison" aria-label="Accueil">${MAISON}</button>
    </div>
    <div class="coucou-centre"></div>
    <div class="fin cache"></div>`;

  const plateau = scene.querySelector('.plateau');
  const centre = scene.querySelector('.coucou-centre');
  const fin = scene.querySelector('.fin');

  let niveau = 0;
  let numeroPartie = 0;
  let actif = true;
  let minuteries = [];
  const plusTard = (fn, ms) => minuteries.push(setTimeout(fn, ms));
  const consigne = () => dire(niveau === 0 ? 'memory-consigne' : 'memory-consigne-2');

  scene.querySelector('.ecouter').addEventListener('click', () => { douceur(); consigne(); });
  scene.querySelector('.maison').addEventListener('click', () => { douceur(); aller('accueil'); });

  function nouvellePartie() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
    numeroPartie++;
    fin.classList.add('cache');
    centre.replaceChildren();

    const actifs = doudousActifs();
    const nbPaires = Math.min(NIVEAUX[niveau], actifs.length);
    const choisis = melanger([...actifs]).slice(0, nbPaires);
    const cartes = melanger([...choisis, ...choisis]);

    let premiere = null;
    let verrou = false;
    let trouvees = 0;

    plateau.replaceChildren();
    cartes.forEach((doudou, i) => {
      const carte = document.createElement('button');
      carte.className = 'carte';
      carte.style.setProperty('--i', i);
      carte.innerHTML = `<div class="interieur"><div class="dos"></div><div class="face"></div></div>`;
      carte.querySelector('.face').append(imageDoudou(doudou));
      carte.addEventListener('click', () => toucher(carte, doudou));
      plateau.append(carte);
    });
    disposer();

    function toucher(carte, doudou) {
      if (verrou || carte.classList.contains('retournee')) return;
      carte.classList.add('retournee');
      pop();

      if (!premiere) {
        premiere = { carte, doudou };
        return;
      }

      const autre = premiere;
      premiere = null;
      verrou = true;

      if (autre.doudou.id === doudou.id) {
        // Paire trouvée !
        plusTard(() => {
          // Les doudous retrouvés sautent de joie sur leurs cartes
          [autre.carte, carte].forEach((c) => {
            c.classList.add('trouvee');
            c.querySelector('.face').replaceChildren(imageDoudou(doudou, 'joie'));
          });
          carillon();
          gerbeSur(autre.carte, 8);
          gerbeSur(carte, 8);
          faireCoucou(doudou);
          trouvees++;
          plusTard(() => {
            verrou = false;
            if (trouvees === nbPaires) partieGagnee();
          }, DUREE_COUCOU);
        }, 450);
      } else {
        // Pas pareils : on retourne doucement, sans aucun reproche.
        plusTard(() => {
          autre.carte.classList.remove('retournee');
          carte.classList.remove('retournee');
          verrou = false;
        }, ATTENTE_ERREUR);
      }
    }

    consigne();
  }

  // Le doudou apparaît en grand au centre et fait coucou.
  function faireCoucou(doudou) {
    const grand = imageDoudou(doudou, 'coucou');
    grand.classList.add('coucou-grand');
    centre.replaceChildren(grand);
    dire('memory-paire', { nom: doudou.nom, id: doudou.id });
    plusTard(() => grand.classList.add('part'), DUREE_COUCOU - 350);
    plusTard(() => grand.remove(), DUREE_COUCOU);
  }

  function partieGagnee() {
    confettis();
    fanfare();
    plateau.querySelectorAll('.carte').forEach((c) => c.classList.add('danse'));
    const cettePartie = numeroPartie;
    dire('memory-gagne').then(() => {
      if (actif && cettePartie === numeroPartie) dire('memory-encore');
    });

    const dernierNiveau = niveau >= NIVEAUX.length - 1;
    fin.innerHTML = `
      ${dernierNiveau ? '' : `<button class="bouton-rond geant suivant" aria-label="Plus de cartes">${SUIVANT}</button>`}
      <button class="bouton-rond ${dernierNiveau ? 'geant' : ''} rejouer" aria-label="Rejouer">${REJOUER}</button>
      <button class="bouton-rond maison" aria-label="Accueil">${MAISON}</button>`;
    fin.querySelector('.suivant')?.addEventListener('click', () => { douceur(); niveau++; nouvellePartie(); });
    fin.querySelector('.rejouer').addEventListener('click', () => { douceur(); nouvellePartie(); });
    fin.querySelector('.maison').addEventListener('click', () => { douceur(); aller('accueil'); });
    plusTard(() => fin.classList.remove('cache'), 1200);
  }

  // Choisit la grille qui donne les plus grandes cartes (ex. 4×2, 6×2 ou 4×3).
  function disposer() {
    const n = plateau.children.length;
    if (!n) return;
    const largeur = plateau.clientWidth;
    const hauteur = plateau.clientHeight;
    const ecart = Math.max(8, Math.min(largeur, hauteur) * 0.03);
    const ratio = 0.8; // largeur / hauteur d’une carte
    let meilleur = { taille: 0, colonnes: n };
    for (let colonnes = 1; colonnes <= n; colonnes++) {
      if (n % colonnes) continue;
      const lignes = n / colonnes;
      const l = Math.min((largeur - ecart * (colonnes - 1)) / colonnes,
                         ((hauteur - ecart * (lignes - 1)) / lignes) * ratio);
      if (l > meilleur.taille) meilleur = { taille: l, colonnes };
    }
    plateau.style.setProperty('--colonnes', meilleur.colonnes);
    plateau.style.setProperty('--largeur', Math.floor(meilleur.taille) + 'px');
    plateau.style.setProperty('--ecart', Math.floor(ecart) + 'px');
  }

  window.addEventListener('resize', disposer);
  nouvellePartie();

  // Nettoyage quand on quitte le jeu
  return () => {
    actif = false;
    minuteries.forEach(clearTimeout);
    window.removeEventListener('resize', disposer);
    taire();
  };
}

function melanger(liste) {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }
  return liste;
}
