// Mémorise, pour chaque jeu, jusqu’à quel niveau Valentine a le droit de jouer.
// Un niveau se débloque quand le précédent est fini ; ça reste d’une fois sur l’autre.

const CLE = 'doudous-progres';

let progres = {};
try { progres = JSON.parse(localStorage.getItem(CLE) || '{}'); } catch { /* stockage indisponible */ }

function enregistrer() {
  try { localStorage.setItem(CLE, JSON.stringify(progres)); } catch { /* rien */ }
}

// L’indice (0 = premier niveau) du niveau le plus avancé qu’on a le droit de jouer.
export function niveauDebloque(jeu) {
  return progres[jeu] || 0;
}

// Le niveau d’indice « niveau » est fini : on débloque le suivant si besoin.
export function debloquer(jeu, niveau) {
  if ((progres[jeu] || 0) < niveau + 1) {
    progres[jeu] = niveau + 1;
    enregistrer();
  }
}
