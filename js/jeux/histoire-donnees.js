// Les ingrédients de l’histoire de Valentine. Chaque histoire en pioche au hasard ou les fait choisir :
// des milliers de combinaisons. Pour enrichir l’histoire, il suffit d’ajouter des éléments ici
// (et leurs phrases dans data/phrases.json).

// --- 1. Comment l’aventure commence ---
export const DEBUTS = {
  carte: `<img src="assets/objets/debut-carte.png" alt="">`,
  lettre: `<img src="assets/objets/debut-lettre.png" alt="">`,
  porte: `<img src="assets/objets/debut-porte.png" alt="">`,
  oiseau: `<img src="assets/objets/debut-oiseau.png" alt="">`,
  graine: `<img src="assets/objets/debut-graine.png" alt="">`,
  filante: `<img src="assets/objets/debut-filante.png" alt="">`,
};

// --- 3. Le moyen de transport ---
export const TRANSPORTS = {
  velo: { nom: 'vélo', svg: `<img src="assets/objets/transport-velo.png" alt="">` },
  montgolfiere: { nom: 'montgolfière', svg: `<img src="assets/objets/transport-montgolfiere.png" alt="">` },
  bateau: { nom: 'bateau', svg: `<img src="assets/objets/transport-bateau.png" alt="">` },
  fusee: { nom: 'fusée', svg: `<img src="assets/objets/transport-fusee.png" alt="">` },
  train: { nom: 'train', svg: `<img src="assets/objets/transport-train.png" alt="">` },
  carrosse: { nom: 'carrosse', svg: `<img src="assets/objets/transport-carrosse.png" alt="">` },
  tapis: { nom: 'tapis volant', svg: `<img src="assets/objets/transport-tapis.png" alt="">` },
};

// --- 4. Le lieu de l’aventure, et ce qu’on y ramasse ---
export const LIEUX = {
  foret: {
    nom: 'la forêt enchantée', objet: 'champignon', objets: 'champignons', genre: 'm',
    dessin: `<img src="assets/decors/histoire/foret.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-champignon.png" alt="">`,
  },
  plage: {
    nom: 'la plage', objet: 'coquillage', objets: 'coquillages', genre: 'm',
    dessin: `<img src="assets/decors/histoire/plage.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-coquillage.png" alt="">`,
  },
  lune: {
    nom: 'la lune', objet: 'étoile', objets: 'étoiles', genre: 'f',
    dessin: `<img src="assets/decors/histoire/lune.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-etoile.png" alt="">`,
  },
  chateau: {
    nom: 'le château de la princesse', objet: 'diamant', objets: 'diamants', genre: 'm',
    dessin: `<img src="assets/decors/histoire/chateau.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-diamant.png" alt="">`,
  },
  neige: {
    nom: 'la montagne enneigée', objet: 'flocon', objets: 'flocons', genre: 'm',
    dessin: `<img src="assets/decors/histoire/neige.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-flocon.png" alt="">`,
  },
  mer: {
    nom: 'le fond de la mer', objet: 'perle', objets: 'perles', genre: 'f',
    dessin: `<img src="assets/decors/histoire/mer.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-perle.png" alt="">`,
  },
  repaire: {
    nom: 'le repaire du dragon', objet: 'gemme', objets: 'gemmes', genre: 'f',
    dessin: `<img src="assets/decors/histoire/repaire.jpg" alt="">`,
    trouvaille: `<img src="assets/objets/trouvaille-gemme.png" alt="">`,
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
  rocher: { nom: 'un énorme rocher', svg: `<img src="assets/objets/obstacle-rocher.png" alt="">` },
  buisson: { nom: 'un buisson tout emmêlé', svg: `<img src="assets/objets/obstacle-buisson.png" alt="">` },
  flaque: { nom: 'une flaque qui scintille', svg: `<img src="assets/objets/obstacle-flaque.png" alt="">` },
};

// Un deuxième type de petit défi, pour que l’aventure ne soit pas toujours pareille :
// plusieurs chemins possibles, il faut trouver celui décoré de la bonne couleur.
export function chemin(id) {
  return `<img src="assets/objets/chemin-${id}.png" alt="">`;
}

// Les ballons (une couleur chacun)
export const BALLONS = { rouge: '#ef4d5a', bleu: '#4f9be0', jaune: '#ffd23a', vert: '#6cc070' };
export function ballon(id) {
  return `<img src="assets/objets/ballon-${id}.png" alt="">`;
}

// --- 7. Les clés du coffre, et les trésors ---
export const CLES = { or: '#ffd23a', argent: '#c9d3e8', rose: '#ff8fab' };
export function cle(id) {
  return `<img src="assets/objets/cle-${id}.png" alt="">`;
}
export const COFFRE_FERME = `<img src="assets/objets/coffre-ferme.png" alt="">`;
export const COFFRE_OUVERT = `<img src="assets/objets/coffre-ouvert.png" alt="">`;
export const TRESORS = {
  couronne: { nom: 'une couronne magique', svg: `<img src="assets/objets/tresor-couronne.png" alt="">` },
  baguette: { nom: 'une baguette de fée', svg: `<img src="assets/objets/tresor-baguette.png" alt="">` },
  gateau: { nom: 'un gâteau géant au chocolat', svg: `<img src="assets/objets/tresor-gateau.png" alt="">` },
  collier: { nom: 'un collier de perles arc-en-ciel', svg: `<img src="assets/objets/tresor-collier.png" alt="">` },
  licorne: { nom: 'une petite licorne en peluche', svg: `<img src="assets/objets/tresor-licorne.png" alt="">` },
  epee: { nom: 'une épée magique', svg: `<img src="assets/objets/tresor-epee.png" alt="">` },
  oeuf: { nom: 'un œuf de dragon qui scintille', svg: `<img src="assets/objets/tresor-oeuf.png" alt="">` },
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
