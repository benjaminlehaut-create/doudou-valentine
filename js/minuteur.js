// Durée de jeu (réglée dans le menu parent). Le temps n’est compté que lorsque l’app est à l’écran.
// Après une heure sans utilisation, le compteur repart de zéro.

import { reglages } from './reglages.js';

const CLE = 'doudous-minuteur';
const OUBLI = 60 * 60 * 1000;

let etat = lire();

function lire() {
  try { return JSON.parse(localStorage.getItem(CLE)) || { utilise: 0, dernier: 0 }; }
  catch { return { utilise: 0, dernier: 0 }; }
}

function ecrire() {
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* rien */ }
}

export function remettreMinuteur() {
  etat = { utilise: 0, dernier: Date.now() };
  ecrire();
}

// En millisecondes ; Infinity si aucune limite.
export function tempsRestant() {
  if (!reglages.dureeMax) return Infinity;
  return reglages.dureeMax * 60000 - etat.utilise;
}

// Appelle « verifier » toutes les 5 secondes.
export function demarrerMinuteur(verifier) {
  if (Date.now() - etat.dernier > OUBLI) remettreMinuteur();
  let precedent = Date.now();
  setInterval(() => {
    const maintenant = Date.now();
    if (document.visibilityState === 'visible') {
      if (maintenant - etat.dernier > OUBLI) remettreMinuteur();
      etat.utilise += Math.min(maintenant - precedent, 10000);
      etat.dernier = maintenant;
      ecrire();
    }
    precedent = maintenant;
    verifier();
  }, 5000);
}
