// Démarrage de l’application et navigation entre les écrans.

import { chargerDoudous, doudousActifs, imageDoudou } from './doudous.js';
import { chargerPhrases, dire, taire } from './voix.js';
import { debloquerSons, douceur } from './sons.js';
import { installerCoinParent } from './parent.js';
import { demarrerMinuteur, tempsRestant } from './minuteur.js';
import { ouvrirAccueil } from './accueil.js';
import { chargerValentine, portraitValentine } from './valentine.js';
import { ouvrirMemory } from './jeux/memory.js';
import { ouvrirCacheCache } from './jeux/cache-cache.js';
import { ouvrirPiqueNique } from './jeux/pique-nique.js';
import { ouvrirDodo } from './jeux/dodo.js';
import { ouvrirDocteur } from './jeux/docteur.js';
import { ouvrirHistoire } from './jeux/histoire.js';
import { ouvrirReveille } from './jeux/reveille.js';
import { ouvrirPeinture } from './jeux/peinture.js';

// Chaque écran : une fonction ouvrir(scene, { aller }) qui renvoie (si besoin) une fonction de nettoyage.
const ECRANS = {
  accueil: ouvrirAccueil,
  memory: ouvrirMemory,
  'cache-cache': ouvrirCacheCache,
  'pique-nique': ouvrirPiqueNique,
  dodo: ouvrirDodo,
  docteur: ouvrirDocteur,
  histoire: ouvrirHistoire,
  reveille: ouvrirReveille,
  peinture: ouvrirPeinture,
};

const scene = document.getElementById('scene');
let ecranCourant = null;
let nettoyer = null;

function nomDemande() {
  const nom = location.hash.replace('#', '');
  return ECRANS[nom] ? nom : 'accueil';
}

function afficher(force = false) {
  const nom = nomDemande();
  if (nom === ecranCourant && !force) return;
  ecranCourant = nom;
  if (nettoyer) nettoyer();
  taire();
  scene.className = 'ecran';
  scene.innerHTML = '';
  nettoyer = ECRANS[nom](scene, { aller }) || null;
  scene.classList.add('entree'); // petite apparition en fondu (voir css)
}

// On affiche tout de suite (dans le toucher) pour que la voix soit autorisée sur iPad.
function aller(nom) {
  location.hash = nom;
  afficher();
}

// --- Pause quand la durée de jeu est atteinte ---

function verifierPause() {
  const pause = document.getElementById('pause');
  if (tempsRestant() <= 0) {
    if (pause.classList.contains('cache')) {
      const dormeur = doudousActifs()[0];
      pause.querySelector('.pause-doudou').replaceChildren(imageDoudou(dormeur, 'dodo'));
      pause.classList.remove('cache');
      taire();
      dire('pause');
    }
  } else {
    pause.classList.add('cache');
  }
}

// --- Gestes indésirables sur tablette ---

['gesturestart', 'dblclick', 'contextmenu'].forEach((type) =>
  document.addEventListener(type, (e) => e.preventDefault()));

function pleinEcran() {
  const tactile = matchMedia('(pointer: coarse)').matches;
  const dejaApp = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
  const doc = document.documentElement;
  if (!tactile || dejaApp || !doc.requestFullscreen) return;
  doc.requestFullscreen()
    .then(() => screen.orientation?.lock?.('landscape').catch(() => {}))
    .catch(() => {});
}

// --- Hors ligne ---

// Sur l’ordinateur (localhost), on s’en passe pour voir chaque modification tout de suite.
if ('serviceWorker' in navigator) {
  const enLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (enLocal) {
    navigator.serviceWorker.getRegistrations().then((liste) => liste.forEach((r) => r.unregister()));
    caches?.keys().then((noms) => noms.forEach((n) => caches.delete(n)));
  } else {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// --- Démarrage ---

async function demarrer() {
  await Promise.all([chargerDoudous(), chargerPhrases(), chargerValentine()]);

  installerCoinParent(() => {
    verifierPause();
    if (ecranCourant === 'accueil') afficher(true); // doudous actifs mis à jour
  });

  const ecranDemarrage = document.getElementById('demarrage');
  const portrait = portraitValentine();
  if (portrait) ecranDemarrage.querySelector('.jouer').insertAdjacentHTML('beforeend', `<img class="portrait" src="${portrait}" alt="" draggable="false">`);
  else ecranDemarrage.querySelector('.jouer').append(imageDoudou(doudousActifs()[0], 'coucou'));
  ecranDemarrage.classList.add('pret');

  ecranDemarrage.querySelector('.jouer').addEventListener('click', () => {
    debloquerSons();
    douceur();
    pleinEcran();
    ecranDemarrage.classList.add('cache');
    window.addEventListener('hashchange', () => afficher());
    afficher();
    demarrerMinuteur(verifierPause);
    verifierPause();
  }, { once: true });
}

demarrer();
