// Enregistre une vraie voix de conteuse (OpenAI) pour TOUTES les phrases de l’app, avec tous les doudous.
// Les fichiers vont dans assets/voix/conteuse/, et data/voix-enregistrees.json fait le lien texte → fichier.
// L’app les joue à la place de la voix de synthèse (et sans Internet). Une phrase sans enregistrement
// garde la voix de synthèse.
//
//   node tools/generer-voix.mjs --essai            compte les phrases et estime le prix, sans rien appeler
//   node tools/generer-voix.mjs                    enregistre ce qui manque (relançable : ne refait jamais l’existant)
//   node tools/generer-voix.mjs --voix coral       choisit une autre voix (par défaut : shimmer)
//   node tools/generer-voix.mjs --prenom Valentine (par défaut : Valentine)
//
// La clé se met dans le fichier .env : OPENAI_API_KEY=sk-...
// À relancer après avoir ajouté un doudou ou des phrases.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (nom, defaut) => { const i = args.indexOf('--' + nom); return i >= 0 ? args[i + 1] : defaut; };
const essai = args.includes('--essai');
const VOIX = option('voix', 'shimmer');
const PRENOM = option('prenom', 'Valentine');
const MODELE = 'gpt-4o-mini-tts';
const CONSIGNES = 'Tu es une conteuse française pour une petite fille de 3 ans. Parle en français de France, '
  + 'avec une voix très douce, chaleureuse et souriante, lentement et clairement, comme on lit une histoire au moment du câlin. '
  + 'Mets de la tendresse et un peu d’émerveillement, sans jamais crier.';

// --- Lecture du fichier .env ---
const fichierEnv = path.join(RACINE, '.env');
if (fs.existsSync(fichierEnv)) {
  for (const ligne of fs.readFileSync(fichierEnv, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(ligne);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// --- Toutes les valeurs possibles de chaque {variable} ---
const lireJson = (f) => JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8'));
const importer = (f) => import(pathToFileURL(path.join(RACINE, f)).href);
const { ALIMENTS, COULEURS, A_COMPTER, TEINTES, COULEURS_PLURIEL, quantite, nombre } = await importer('js/jeux/aliments.js');
const H = await importer('js/jeux/histoire-donnees.js');
const P = await importer('js/jeux/peinture-donnees.js');
const phrases = lireJson('data/phrases.json');
const doudous = lireJson('data/doudous.json').doudous.filter((d) => d && d.nom);

const noms = doudous.map((d) => d.nom);
const couleursPique = [...new Set(COULEURS.map((id) => ALIMENTS[id].couleur))];
const couleursCache = ['rose', 'marron', 'vert', 'jaune', 'violet', 'bleu'];
const couleursBallons = Object.keys(H.BALLONS);
const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1);
// Niveau « mélange » du pique-nique : « un fruit rouge », « deux fruits rouges »…
const texteMelange = (n, couleur) => `${nombre(n, 'm')} fruit${n > 1 ? 's' : ''} ${n > 1 ? COULEURS_PLURIEL[couleur] : couleur}`;
const couleursMelange = Object.keys(TEINTES);

const DOMAINES = {
  prenom: [PRENOM],
  nom: noms,
  autre: noms,
  aliment: [...new Set([
    ...COULEURS.map((id) => ALIMENTS[id].un),
    ...Object.values(ALIMENTS).map((a) => a.le),
    ...couleursMelange.flatMap((c) => [`le fruit ${c}`, `les fruits ${COULEURS_PLURIEL[c]}`]),
  ])],
  pluriel: [...new Set([
    ...A_COMPTER.map((id) => ALIMENTS[id].pluriel),
    ...couleursMelange.map((c) => `fruits ${COULEURS_PLURIEL[c]}`),
  ])],
  mot: [...new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap((n) => ['m', 'f'].map((g) => nombre(n, g))).filter(Boolean).flatMap((m) => [m, majuscule(m)]))],
  outil: ['le pansement', 'le thermomètre', 'le sirop', 'le mouchoir', 'le stéthoscope', 'le câlin'],
  transport: Object.values(H.TRANSPORTS).map((t) => t.nom),
  lieu: Object.values(H.LIEUX).map((l) => l.nom),
  animal: Object.values(H.ANIMAUX).map((a) => a.nom),
  tresor: Object.values(H.TRESORS).map((t) => t.nom),
  obstacle: Object.values(H.OBSTACLES).map((o) => o.nom),
  objet: Object.values(P.OBJETS).map((o) => o.le),
  pot1: Object.keys(P.POTS),
  pot2: Object.keys(P.POTS),
  resultat: Object.keys(P.TEINTES_RESULTAT),
};
// Certaines variables dépendent du jeu
function domaine(cle, variable) {
  if (variable === 'couleur') {
    if (cle.startsWith('pique')) return couleursPique;
    if (cle.startsWith('cache')) return couleursCache;
    if (cle.startsWith('peinture')) return Object.keys(P.TEINTES_RESULTAT);
    return couleursBallons;
  }
  if (variable === 'quantite') {
    if (cle.startsWith('pique')) {
      return [
        ...A_COMPTER.flatMap((id) => [1, 2, 3].map((n) => quantite(n, ALIMENTS[id]))),
        ...couleursMelange.flatMap((c) => [1, 2, 3].map((n) => texteMelange(n, c))),
      ];
    }
    return Object.values(H.LIEUX).flatMap((l) => [3, 4, 5].map((n) => `${l.genre === 'f' ? ['', 'une', 'deux', 'trois', 'quatre', 'cinq'][n] : ['', 'un', 'deux', 'trois', 'quatre', 'cinq'][n]} ${l.objets}`));
  }
  if (variable === 'id') return [''];
  return DOMAINES[variable] || null;
}

// --- Toutes les phrases finales ---
const normaliser = (t) => t.toLowerCase().replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
const textes = new Map(); // normalisé → texte
const inconnues = new Set();
for (const [cle, entree] of Object.entries(phrases)) {
  if (cle.startsWith('_')) continue;
  for (const v of (Array.isArray(entree) ? entree : [entree])) {
    const modele = typeof v === 'string' ? v : v.texte;
    if (!modele || (typeof v === 'object' && v.audio)) continue;
    const variables = [...new Set([...modele.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
    let combinaisons = [{}];
    for (const variable of variables) {
      const valeurs = domaine(cle, variable);
      if (!valeurs) { inconnues.add(`${cle} : {${variable}}`); combinaisons = []; break; }
      combinaisons = combinaisons.flatMap((c) => valeurs.map((val) => ({ ...c, [variable]: val })));
    }
    for (const c of combinaisons) {
      const texte = modele.replace(/\{(\w+)\}/g, (_, k) => c[k] ?? '');
      textes.set(normaliser(texte), texte);
    }
  }
}

// --- Ce qui existe déjà ---
const DOSSIER = path.join(RACINE, 'assets', 'voix', 'conteuse');
const MANIFESTE = path.join(RACINE, 'data', 'voix-enregistrees.json');
const manifeste = fs.existsSync(MANIFESTE) ? JSON.parse(fs.readFileSync(MANIFESTE, 'utf8')) : { voix: VOIX, phrases: {} };
const nomFichier = (normalise) => crypto.createHash('sha1').update(VOIX + '|' + normalise).digest('hex').slice(0, 16) + '.mp3';
const aFaire = [...textes].filter(([n]) => !fs.existsSync(path.join(DOSSIER, nomFichier(n))));
const caracteres = aFaire.reduce((s, [, t]) => s + t.length, 0);

console.log(`\n  ${textes.size} phrases différentes dans l’app, ${aFaire.length} à enregistrer (voix « ${VOIX} »).`);
console.log(`  Environ ${Math.round(caracteres / 15 / 60)} minutes de parole ; coût estimé : moins de ${Math.max(1, Math.ceil(caracteres / 15 / 60 * 0.015))} $.`);
if (inconnues.size) console.log(`  Variables sans valeurs connues (restent en voix de synthèse) : ${[...inconnues].join(', ')}`);
if (essai) process.exit(0);

const cle = process.env.OPENAI_API_KEY;
if (!cle) { console.error('\n  Clé manquante : ajoute OPENAI_API_KEY=... dans le fichier .env'); process.exit(1); }
fs.mkdirSync(DOSSIER, { recursive: true });

// --- Enregistrement (4 à la fois) ---
let faits = 0;
let echecs = 0;
const sauver = () => fs.writeFileSync(MANIFESTE, JSON.stringify(manifeste, null, 1));
async function enregistrer([normalise, texte]) {
  const fichier = nomFichier(normalise);
  for (let essaiNo = 1; essaiNo <= 3; essaiNo++) {
    try {
      const reponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODELE, voice: VOIX, input: texte, instructions: CONSIGNES, response_format: 'mp3' }),
      });
      if (!reponse.ok) throw new Error((await reponse.json().catch(() => ({}))).error?.message || reponse.statusText);
      fs.writeFileSync(path.join(DOSSIER, fichier), Buffer.from(await reponse.arrayBuffer()));
      manifeste.phrases[normalise] = 'assets/voix/conteuse/' + fichier;
      faits++;
      if (faits % 20 === 0) { sauver(); console.log(`  ${faits} / ${aFaire.length}`); }
      return;
    } catch (e) {
      if (essaiNo === 3) { echecs++; console.log(`  échec : « ${texte.slice(0, 50)}… » (${e.message})`); }
      else await new Promise((r) => setTimeout(r, 2000 * essaiNo));
    }
  }
}
const file = [...aFaire];
await Promise.all(Array.from({ length: 4 }, async () => { while (file.length) await enregistrer(file.shift()); }));

// Les fichiers déjà présents (d’une session précédente) sont aussi référencés
for (const [n] of textes) {
  const f = nomFichier(n);
  if (fs.existsSync(path.join(DOSSIER, f))) manifeste.phrases[n] = 'assets/voix/conteuse/' + f;
}
manifeste.voix = VOIX;
sauver();
console.log(`\n  Terminé : ${faits} enregistrées${echecs ? `, ${echecs} échecs (relance la commande)` : ''}.`);
