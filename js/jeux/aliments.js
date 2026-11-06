// Les aliments du pique-nique, dessinés en SVG (100 × 100).
// couleur : ce que dit la voix (« un fruit jaune »). un / le : avec l’article. pluriel / genre : pour compter.

export const ALIMENTS = {
  pomme: {
    couleur: 'rouge', un: 'une pomme rouge', le: 'la pomme rouge', singulier: 'pomme', pluriel: 'pommes', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 30 C34 18 10 26 12 52 C14 78 32 94 50 88 C68 94 86 78 88 52 C90 26 66 18 50 30 Z" fill="#ef4d5a"/>
      <path d="M50 30 Q52 16 58 8" stroke="#7a4a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M56 20 Q72 6 84 16 Q70 28 56 20 Z" fill="#6cc070"/>
      <ellipse cx="30" cy="44" rx="7" ry="12" fill="#fff" opacity=".45" transform="rotate(20 30 44)"/></svg>`,
  },
  banane: {
    couleur: 'jaune', un: 'une banane jaune', le: 'la banane jaune', singulier: 'banane', pluriel: 'bananes', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M18 30 C20 70 52 92 88 74 C90 70 88 66 84 66 C56 74 34 58 30 28 Z" fill="#ffd84a"/>
      <path d="M24 34 C30 62 52 76 80 70" stroke="#f0b92a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M16 30 L22 18 L30 26 Z" fill="#8a6a3a"/><circle cx="86" cy="70" r="4" fill="#6b4a2a"/></svg>`,
  },
  poire: {
    couleur: 'vert', un: 'une poire verte', le: 'la poire verte', singulier: 'poire', pluriel: 'poires', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 18 C40 18 38 34 36 42 C22 52 18 70 26 82 C34 94 66 94 74 82 C82 70 78 52 64 42 C62 34 60 18 50 18 Z" fill="#9ed36a"/>
      <path d="M50 20 Q50 10 54 4" stroke="#7a4a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M54 12 Q66 2 76 10 Q64 20 54 12 Z" fill="#5fb064"/>
      <ellipse cx="38" cy="64" rx="6" ry="11" fill="#fff" opacity=".4"/></svg>`,
  },
  orange: {
    couleur: 'orange', un: 'une orange', le: 'l’orange', singulier: 'orange', pluriel: 'oranges', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="36" fill="#ff9a2e"/>
      <circle cx="38" cy="44" r="2" fill="#f07d10"/><circle cx="60" cy="66" r="2" fill="#f07d10"/><circle cx="64" cy="46" r="2" fill="#f07d10"/><circle cx="42" cy="70" r="2" fill="#f07d10"/>
      <path d="M50 22 Q62 8 76 14 Q64 28 50 22 Z" fill="#5fb064"/>
      <ellipse cx="34" cy="48" rx="7" ry="11" fill="#fff" opacity=".4" transform="rotate(25 34 48)"/></svg>`,
  },
  raisin: {
    couleur: 'violet', un: 'du raisin violet', le: 'le raisin violet', singulier: 'grappe', pluriel: 'grappes', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 16 Q52 8 58 4" stroke="#7a4a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M54 12 Q70 4 78 14 Q64 22 54 12 Z" fill="#5fb064"/>
      ${[[38, 28], [54, 28], [70, 30], [30, 44], [46, 44], [62, 44], [38, 60], [54, 60], [46, 76]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="10" fill="#9b5fc8"/><circle cx="${x - 3}" cy="${y - 3}" r="3" fill="#fff" opacity=".45"/>`).join('')}</svg>`,
  },
  myrtilles: {
    couleur: 'bleu', un: 'des myrtilles bleues', le: 'les myrtilles bleues', singulier: 'myrtille', pluriel: 'myrtilles', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M10 54 H90 Q86 90 50 90 Q14 90 10 54 Z" fill="#fff4e6" stroke="#f2c9a8" stroke-width="3"/>
      ${[[30, 50], [48, 46], [66, 50], [38, 36], [58, 34]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="12" fill="#4f78d8"/><circle cx="${x}" cy="${y - 8}" r="3" fill="#2f4f9e"/><circle cx="${x - 4}" cy="${y - 2}" r="3" fill="#fff" opacity=".4"/>`).join('')}</svg>`,
  },
  fraise: {
    couleur: 'rouge', un: 'une fraise', le: 'la fraise', singulier: 'fraise', pluriel: 'fraises', genre: 'f',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 92 C30 80 14 56 18 38 C22 24 40 26 50 30 C60 26 78 24 82 38 C86 56 70 80 50 92 Z" fill="#f04e5e"/>
      ${[[34, 44], [50, 46], [66, 44], [40, 60], [58, 60], [50, 74], [30, 56], [70, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#ffe38a"/>`).join('')}
      <path d="M50 32 L36 18 L46 26 L50 12 L54 26 L64 18 Z" fill="#5fb064" stroke="#5fb064" stroke-width="4" stroke-linejoin="round"/></svg>`,
  },
  gateau: {
    couleur: 'marron', un: 'un gâteau', le: 'le gâteau', singulier: 'gâteau', pluriel: 'gâteaux', genre: 'm',
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="54" r="38" fill="#e3a65e"/><circle cx="50" cy="54" r="32" fill="#eeb873"/>
      ${[[36, 40], [60, 38], [46, 58], [68, 62], [34, 66], [54, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#6b3f22"/>`).join('')}</svg>`,
  },
};

// La teinte de chaque couleur, pour la bulle du doudou.
export const TEINTES = { rouge: '#ef4d5a', jaune: '#ffd23a', vert: '#86cc5e', orange: '#ff9a2e', violet: '#9b5fc8', bleu: '#4f78d8', marron: '#b9773e' };

// Aliments pour le jeu des couleurs : une couleur chacun.
export const COULEURS = ['pomme', 'banane', 'poire', 'orange', 'raisin', 'myrtilles'];
// Aliments pour compter.
export const A_COMPTER = ['fraise', 'gateau', 'pomme', 'banane', 'orange'];

const NOMBRES_F = ['', 'une', 'deux', 'trois', 'quatre', 'cinq'];
const NOMBRES_M = ['', 'un', 'deux', 'trois', 'quatre', 'cinq'];

export function nombre(n, genre) {
  return (genre === 'm' ? NOMBRES_M : NOMBRES_F)[n];
}

// « deux fraises », « un gâteau »
export function quantite(n, aliment) {
  return `${nombre(n, aliment.genre)} ${n > 1 ? aliment.pluriel : aliment.singulier}`;
}
