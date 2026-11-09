// Les pots de peinture et les objets à peindre de l'atelier.

// Niveau 1-2 : rouge, jaune, bleu. Niveau 3 : on ajoute blanc et noir.
export const POTS = { rouge: '#ef4d5a', jaune: '#ffd23a', bleu: '#4f78d8', blanc: '#ffffff', noir: '#3a3a3a' };

// Les recettes connues : toujours deux pots, jamais plus.
export const RECETTES = [
  { a: 'jaune', b: 'bleu', resultat: 'vert' },
  { a: 'rouge', b: 'jaune', resultat: 'orange' },
  { a: 'rouge', b: 'bleu', resultat: 'violet' },
  { a: 'rouge', b: 'blanc', resultat: 'rose' },
  { a: 'noir', b: 'blanc', resultat: 'gris' },
  { a: 'rouge', b: 'noir', resultat: 'marron' },
];

export const TEINTES_RESULTAT = {
  vert: '#6cc070', orange: '#ff9a2e', violet: '#9b5fc8', rose: '#ff8fab', gris: '#aab0bd', marron: '#8a5a3a',
};

// La recette qui correspond à ces deux pots, dans n'importe quel ordre (ou rien, pour une
// combinaison pas encore prévue : le bol fait alors un mélange tout simple, à la louche).
export function trouverRecette(p1, p2) {
  return RECETTES.find((r) => (r.a === p1 && r.b === p2) || (r.a === p2 && r.b === p1));
}

export function melangeParDefaut(id1, id2) {
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, v1, b1] = hex(POTS[id1]);
  const [r2, v2, b2] = hex(POTS[id2]);
  const moy = (x, y) => Math.round((x + y) / 2).toString(16).padStart(2, '0');
  return `#${moy(r1, r2)}${moy(v1, v2)}${moy(b1, b2)}`;
}

// Les objets à peindre, en SVG, pour changer leur couleur en direct (pas de PNG figé possible).
export const OBJETS = {
  pull: { nom: 'pull', le: 'le pull', svg: (t) => `<svg viewBox="0 0 100 100"><path d="M20 30 L7 43 L22 56 L30 47 V90 H70 V47 L78 56 L93 43 L80 30 L63 17 H37 Z" fill="${t}" stroke="#0002" stroke-width="2.5" stroke-linejoin="round"/></svg>` },
  echarpe: { nom: 'écharpe', le: 'l’écharpe', svg: (t) => `<svg viewBox="0 0 100 100"><path d="M8 18 Q50 40 92 18 V32 Q50 52 8 32 Z" fill="${t}" stroke="#0002" stroke-width="2.5"/><rect x="40" y="30" width="20" height="60" rx="7" fill="${t}" stroke="#0002" stroke-width="2.5"/></svg>` },
  chapeau: { nom: 'chapeau', le: 'le chapeau', svg: (t) => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="80" rx="44" ry="9" fill="${t}" stroke="#0002" stroke-width="2.5"/><path d="M28 80 Q28 28 50 24 Q72 28 72 80 Z" fill="${t}" stroke="#0002" stroke-width="2.5"/></svg>` },
  ballon: { nom: 'ballon', le: 'le ballon', svg: (t) => `<svg viewBox="0 0 100 100"><path d="M50 8 C24 8 16 32 20 50 C24 72 40 82 50 88 C60 82 76 72 80 50 C84 32 76 8 50 8 Z" fill="${t}" stroke="#0002" stroke-width="2.5"/><path d="M50 88 Q55 94 50 100 Q45 94 50 88" fill="none" stroke="#8a6a3a" stroke-width="2.5"/></svg>` },
  parapluie: { nom: 'parapluie', le: 'le parapluie', svg: (t) => `<svg viewBox="0 0 100 100"><path d="M6 46 Q50 6 94 46 Q94 34 50 34 Q6 34 6 46 Z" fill="${t}" stroke="#0002" stroke-width="2.5"/><rect x="47" y="44" width="6" height="46" fill="#8a6a3a"/><path d="M47 90 Q38 94 43 86" fill="none" stroke="#8a6a3a" stroke-width="4.5" stroke-linecap="round"/></svg>` },
  fleur: { nom: 'fleur', le: 'la fleur', svg: (t) => `<svg viewBox="0 0 100 100">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="50" cy="30" rx="14" ry="20" fill="${t}" stroke="#0002" stroke-width="2" transform="rotate(${a} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="11" fill="#ffd23a"/><rect x="47" y="58" width="6" height="34" fill="#5fb064"/></svg>` },
};
