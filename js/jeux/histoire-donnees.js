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
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#c9ecd0"/><circle cx="50" cy="44" r="36" fill="#8fd09b"/><circle cx="28" cy="58" r="24" fill="#6db87c"/><circle cx="74" cy="58" r="24" fill="#78c086"/><rect x="44" y="66" width="12" height="34" rx="4" fill="#a8774f"/><circle cx="40" cy="36" r="5" fill="#ff8fab"/><circle cx="64" cy="30" r="5" fill="#fff3a6"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M14 52 Q14 14 50 12 Q86 14 86 52 Z" fill="#ef4d5a"/><circle cx="34" cy="34" r="7" fill="#fff"/><circle cx="60" cy="26" r="5" fill="#fff"/><circle cx="68" cy="42" r="6" fill="#fff"/><path d="M36 52 H64 V82 Q64 90 50 90 Q36 90 36 82 Z" fill="#fff4e6" stroke="#f2c9a8" stroke-width="3"/></svg>`,
  },
  plage: {
    nom: 'la plage', objet: 'coquillage', objets: 'coquillages', genre: 'm',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#bfe7fb"/><circle cx="72" cy="28" r="14" fill="#ffd36b"/><path d="M0 60 Q25 50 50 60 T100 60 V100 H0 Z" fill="#6cc4e8"/><path d="M0 78 Q25 70 50 78 T100 78 V100 H0 Z" fill="#f6dfb0"/><path d="M14 58 q6 -6 12 0 M60 56 q6 -6 12 0" stroke="#fff" stroke-width="3" fill="none"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 88 L14 40 Q30 12 50 12 Q70 12 86 40 Z" fill="#ffb3c9" stroke="#e98aa8" stroke-width="3" stroke-linejoin="round"/><path d="M50 88 L32 22 M50 88 L50 12 M50 88 L68 22 M50 88 L22 34 M50 88 L78 34" stroke="#e98aa8" stroke-width="3"/><rect x="40" y="82" width="20" height="10" rx="4" fill="#e98aa8"/></svg>`,
  },
  lune: {
    nom: 'la lune', objet: 'étoile', objets: 'étoiles', genre: 'f',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#3b3f7a"/><circle cx="50" cy="58" r="30" fill="#e9e4d4"/><circle cx="40" cy="50" r="6" fill="#cfc8b4"/><circle cx="60" cy="66" r="8" fill="#cfc8b4"/><circle cx="58" cy="44" r="4" fill="#cfc8b4"/><circle cx="18" cy="18" r="2" fill="#fff"/><circle cx="82" cy="22" r="2.5" fill="#fff"/><circle cx="28" cy="84" r="2" fill="#fff"/></svg>`,
    trouvaille: etoile,
  },
  chateau: {
    nom: 'le château de la princesse', objet: 'diamant', objets: 'diamants', genre: 'm',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#ffe1ec"/><rect x="22" y="40" width="56" height="50" fill="#c9b5f2"/><rect x="12" y="30" width="18" height="60" fill="#b8a4f0"/><rect x="70" y="30" width="18" height="60" fill="#b8a4f0"/>
      <path d="M10 30 L21 12 L32 30 Z M68 30 L79 12 L90 30 Z" fill="#ff8fab"/><path d="M38 40 L50 20 L62 40 Z" fill="#ff8fab"/><path d="M42 90 V72 Q50 62 58 72 V90 Z" fill="#8a6fd0"/><path d="M21 12 V4 l8 3 l-8 3" fill="#ffd36b" stroke="#ffd36b"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M24 14 H76 L94 38 L50 92 L6 38 Z" fill="#9ad0f5" stroke="#5aa6e0" stroke-width="3" stroke-linejoin="round"/><path d="M6 38 H94 M24 14 L38 38 L50 14 L62 38 L76 14 M38 38 L50 92 L62 38" stroke="#5aa6e0" stroke-width="2.5" fill="none"/><path d="M30 22 l4 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
  },
  neige: {
    nom: 'la montagne enneigée', objet: 'flocon', objets: 'flocons', genre: 'm',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#dcefff"/><path d="M0 90 L30 34 L50 62 L68 26 L100 90 Z" fill="#9db8d8"/><path d="M30 34 L22 50 L30 46 L38 50 Z M68 26 L58 46 L68 40 L78 46 Z" fill="#fff"/><path d="M0 100 V84 Q50 70 100 84 V100 Z" fill="#fff"/><circle cx="20" cy="20" r="2" fill="#fff"/><circle cx="84" cy="16" r="2.5" fill="#fff"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><g stroke="#7fc1f0" stroke-width="7" stroke-linecap="round"><path d="M50 8 V92 M14 29 L86 71 M14 71 L86 29"/></g><g stroke="#7fc1f0" stroke-width="5" stroke-linecap="round"><path d="M40 16 L50 26 L60 16 M40 84 L50 74 L60 84 M18 44 L30 38 L26 24 M82 56 L70 62 L74 76 M18 56 L30 62 L26 76 M82 44 L70 38 L74 24"/></g><circle cx="50" cy="50" r="8" fill="#fff" stroke="#7fc1f0" stroke-width="4"/></svg>`,
  },
  mer: {
    nom: 'le fond de la mer', objet: 'perle', objets: 'perles', genre: 'f',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#3f8fc8"/><path d="M0 86 Q50 74 100 86 V100 H0 Z" fill="#f6dfb0"/><path d="M18 90 Q10 70 20 56 Q28 70 22 90 M80 90 Q90 66 78 50 Q72 70 84 90" fill="#6cc070"/>
      <ellipse cx="50" cy="44" rx="14" ry="9" fill="#ffb02e"/><path d="M62 44 L74 36 V52 Z" fill="#ffb02e"/><circle cx="44" cy="42" r="2" fill="#1d2a40"/><circle cx="30" cy="20" r="3" fill="#cfeaf8"/><circle cx="36" cy="10" r="2" fill="#cfeaf8"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M8 62 Q8 30 50 26 Q92 30 92 62 Z" fill="#c9b5f2" stroke="#a58fd8" stroke-width="3"/><path d="M8 62 Q50 92 92 62 Z" fill="#b8a4f0" stroke="#a58fd8" stroke-width="3"/><circle cx="50" cy="56" r="14" fill="#fff"/><circle cx="45" cy="51" r="4" fill="#fff" opacity=".9"/><circle cx="50" cy="56" r="14" fill="url(#)" opacity="0"/></svg>`,
  },
  repaire: {
    nom: 'le repaire du dragon', objet: 'gemme', objets: 'gemmes', genre: 'f',
    dessin: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#3a2440"/><path d="M8 92 L38 28 L50 48 L64 14 L94 92 Z" fill="#6b4a7a"/><path d="M64 14 L54 36 L64 31 L74 36 Z" fill="#ff9a4a"/>
      <path d="M0 92 H100 V100 H0 Z" fill="#2a1830"/><circle cx="20" cy="18" r="2" fill="#ffd36b"/><circle cx="80" cy="26" r="2.5" fill="#ffd36b"/></svg>`,
    trouvaille: `<svg viewBox="0 0 100 100"><path d="M50 10 L80 34 L68 90 L32 90 L20 34 Z" fill="#ff8a5c" stroke="#e85a30" stroke-width="3" stroke-linejoin="round"/><path d="M20 34 H80 M32 90 L50 34 L68 90 M50 10 L32 34 M50 10 L68 34" stroke="#e85a30" stroke-width="2" fill="none"/><path d="M38 24 l4 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
  },
};

// --- 5. La rencontre : un petit animal (ou personnage) a perdu son ballon ---
export const ANIMAUX = {
  lapin: { nom: 'lapin', genre: 'm', svg: `<svg viewBox="0 0 100 100"><ellipse cx="38" cy="22" rx="8" ry="20" fill="#f1ece6"/><ellipse cx="62" cy="22" rx="8" ry="20" fill="#f1ece6"/><ellipse cx="38" cy="24" rx="4" ry="13" fill="#ffc2d2"/><ellipse cx="62" cy="24" rx="4" ry="13" fill="#ffc2d2"/>
    <ellipse cx="50" cy="76" rx="26" ry="20" fill="#f1ece6"/><circle cx="50" cy="50" r="20" fill="#f1ece6"/><circle cx="43" cy="48" r="3" fill="#2e2226"/><circle cx="57" cy="48" r="3" fill="#2e2226"/><ellipse cx="50" cy="56" rx="3" ry="2" fill="#ff8fab"/><circle cx="38" cy="56" r="4" fill="#ffc2d2" opacity=".7"/><circle cx="62" cy="56" r="4" fill="#ffc2d2" opacity=".7"/></svg>` },
  chaton: { nom: 'chaton', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M30 40 L32 16 L48 32 Z M70 40 L68 16 L52 32 Z" fill="#ffb877"/><ellipse cx="50" cy="76" rx="26" ry="20" fill="#ffb877"/><circle cx="50" cy="48" r="22" fill="#ffb877"/>
    <path d="M40 30 l4 8 M50 28 v8 M60 30 l-4 8" stroke="#e8904a" stroke-width="3" stroke-linecap="round"/><circle cx="42" cy="48" r="3" fill="#2e2226"/><circle cx="58" cy="48" r="3" fill="#2e2226"/><path d="M47 56 h6 l-3 3 z" fill="#ff8fab"/><path d="M34 56 h-12 M34 60 l-11 4 M66 56 h12 M66 60 l11 4" stroke="#e8904a" stroke-width="2"/></svg>` },
  herisson: { nom: 'hérisson', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M14 74 Q10 40 40 30 L36 22 L46 28 L48 18 L56 28 L62 20 L66 32 L76 28 L74 40 Q90 50 86 74 Z" fill="#8a6a50"/><ellipse cx="62" cy="68" rx="22" ry="18" fill="#e8c9a0"/>
    <circle cx="70" cy="62" r="3" fill="#2e2226"/><circle cx="84" cy="68" r="4" fill="#2e2226"/><circle cx="62" cy="70" r="4" fill="#ffc2d2" opacity=".7"/><ellipse cx="40" cy="88" rx="8" ry="4" fill="#8a6a50"/><ellipse cx="66" cy="88" rx="8" ry="4" fill="#8a6a50"/></svg>` },
  ecureuil: { nom: 'écureuil', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M70 90 Q100 70 88 36 Q80 14 64 22 Q80 40 70 60 Z" fill="#e0884a"/><ellipse cx="44" cy="74" rx="20" ry="18" fill="#f0a060"/><circle cx="42" cy="46" r="18" fill="#f0a060"/>
    <path d="M30 32 L28 18 L40 28 Z M54 32 L58 18 L46 28 Z" fill="#e0884a"/><ellipse cx="44" cy="78" rx="10" ry="10" fill="#ffe0c2"/><circle cx="36" cy="44" r="3" fill="#2e2226"/><circle cx="50" cy="44" r="3" fill="#2e2226"/><ellipse cx="43" cy="52" rx="3" ry="2" fill="#5a3020"/></svg>` },
  loup: { nom: 'loup', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M26 34 L16 12 L40 26 Z M74 34 L84 12 L60 26 Z" fill="#9aa6c0"/><path d="M28 32 L22 18 L38 28 Z M72 32 L78 18 L62 28 Z" fill="#7b88a8"/>
    <ellipse cx="50" cy="76" rx="26" ry="20" fill="#aab4cc"/><circle cx="50" cy="48" r="22" fill="#aab4cc"/><path d="M36 50 Q50 46 64 50 Q58 38 50 38 Q42 38 36 50 Z" fill="#e9ecf4"/>
    <circle cx="41" cy="46" r="3" fill="#2e2226"/><circle cx="59" cy="46" r="3" fill="#2e2226"/><path d="M47 58 h6 l-3 4 z" fill="#5e6b8a"/></svg>` },
  dragon: { nom: 'dragon', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M78 66 Q94 60 92 76 Q84 82 76 74 Z" fill="#6cc070"/><ellipse cx="50" cy="78" rx="28" ry="18" fill="#7fd0a0"/><circle cx="50" cy="48" r="22" fill="#8fd6ac"/>
    <path d="M30 30 Q36 16 44 28 Z M70 30 Q64 16 56 28 Z" fill="#5fae6e"/><path d="M46 24 Q50 12 54 24 Q50 18 46 24 Z" fill="#ffd36b"/>
    <circle cx="42" cy="46" r="3" fill="#2e2226"/><circle cx="58" cy="46" r="3" fill="#2e2226"/><ellipse cx="50" cy="57" rx="4" ry="2.5" fill="#e8904a"/></svg>` },
  renard: { nom: 'renard', genre: 'm', svg: `<svg viewBox="0 0 100 100"><path d="M26 34 L12 12 L40 28 Z M74 34 L88 12 L60 28 Z" fill="#e0884a"/><path d="M28 32 L20 18 L38 30 Z M72 32 L80 18 L62 30 Z" fill="#fff6ee"/>
    <ellipse cx="50" cy="78" rx="26" ry="18" fill="#e0884a"/><circle cx="50" cy="48" r="22" fill="#eb9c5e"/><path d="M36 56 Q50 68 64 56 Q50 62 36 56 Z" fill="#fff6ee"/>
    <circle cx="41" cy="46" r="3" fill="#2e2226"/><circle cx="59" cy="46" r="3" fill="#2e2226"/><path d="M47 54 h6 l-3 4 z" fill="#2e2226"/></svg>` },
  princesse: { nom: 'princesse', genre: 'f', svg: `<svg viewBox="0 0 100 100"><path d="M28 94 Q50 58 72 94 Z" fill="#c9b5f2"/><path d="M40 70 Q50 80 60 70 L64 94 H36 Z" fill="#b8a4f0"/>
    <circle cx="50" cy="50" r="20" fill="#ffe0c2"/><path d="M30 44 Q50 18 70 44 Q68 28 50 26 Q32 28 30 44 Z" fill="#8a5a3a"/>
    <path d="M38 22 L41 12 L45 20 L50 10 L55 20 L59 12 L62 22 Z" fill="#ffd36b" stroke="#f0b92a" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="43" cy="50" r="3" fill="#2e2226"/><circle cx="57" cy="50" r="3" fill="#2e2226"/><ellipse cx="50" cy="58" rx="3" ry="2" fill="#ff8fab"/></svg>` },
};

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

// --- Les grands décors des lieux (dessins larges, le sol en bas pour les personnages) ---
const arbre = (x, s, c) => `<g transform="translate(${x} ${120 - 60 * s}) scale(${s})"><rect x="-5" y="20" width="10" height="40" rx="3" fill="#a8774f"/><circle cx="0" cy="10" r="22" fill="${c}"/><circle cx="-14" cy="20" r="14" fill="${c}"/><circle cx="14" cy="20" r="14" fill="${c}"/></g>`;
const sapin = (x, s) => `<g transform="translate(${x} ${130 - 50 * s}) scale(${s})"><rect x="-4" y="36" width="8" height="14" fill="#8a6a50"/><path d="M0 -10 L22 38 H-22 Z" fill="#5f9e7a"/><path d="M0 -10 L10 12 Q0 16 -10 12 Z" fill="#fff"/></g>`;
const algue = (x, h, c) => `<path d="M${x} 150 Q${x - 8} ${150 - h / 2} ${x} ${150 - h} Q${x + 8} ${150 - h / 2} ${x + 4} 150 Z" fill="${c}"/>`;
const etoiles = Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 47) % 300}" cy="${(i * 29) % 90}" r="${i % 3 ? 0.9 : 1.6}" fill="#fff"/>`).join('');
export const DECORS = {
  foret: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#d6f0dc"/><circle cx="240" cy="28" r="16" fill="#fff6c9"/>
    <path d="M0 110 Q60 80 130 100 T300 92 V150 H0 Z" fill="#a6dcb0"/>${arbre(150, 1, '#6db87c')}${arbre(200, 1.25, '#78c086')}${arbre(258, 1.1, '#5fae6e')}${arbre(290, 0.8, '#6db87c')}
    <path d="M0 128 Q150 114 300 128 V150 H0 Z" fill="#8fd09b"/><circle cx="176" cy="132" r="3" fill="#ff8fab"/><circle cx="222" cy="138" r="3" fill="#fff3a6"/><circle cx="270" cy="134" r="3" fill="#ff8fab"/></svg>`,
  plage: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#cdeefc"/><circle cx="250" cy="30" r="18" fill="#ffd36b"/><circle cx="250" cy="30" r="26" fill="#ffd36b" opacity=".25"/>
    <path d="M0 78 H300 V108 H0 Z" fill="#6cc4e8"/><path d="M0 84 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    <path d="M0 104 Q150 94 300 104 V150 H0 Z" fill="#f6dfb0"/><path d="M226 104 V64" stroke="#8a6a50" stroke-width="3"/><path d="M196 70 Q226 44 256 70 Z" fill="#ff8fab"/><path d="M211 70 Q226 50 241 70" fill="#fff" opacity=".6"/></svg>`,
  lune: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#2d2f66"/>${etoiles}<circle cx="246" cy="34" r="14" fill="#6cb4f0"/><path d="M238 28 q6 -4 10 2 q4 8 -4 10" fill="#6cc070"/>
    <path d="M0 120 Q150 92 300 120 V150 H0 Z" fill="#e9e4d4"/><ellipse cx="180" cy="124" rx="16" ry="4" fill="#cfc8b4"/><ellipse cx="260" cy="132" rx="12" ry="3" fill="#cfc8b4"/><ellipse cx="60" cy="136" rx="10" ry="3" fill="#cfc8b4"/></svg>`,
  chateau: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#ffe1ec"/><circle cx="60" cy="24" r="10" fill="#fff"/><circle cx="76" cy="30" r="8" fill="#fff"/>
    <g transform="translate(150 22)"><rect x="20" y="40" width="80" height="70" fill="#c9b5f2"/><rect x="4" y="26" width="24" height="84" fill="#b8a4f0"/><rect x="92" y="26" width="24" height="84" fill="#b8a4f0"/>
    <path d="M2 26 L16 2 L30 26 Z M90 26 L104 2 L118 26 Z" fill="#ff8fab"/><path d="M42 40 L60 12 L78 40 Z" fill="#ff8fab"/><path d="M50 110 V86 Q60 74 70 86 V110 Z" fill="#8a6fd0"/><rect x="34" y="56" width="10" height="12" rx="5" fill="#fff6c9"/><rect x="76" y="56" width="10" height="12" rx="5" fill="#fff6c9"/></g>
    <path d="M0 126 Q150 116 300 126 V150 H0 Z" fill="#b8e3a6"/></svg>`,
  neige: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#dcefff"/><path d="M100 120 L170 34 L220 92 L250 60 L320 120 Z" fill="#9db8d8"/><path d="M170 34 L152 56 L170 50 L188 58 Z M250 60 L238 76 L250 72 L262 78 Z" fill="#fff"/>
    ${sapin(150, 1)}${sapin(270, 1.2)}${sapin(230, 0.8)}<path d="M0 122 Q150 108 300 122 V150 H0 Z" fill="#fff"/>
    ${Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 53) % 300}" cy="${(i * 37) % 110}" r="1.6" fill="#fff"/>`).join('')}</svg>`,
  mer: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="eau" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc0ea"/><stop offset="1" stop-color="#2f73b0"/></linearGradient></defs>
    <rect width="300" height="150" fill="url(#eau)"/><path d="M0 132 Q150 120 300 132 V150 H0 Z" fill="#f6dfb0"/>${algue(150, 50, '#6cc070')}${algue(166, 36, '#5fae6e')}${algue(280, 60, '#6cc070')}${algue(292, 40, '#ff8fab')}
    <g transform="translate(214 56)"><ellipse rx="16" ry="10" fill="#ffb02e"/><path d="M14 0 L26 -9 V9 Z" fill="#ffb02e"/><circle cx="-7" cy="-2" r="2.2" fill="#1d2a40"/></g>
    <circle cx="190" cy="40" r="3" fill="#cfeaf8"/><circle cx="196" cy="28" r="2" fill="#cfeaf8"/><circle cx="260" cy="20" r="2.5" fill="#cfeaf8"/></svg>`,
  repaire: `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect width="300" height="150" fill="#3a2440"/>
    <path d="M0 0 H300 V96 Q150 64 0 96 Z" fill="#5c3568"/><path d="M0 150 V96 Q150 64 300 96 V150 Z" fill="#2a1830"/>
    <path d="M0 150 Q150 130 300 150 Z" fill="#ff7a3c"/><path d="M46 150 Q56 126 66 150 M126 150 Q138 120 150 150 M210 150 Q222 128 234 150 M262 150 Q274 132 286 150" fill="#ffb366" opacity=".85"/>
    <path d="M20 96 L8 70 L28 68 Z M66 84 L56 60 L80 66 Z M250 90 L238 64 L262 68 Z M290 80 L280 56 L300 62 Z" fill="#2a1830"/>
    <circle cx="70" cy="30" r="7" fill="#ffd36b" opacity=".35"/><circle cx="240" cy="22" r="9" fill="#ffd36b" opacity=".25"/></svg>`,
};
