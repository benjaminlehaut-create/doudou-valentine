// Les mots, images et sons du jeu des sons (pré-lecture, sans lecture).
// Chaque mot a une image dans assets/sons/<id>.png (format carré).

export const IMAGE = (id) => `assets/sons/${id}.png`;

// Niveau 4, le bonus prénom : les mots à reconstituer, lettre par lettre.
export const MOTS_A_ECRIRE = ['VALENTINE', 'MAMAN', 'PAPA', 'MARGAUX'];

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
  'soleil', 'mouton', 'fleur', 'chapeau', 'robot',
];

// Niveau 2, les rimes.
export const RIMES = [
  { mot: 'chat', rime: 'rat' },
  { mot: 'lit', rime: 'souris' },
  { mot: 'gateau', rime: 'bateau' },
  { mot: 'main', rime: 'train' },
];

// Niveau 3, le son du début (des sons qu’on peut prolonger à l’oral : S, M, F, L, CH, R).
// « mot » est juste prononcé (élongé, via « voix »), jamais montré en image : il sert d’exemple
// du son. La bonne réponse est un AUTRE mot qui commence pareil, tiré au hasard dans « copains ».
// Deux exemples par son, pour varier d’une partie à l’autre (6 tirés au hasard parmi les 12).
export const SONS_DEBUT = [
  { mot: 'serpent', voix: 'sssserpent', copains: ['soleil', 'souris'] },
  { mot: 'soleil', voix: 'ssssoleil', copains: ['serpent', 'souris'] },
  { mot: 'maison', voix: 'mmmmaison', copains: ['mouton', 'main'] },
  { mot: 'mouton', voix: 'mmmmouton', copains: ['maison', 'main'] },
  { mot: 'fusee', voix: 'ffffusée', copains: ['fleur'] },
  { mot: 'fleur', voix: 'ffffleur', copains: ['fusee'] },
  { mot: 'lune', voix: 'lllune', copains: ['lit', 'lapin'] },
  { mot: 'lit', voix: 'Lllit', copains: ['lune', 'lapin'] },
  { mot: 'cheval', voix: 'chchcheval', copains: ['chapeau', 'chat', 'chocolat'] },
  { mot: 'chapeau', voix: 'chchchapeau', copains: ['cheval', 'chat', 'chocolat'] },
  { mot: 'renard', voix: 'rrrrenard', copains: ['robot', 'rat'] },
  { mot: 'robot', voix: 'rrrrobot', copains: ['renard', 'rat'] },
];
