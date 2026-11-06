// Réglages du menu parent, gardés dans le navigateur de l’appareil.

const CLE = 'doudous-reglages';

const DEFAUT = {
  prenom: 'Valentine',
  volumeVoix: 1,      // 0 à 1
  volumeSons: 0.7,    // 0 à 1
  debit: 0.85,        // vitesse de la voix (1 = normal)
  voix: '',           // voix choisie ('' = la plus naturelle trouvée)
  actifs: null,       // liste des id de doudous en jeu (null = tous)
  dureeMax: 0,        // minutes de jeu avant la pause (0 = illimité)
};

export const reglages = { ...DEFAUT };

try {
  Object.assign(reglages, JSON.parse(localStorage.getItem(CLE) || '{}'));
} catch { /* stockage indisponible : on garde les valeurs par défaut */ }

export function enregistrer() {
  try { localStorage.setItem(CLE, JSON.stringify(reglages)); } catch { /* rien */ }
}
