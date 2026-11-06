// Petits sons synthétisés (aucun fichier nécessaire).

import { reglages } from './reglages.js';

let contexte = null;

// À appeler lors d’un toucher : iPad et iPhone n’autorisent le son qu’après un geste.
export function debloquerSons() {
  try {
    contexte = contexte || new (window.AudioContext || window.webkitAudioContext)();
    if (contexte.state === 'suspended') contexte.resume();
  } catch { contexte = null; }
}

function note(frequence, debut, duree, { type = 'sine', volume = 0.3 } = {}) {
  if (!contexte) return;
  const t = contexte.currentTime + debut;
  const oscillateur = contexte.createOscillator();
  const gain = contexte.createGain();
  const fort = Math.max(volume * reglages.volumeSons, 0.0001);
  oscillateur.type = type;
  oscillateur.frequency.value = frequence;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(fort, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  oscillateur.connect(gain).connect(contexte.destination);
  oscillateur.start(t);
  oscillateur.stop(t + duree + 0.05);
}

// Carte qui se retourne
export function pop() {
  if (!contexte) return;
  const t = contexte.currentTime;
  const o = contexte.createOscillator();
  const g = contexte.createGain();
  o.frequency.setValueAtTime(380, t);
  o.frequency.exponentialRampToValueAtTime(820, t + 0.09);
  g.gain.setValueAtTime(Math.max(0.22 * reglages.volumeSons, 0.0001), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g).connect(contexte.destination);
  o.start(t);
  o.stop(t + 0.2);
}

// Petit toucher (bouton, doudou)
export function douceur() {
  note(660, 0, 0.3, { volume: 0.14 });
  note(990, 0.06, 0.3, { volume: 0.08 });
}

// Paire trouvée
export function carillon() {
  [784, 988, 1175, 1568].forEach((f, i) => {
    note(f, i * 0.09, 0.9, { volume: 0.2 });
    note(f * 2, i * 0.09, 0.4, { volume: 0.04 });
  });
}

// Partie gagnée
export function fanfare() {
  const melodie = [523, 659, 784, 1047, 784, 1047, 1319];
  melodie.forEach((f, i) => note(f, i * 0.14, 0.5, { type: 'triangle', volume: 0.22 }));
  note(1568, melodie.length * 0.14, 1.4, { volume: 0.16 });
  note(784, melodie.length * 0.14, 1.4, { volume: 0.12 });
}
