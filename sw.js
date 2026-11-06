// Service worker : rend l’application utilisable sans Internet.
// Si tu ajoutes un fichier JS ou CSS, ajoute-le à ESSENTIELS et augmente VERSION.

const VERSION = 'doudous-v1';

const ESSENTIELS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/app.js',
  'js/accueil.js',
  'js/doudous.js',
  'js/voix.js',
  'js/sons.js',
  'js/recompense.js',
  'js/parent.js',
  'js/minuteur.js',
  'js/reglages.js',
  'js/icones.js',
  'js/jeux/memory.js',
  'data/doudous.json',
  'data/phrases.json',
  'data/images-a-generer.json',
  'assets/icones/icone-180.png',
  'assets/icones/icone-192.png',
  'assets/icones/icone-512.png',
];

self.addEventListener('install', (evenement) => {
  evenement.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(ESSENTIELS);
    await mettreEnCacheLesImages(cache);
    await self.skipWaiting();
  })());
});

// Images des doudous, décors et enregistrements de voix : on prend ceux qui existent.
async function mettreEnCacheLesImages(cache) {
  const urls = new Set();
  const lire = async (chemin) => { try { return await (await fetch(chemin, { cache: 'no-cache' })).json(); } catch { return null; } };

  const doudous = await lire('data/doudous.json');
  const poses = ['face', 'coucou', 'dodo', 'bobo', 'mange', 'joie'];
  doudous?.doudous?.forEach((d) => {
    Object.values(d.images || {}).forEach((u) => urls.add(u));
    if (d.dossier) poses.forEach((p) => urls.add(`${d.dossier}/${p}.png`));
  });

  const images = await lire('data/images-a-generer.json');
  images?.images?.forEach((i) => i.fichier && urls.add(i.fichier));

  const phrases = await lire('data/phrases.json');
  Object.values(phrases || {}).flat().forEach((p) => p && p.audio && urls.add(p.audio));

  await Promise.all([...urls].map((u) => cache.add(u).catch(() => {})));
}

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil((async () => {
    for (const nom of await caches.keys()) if (nom !== VERSION) await caches.delete(nom);
    await self.clients.claim();
  })());
});

// Cache d’abord (rapide, hors ligne), puis mise à jour en arrière-plan.
self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET' || new URL(requete.url).origin !== location.origin) return;
  if (requete.headers.has('range')) return; // lecture partielle (audio) : laisser faire le navigateur

  evenement.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const enCache = (await cache.match(requete, { ignoreSearch: true }))
      || (requete.mode === 'navigate' ? await cache.match('index.html') : undefined);

    const reseau = fetch(requete).then((reponse) => {
      if (reponse.ok && reponse.status === 200) cache.put(requete, reponse.clone());
      return reponse;
    }).catch(() => null);

    if (enCache) {
      evenement.waitUntil(reseau);
      return enCache;
    }
    return (await reseau) || new Response('', { status: 504 });
  })());
});
