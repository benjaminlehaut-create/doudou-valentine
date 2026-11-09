// Les mots, images et sons du jeu des sons (pré-lecture, sans lecture).
// Chaque mot a une image dans assets/sons/<id>.png (format carré).

export const IMAGE = (id) => `assets/sons/${id}.png`;

// Niveau 1, les syllabes : combien de fois taper sur le tambour. « voix » = la prononciation
// découpée (des points de suspension créent une petite pause à l’oral).
export const MOTS_SYLLABES = {
  chat: { syllabes: 1, voix: 'Chat !' },
  pain: { syllabes: 1, voix: 'Pain !' },
  lit: { syllabes: 1, voix: 'Lit !' },
  oeuf: { syllabes: 1, voix: 'Œuf !' },
  pomme: { syllabes: 1, voix: 'Pomme !' },
  lapin: { syllabes: 2, voix: 'La… pin !' },
  gateau: { syllabes: 2, voix: 'Gâ… teau !' },
  tortue: { syllabes: 2, voix: 'Tor… tue !' },
  souris: { syllabes: 2, voix: 'Sou… ris !' },
  chocolat: { syllabes: 3, voix: 'Cho… co… lat !' },
  papillon: { syllabes: 3, voix: 'Pa… pi… llon !' },
  elephant: { syllabes: 3, voix: 'É… lé… phant !' },
  ananas: { syllabes: 3, voix: 'A… na… nas !' },
};

// Tous les mots-images disponibles comme distracteurs (niveaux 2 et 3).
export const TOUS_LES_MOTS = [
  'chat', 'pain', 'lit', 'oeuf', 'pomme', 'lapin', 'gateau', 'tortue', 'souris',
  'chocolat', 'papillon', 'elephant', 'ananas', 'rat', 'bateau', 'train', 'main',
  'serpent', 'maison', 'fusee', 'lune', 'cheval', 'renard',
];

// Niveau 2, les rimes.
export const RIMES = [
  { mot: 'chat', rime: 'rat' },
  { mot: 'lit', rime: 'souris' },
  { mot: 'gateau', rime: 'bateau' },
  { mot: 'main', rime: 'train' },
];

// Niveau 3, le son du début (des sons qu’on peut prolonger à l’oral : S, M, F, L, CH, R).
// « eviter » : d’autres mots qui commencent pareil, à ne jamais proposer comme distracteurs
// (sinon il y aurait deux bonnes réponses).
export const SONS_DEBUT = [
  { mot: 'serpent', voix: 'sssserpent', eviter: ['souris'] },
  { mot: 'maison', voix: 'mmmmaison', eviter: ['main'] },
  { mot: 'fusee', voix: 'ffffusée', eviter: [] },
  { mot: 'lune', voix: 'lllune', eviter: ['lit', 'lapin'] },
  { mot: 'cheval', voix: 'chchcheval', eviter: ['chat', 'chocolat'] },
  { mot: 'renard', voix: 'rrrrenard', eviter: ['rat'] },
];
