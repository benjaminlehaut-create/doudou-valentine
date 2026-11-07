// Les ingrédients de l’histoire de Valentine. Chaque histoire en pioche au hasard ou les fait choisir :
// des milliers de combinaisons. Pour enrichir l’histoire, il suffit d’ajouter des éléments ici
// (et leurs phrases dans data/phrases.json).

// --- 1. Comment l’aventure commence ---
export const DEBUTS = {
  carte: `<svg viewBox="0 0 120 100"><path d="M8 14 L40 6 L80 14 L112 6 V86 L80 94 L40 86 L8 94 Z" fill="#f6e3b4" stroke="#d8b778" stroke-width="3" stroke-linejoin="round"/><path d="M40 6 V86 M80 14 V94" stroke="#d8b778" stroke-width="2" opacity=".6"/>
    <path d="M20 74 Q36 50 52 62 T86 34" stroke="#c0704a" stroke-width="3" stroke-dasharray="6 6" fill="none"/><path d="M84 24 l10 10 M94 24 l-10 10" stroke="#ef4d5a" stroke-width="5" stroke-linecap="round"/></svg>`,
  lettre: `<svg viewBox="0 0 120 100"><rect x="10" y="20" width="100" height="66" rx="8" fill="#fff6ee" stroke="#e98aa8" stroke-width="3"/><path d="M10 26 L60 60 L110 26" fill="none" stroke="#e98aa8" stroke-width="3"/>
    <circle cx="60" cy="60" r="11" fill="#ef4d5a"/><path d="M60 66 C52 60 52 54 56 53 Q59 52 60 56 Q61 52 64 53 C68 54 68 60 60 66 Z" fill="#fff"/><path d="M96 8 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#ffd36b"/></svg>`,
  porte: `<svg viewBox="0 0 120 100"><rect x="14" y="6" width="92" height="90" rx="6" fill="#f2dcc2"/><path d="M38 94 V40 Q38 18 60 18 Q82 18 82 40 V94 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3"/>
    <circle cx="74" cy="60" r="4" fill="#b9773e"/><path d="M60 26 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#fff"/><path d="M28 30 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z M94 50 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z" fill="#fff3a6"/></svg>`,
  oiseau: `<svg viewBox="0 0 120 100"><rect x="8" y="8" width="104" height="84" rx="10" fill="#cfeaf8" stroke="#fff" stroke-width="6"/><path d="M60 8 V92 M8 50 H112" stroke="#fff" stroke-width="5"/>
    <ellipse cx="62" cy="58" rx="22" ry="17" fill="#4f9be0"/><circle cx="80" cy="46" r="11" fill="#4f9be0"/><circle cx="83" cy="44" r="2.6" fill="#1d2a40"/><path d="M90 46 l9 2 l-9 3 z" fill="#ffb02e"/>
    <path d="M52 52 Q40 40 30 50 Q42 54 52 62 Z" fill="#7fc1f0"/><path d="M42 66 l-10 6 M48 70 l-6 8" stroke="#ffb02e" stroke-width="3" stroke-linecap="round"/></svg>`,
  graine: `<svg viewBox="0 0 120 100"><path d="M60 94 V40" stroke="#6cc070" stroke-width="5"/><path d="M60 60 Q40 50 34 30 Q54 34 60 54 Q66 34 86 30 Q80 50 60 60 Z" fill="#8fd09b"/>
    <ellipse cx="60" cy="88" rx="16" ry="8" fill="#a8774f"/><circle cx="60" cy="18" r="10" fill="#ffd36b" stroke="#f0b92a" stroke-width="3"/><path d="M60 8 v6 M52 12 l4 5 M68 12 l-4 5" stroke="#ffd36b" stroke-width="3" stroke-linecap="round"/></svg>`,
  filante: `<svg viewBox="0 0 120 100"><path d="M20 20 L90 70" stroke="#ffd36b" stroke-width="3" stroke-dasharray="2 6" opacity=".7"/><path d="M90 70 L104 62 L100 78 L116 74 L96 90 L90 70 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="20" cy="20" r="7" fill="#fff6c9"/><path d="M8 20 h8 M20 8 v8 M12 12 l6 6" stroke="#fff6c9" stroke-width="2.5" stroke-linecap="round"/></svg>`,
};

// --- 3. Le moyen de transport ---
export const TRANSPORTS = {
  velo: { nom: 'vélo', svg: `<svg viewBox="0 0 120 80"><circle cx="28" cy="56" r="18" fill="none" stroke="#5e6b8a" stroke-width="6"/><circle cx="92" cy="56" r="18" fill="none" stroke="#5e6b8a" stroke-width="6"/>
    <path d="M28 56 L50 26 L82 26 L92 56 M50 26 L62 56 L82 26 M44 16 H58 M82 26 L78 12 H90" fill="none" stroke="#ef4d5a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="62" cy="56" r="5" fill="#5e6b8a"/></svg>` },
  montgolfiere: { nom: 'montgolfière', svg: `<svg viewBox="0 0 100 120"><path d="M50 6 Q90 6 90 46 Q90 70 60 86 H40 Q10 70 10 46 Q10 6 50 6 Z" fill="#ff8fab"/><path d="M50 6 Q66 6 68 46 Q66 70 56 86 H44 Q34 70 32 46 Q34 6 50 6 Z" fill="#ffd36b"/>
    <path d="M42 86 L40 100 M58 86 L60 100" stroke="#b9773e" stroke-width="3"/><rect x="36" y="98" width="28" height="18" rx="4" fill="#b9773e"/></svg>` },
  bateau: { nom: 'bateau', svg: `<svg viewBox="0 0 120 90"><path d="M58 6 V60" stroke="#8a6a3a" stroke-width="5"/><path d="M62 10 L100 56 H62 Z" fill="#fff" stroke="#cfe3f2" stroke-width="3"/><path d="M54 18 L24 56 H54 Z" fill="#ffb3c9"/>
    <path d="M10 62 H110 L96 84 H24 Z" fill="#ef4d5a"/><circle cx="44" cy="72" r="4" fill="#fff"/><circle cx="62" cy="72" r="4" fill="#fff"/><circle cx="80" cy="72" r="4" fill="#fff"/></svg>` },
  fusee: { nom: 'fusée', svg: `<svg viewBox="0 0 80 120"><path d="M40 4 Q66 26 64 74 H16 Q14 26 40 4 Z" fill="#fff" stroke="#cfd6e8" stroke-width="3"/><circle cx="40" cy="44" r="11" fill="#9ad0f5" stroke="#5e6b8a" stroke-width="4"/>
    <path d="M16 56 L2 84 L16 80 Z M64 56 L78 84 L64 80 Z" fill="#ef4d5a"/><path d="M24 76 H56 L50 88 H30 Z" fill="#5e6b8a"/><path d="M32 90 Q40 116 48 90 Z" fill="#ffb02e"/><path d="M36 90 Q40 106 44 90 Z" fill="#ffe38a"/></svg>` },
  train: { nom: 'train', svg: `<svg viewBox="0 0 130 80"><rect x="6" y="30" width="58" height="34" rx="6" fill="#4f9be0"/><rect x="40" y="10" width="24" height="24" rx="4" fill="#4f9be0"/><rect x="12" y="20" width="10" height="12" fill="#5e6b8a"/>
    <rect x="44" y="14" width="16" height="12" rx="2" fill="#cfeaf8"/><rect x="70" y="34" width="54" height="30" rx="6" fill="#ffb3c9"/><rect x="78" y="40" width="14" height="12" rx="2" fill="#fff"/><rect x="100" y="40" width="14" height="12" rx="2" fill="#fff"/>
    <circle cx="20" cy="68" r="8" fill="#5e6b8a"/><circle cx="50" cy="68" r="8" fill="#5e6b8a"/><circle cx="84" cy="68" r="8" fill="#5e6b8a"/><circle cx="110" cy="68" r="8" fill="#5e6b8a"/><circle cx="10" cy="12" r="6" fill="#fff" opacity=".8"/></svg>` },
  carrosse: { nom: 'carrosse', svg: `<svg viewBox="0 0 130 90"><path d="M30 50 Q30 24 65 24 Q100 24 100 50 V66 H30 Z" fill="#c9b5f2" stroke="#a58fd8" stroke-width="3"/>
    <circle cx="46" cy="66" r="14" fill="#ffd36b" stroke="#f0b92a" stroke-width="4"/><circle cx="84" cy="66" r="14" fill="#ffd36b" stroke="#f0b92a" stroke-width="4"/>
    <path d="M65 24 V10" stroke="#f0b92a" stroke-width="3"/><path d="M65 4 l3 6 l6 1 l-6 3 l-1 6 l-2 -6 l-6 -3 l6 -1 z" fill="#ffd36b"/></svg>` },
  tapis: { nom: 'tapis volant', svg: `<svg viewBox="0 0 130 80"><path d="M10 50 Q65 26 120 50 Q65 60 10 50 Z" fill="#9b5fc8" stroke="#7a3fae" stroke-width="3"/>
    <path d="M20 50 Q65 36 110 50" stroke="#ffd36b" stroke-width="3" fill="none"/><circle cx="30" cy="48" r="3" fill="#ffd36b"/><circle cx="65" cy="42" r="3" fill="#ffd36b"/><circle cx="100" cy="48" r="3" fill="#ffd36b"/></svg>` },
};

// --- 4. Le lieu de l’aventure, et ce qu’on y ramasse ---
const etoile = `<svg viewBox="0 0 100 100"><path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="44" r="4" fill="#5a4030"/><circle cx="60" cy="44" r="4" fill="#5a4030"/><path d="M42 56 q8 8 16 0" stroke="#5a4030" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
export const LIEUX = {
  foret: {
    nom: 'la forêt enchantée', objet: 'champignon', objets: 'champignons', genre: 'm',
    dessin: `<img src="assets/decors/histoire/foret.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M14 52 Q14 14 50 12 Q86 14 86 52 Z" fill="#ef4d5a"/><circle cx="34" cy="34" r="7" fill="#fff"/><circle cx="60" cy="26" r="5" fill="#fff"/><circle cx="68" cy="42" r="6" fill="#fff"/><path d="M36 52 H64 V82 Q64 90 50 90 Q36 90 36 82 Z" fill="#fff4e6" stroke="#f2c9a8" stroke-width="3"/></svg>`,
  },
  plage: {
    nom: 'la plage', objet: 'coquillage', objets: 'coquillages', genre: 'm',
    dessin: `<img src="assets/decors/histoire/plage.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 88 L14 40 Q30 12 50 12 Q70 12 86 40 Z" fill="#ffb3c9" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/><path d="M50 88 L32 22 M50 88 L50 12 M50 88 L68 22 M50 88 L22 34 M50 88 L78 34" stroke="#e98aa8" stroke-width="3"/><rect x="40" y="82" width="20" height="10" rx="4" fill="#e98aa8"/></svg>`,
  },
  lune: {
    nom: 'la lune', objet: 'étoile', objets: 'étoiles', genre: 'f',
    dessin: `<img src="assets/decors/histoire/lune.jpg" alt="">`,
    trouvaille: etoile,
  },
  chateau: {
    nom: 'le château de la princesse', objet: 'diamant', objets: 'diamants', genre: 'm',
    dessin: `<img src="assets/decors/histoire/chateau.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M24 14 H76 L94 38 L50 92 L6 38 Z" fill="#9ad0f5" stroke="#5aa6e0" stroke-width="3" stroke-linejoin="round"/><path d="M6 38 H94 M24 14 L38 38 L50 14 L62 38 L76 14 M38 38 L50 92 L62 38" stroke="#5aa6e0" stroke-width="2.5" fill="none"/><path d="M30 22 l4 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
  },
  neige: {
    nom: 'la montagne enneigée', objet: 'flocon', objets: 'flocons', genre: 'm',
    dessin: `<img src="assets/decors/histoire/neige.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><g stroke="#7fc1f0" stroke-width="7" stroke-linecap="round"><path d="M50 8 V92 M14 29 L86 71 M14 71 L86 29"/></g><g stroke="#7fc1f0" stroke-width="5" stroke-linecap="round"><path d="M40 16 L50 26 L60 16 M40 84 L50 74 L60 84 M18 44 L30 38 L26 24 M82 56 L70 62 L74 76 M18 56 L30 62 L26 76 M82 44 L70 38 L74 24"/></g><circle cx="50" cy="50" r="8" fill="#fff" stroke="#7fc1f0" stroke-width="4"/></svg>`,
  },
  mer: {
    nom: 'le fond de la mer', objet: 'perle', objets: 'perles', genre: 'f',
    dessin: `<img src="assets/decors/histoire/mer.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M8 62 Q8 30 50 26 Q92 30 92 62 Z" fill="#c9b5f2" stroke="#a58fd8" stroke-width="3"/><path d="M8 62 Q50 92 92 62 Z" fill="#b8a4f0" stroke="#a58fd8" stroke-width="3"/><circle cx="50" cy="56" r="14" fill="#fff"/><circle cx="45" cy="51" r="4" fill="#fff" opacity=".9"/><circle cx="50" cy="56" r="14" fill="url(#)" opacity="0"/></svg>`,
  },
  repaire: {
    nom: 'le repaire du dragon', objet: 'gemme', objets: 'gemmes', genre: 'f',
    dessin: `<img src="assets/decors/histoire/repaire.jpg" alt="">`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 10 L80 34 L68 90 L32 90 L20 34 Z" fill="#ff8a5c" stroke="#e85a30" stroke-width="3" stroke-linejoin="round"/><path d="M20 34 H80 M32 90 L50 34 L68 90 M50 10 L32 34 M50 10 L68 34" stroke="#e85a30" stroke-width="2" fill="none"/><path d="M38 24 l4 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
  },
};

// --- 5. La rencontre : un petit animal (ou personnage) a perdu son ballon ---
export const ANIMAUX = {
  lapin: { nom: 'lapin', genre: 'm', image: 'assets/personnages/lapin.png' },
  chaton: { nom: 'chaton', genre: 'm', image: 'assets/personnages/chaton.png' },
  herisson: { nom: 'hérisson', genre: 'm', image: 'assets/personnages/herisson.png' },
  ecureuil: { nom: 'écureuil', genre: 'm', image: 'assets/personnages/ecureuil.png' },
  loup: { nom: 'loup', genre: 'm', image: 'assets/personnages/loup.png' },
  dragon: { nom: 'dragon', genre: 'm', image: 'assets/personnages/dragon.png' },
  renard: { nom: 'renard', genre: 'm', image: 'assets/personnages/renard.png' },
  princesse: { nom: 'princesse', genre: 'f', image: 'assets/personnages/princesse.png' },
};

// --- 6. Un obstacle sur le chemin : un petit geste pour le dégager (pas un choix, pour varier) ---
export const OBSTACLES = {
  rocher: { nom: 'un énorme rocher', svg: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="90" rx="50" ry="8" fill="#00000018"/><path d="M20 80 Q10 50 30 34 Q24 14 50 14 Q70 8 86 24 Q106 28 104 52 Q112 70 92 82 Q70 94 44 90 Q28 92 20 80 Z" fill="#9a8f82" stroke="#7a7266" stroke-width="3"/>
    <path d="M40 30 Q50 44 44 58 M70 24 Q66 40 76 50" stroke="#7a7266" stroke-width="3" fill="none" opacity=".6"/></svg>` },
  buisson: { nom: 'un buisson tout emmêlé', svg: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="92" rx="50" ry="6" fill="#00000018"/><circle cx="40" cy="60" r="34" fill="#6db87c"/><circle cx="72" cy="56" r="30" fill="#78c086"/><circle cx="56" cy="40" r="28" fill="#8fd09b"/>
    <circle cx="34" cy="48" r="4" fill="#ff8fab"/><circle cx="68" cy="36" r="4" fill="#fff3a6"/><circle cx="84" cy="58" r="4" fill="#ff8fab"/></svg>` },
  flaque: { nom: 'une flaque qui scintille', svg: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="70" rx="56" ry="24" fill="#6fc0ea"/><ellipse cx="60" cy="70" rx="40" ry="15" fill="#8fd4f2" opacity=".6"/>
    <path d="M30 62 q8 -6 16 0 M70 60 q8 -6 16 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></svg>` },
};

// Un deuxième type de petit défi, pour que l’aventure ne soit pas toujours pareille :
// plusieurs chemins possibles, il faut trouver celui décoré de la bonne couleur.
export function chemin(teinte) {
  return `<svg viewBox="0 0 100 100"><path d="M20 90 Q46 60 20 40 Q-4 20 30 10" stroke="#d8b778" stroke-width="14" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="10" r="7" fill="${teinte}"/><circle cx="16" cy="42" r="6" fill="${teinte}"/><circle cx="22" cy="78" r="6" fill="${teinte}"/></svg>`;
}

// Les ballons (une couleur chacun)
export const BALLONS = { rouge: '#ef4d5a', bleu: '#4f9be0', jaune: '#ffd23a', vert: '#6cc070' };
export function ballon(teinte) {
  return `<svg viewBox="0 0 60 100"><ellipse cx="30" cy="32" rx="24" ry="28" fill="${teinte}"/><path d="M26 60 h8 l-4 5 z" fill="${teinte}"/><ellipse cx="22" cy="22" rx="6" ry="9" fill="#fff" opacity=".45"/>
    <path d="M30 64 Q24 76 32 86 Q38 94 30 100" stroke="#8a8a9a" stroke-width="2" fill="none"/></svg>`;
}

// --- 7. Les clés du coffre, et les trésors ---
export const CLES = { doree: '#ffd23a', argent: '#c9d3e8', rose: '#ff8fab' };
export function cle(teinte) {
  return `<svg viewBox="0 0 100 100"><circle cx="30" cy="34" r="20" fill="none" stroke="${teinte}" stroke-width="10"/><path d="M44 48 L86 90 M66 70 L76 60 M76 80 L86 70" stroke="${teinte}" stroke-width="10" stroke-linecap="round"/><circle cx="30" cy="34" r="20" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="2"/></svg>`;
}
export const COFFRE = `<svg viewBox="0 0 120 100"><rect x="10" y="44" width="100" height="50" rx="8" fill="#b9773e"/><path d="M8 48 Q8 12 60 12 Q112 12 112 48 Z" fill="#cf8a4b" class="couvercle"/>
  <rect x="10" y="44" width="100" height="10" fill="#ffd36b"/><rect x="52" y="40" width="16" height="22" rx="4" fill="#ffd36b"/><circle cx="60" cy="52" r="3" fill="#7a4a22"/>
  <path d="M30 12 V94 M90 12 V94" stroke="#ffd36b" stroke-width="6"/></svg>`;
export const TRESORS = {
  couronne: { nom: 'une couronne magique', svg: `<svg viewBox="0 0 100 100"><path d="M18 70 L24 30 L40 50 L50 22 L60 50 L76 30 L82 70 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3" stroke-linejoin="round"/><rect x="18" y="68" width="64" height="12" rx="4" fill="#f0b92a"/><circle cx="50" cy="20" r="5" fill="#ff8fab"/><circle cx="24" cy="28" r="4" fill="#9ad0f5"/><circle cx="76" cy="28" r="4" fill="#8fd6a8"/><circle cx="50" cy="74" r="4" fill="#ff8fab"/></svg>` },
  baguette: { nom: 'une baguette de fée', svg: `<svg viewBox="0 0 100 100"><path d="M24 88 L58 46" stroke="#c9b5f2" stroke-width="8" stroke-linecap="round"/><path d="M66 8 L74 28 L96 30 L79 44 L85 66 L66 54 L47 66 L53 44 L36 30 L58 28 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="40" r="3" fill="#ff8fab"/><circle cx="40" cy="22" r="2.5" fill="#9ad0f5"/></svg>` },
  gateau: { nom: 'un gâteau géant au chocolat', svg: `<svg viewBox="0 0 100 100"><rect x="16" y="48" width="68" height="40" rx="8" fill="#8a5a3a"/><path d="M16 56 Q24 64 32 56 T48 56 T64 56 T84 56 V48 H16 Z" fill="#fff6ee"/><rect x="46" y="22" width="8" height="26" rx="3" fill="#ff8fab"/><path d="M50 8 Q58 16 50 22 Q42 16 50 8 Z" fill="#ffb02e"/><circle cx="30" cy="72" r="4" fill="#ef4d5a"/><circle cx="70" cy="72" r="4" fill="#ef4d5a"/></svg>` },
  collier: { nom: 'un collier de perles arc-en-ciel', svg: `<svg viewBox="0 0 100 100"><path d="M14 22 Q50 96 86 22" stroke="#e8e8f0" stroke-width="3" fill="none"/>${['#ef4d5a', '#ff9a2e', '#ffd23a', '#6cc070', '#4f9be0', '#9b5fc8', '#ff8fab'].map((c, i) => { const t = (i + 1) / 8; const x = 14 + 72 * t; const y = 22 + 4 * 74 * t * (1 - t) * 1.3; return `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`; }).join('')}</svg>` },
  licorne: { nom: 'une petite licorne en peluche', svg: `<svg viewBox="0 0 100 100"><ellipse cx="54" cy="70" rx="30" ry="20" fill="#fff" stroke="#e8e0f4" stroke-width="3"/><circle cx="34" cy="44" r="18" fill="#fff" stroke="#e8e0f4" stroke-width="3"/><path d="M30 28 L40 4 L42 28 Z" fill="#ffd36b"/>
    <path d="M44 30 Q62 26 66 46 Q56 40 48 42 Z" fill="#ff8fab"/><path d="M46 36 Q66 40 64 58 Q56 48 48 48 Z" fill="#c9b5f2"/><circle cx="28" cy="44" r="3" fill="#2e2226"/><circle cx="22" cy="52" r="3" fill="#ffc2d2"/><path d="M34 86 v10 M70 86 v10" stroke="#e8e0f4" stroke-width="6" stroke-linecap="round"/></svg>` },
  epee: { nom: 'une épée magique', svg: `<svg viewBox="0 0 100 100"><path d="M50 10 L56 70 L50 80 L44 70 Z" fill="#c9d3e8" stroke="#9aa6c0" stroke-width="2"/><rect x="30" y="66" width="40" height="8" rx="3" fill="#ffd36b"/><rect x="46" y="74" width="8" height="20" rx="3" fill="#b9773e"/><circle cx="50" cy="94" r="6" fill="#ffd36b"/></svg>` },
  oeuf: { nom: 'un œuf de dragon qui scintille', svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="30" ry="38" fill="#8fd6ac" stroke="#5fae6e" stroke-width="3"/><path d="M34 30 Q50 44 40 60 M66 26 Q54 42 64 56" stroke="#5fae6e" stroke-width="3" fill="none"/><circle cx="50" cy="20" r="4" fill="#ffd36b"/></svg>` },
};

// --- 8. Comment ça finit ---
export const FINS = ['dodo', 'fete', 'maman'];

// --- Les grands décors des lieux : vraies photos, posées en CSS/<img> derrière les personnages ---
export const DECORS = {
  foret: `<img src="assets/decors/histoire/foret.jpg" alt="">`,
  plage: `<img src="assets/decors/histoire/plage.jpg" alt="">`,
  lune: `<img src="assets/decors/histoire/lune.jpg" alt="">`,
  chateau: `<img src="assets/decors/histoire/chateau.jpg" alt="">`,
  neige: `<img src="assets/decors/histoire/neige.jpg" alt="">`,
  mer: `<img src="assets/decors/histoire/mer.jpg" alt="">`,
  repaire: `<img src="assets/decors/histoire/repaire.jpg" alt="">`,
};
