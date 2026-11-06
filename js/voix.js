// La voix : lit les phrases de data/phrases.json.
// Ordre de préférence :
//   1. un enregistrement indiqué dans data/phrases.json (« audio ») ;
//   2. un enregistrement de la voix de conteuse (data/voix-enregistrees.json, fabriqué par tools/generer-voix.mjs) ;
//   3. la voix de synthèse de l’appareil, la plus naturelle possible.

import { reglages } from './reglages.js';

const synthese = window.speechSynthesis || null;
let phrases = {};
let enregistrees = {}; // texte (normalisé) → fichier mp3
let voixChoisie = null;
let audioEnCours = null;

export async function chargerPhrases() {
  try { phrases = await (await fetch('data/phrases.json')).json(); } catch { phrases = {}; }
  try { enregistrees = (await (await fetch('data/voix-enregistrees.json')).json()).phrases || {}; } catch { enregistrees = {}; }
}

// Le même texte, quelle que soit la façon de l’écrire (majuscules, apostrophes, espaces)
export function normaliser(texte) {
  return texte.toLowerCase().replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
}

// Voix « gadget » d’Apple à éviter (Grandma, Bubbles…)
const GADGETS = /grandma|grandpa|rocko|shelley|eddy|flo\b|reed|sandy|bubbles|bad news|bells|boing|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bahh|cellos|good news|fred|junior|kathy|ralph/i;
// Les voix « naturelles » (Edge sous Windows : Denise, Vivienne… ; iPad : voix améliorées ou premium)
const NATURELLE = /natural|neural|online|premium|enhanced|amélior/i;

export function voixFrancaises() {
  if (!synthese) return [];
  return synthese.getVoices().filter((v) => (v.lang || '').toLowerCase().startsWith('fr'));
}

function note(v) {
  let n = 0;
  if (/fr[-_]fr/i.test(v.lang)) n += 3;
  if (NATURELLE.test(v.name)) n += 6;
  if (/vivienne|denise|amélie|audrey|aurélie|marie/i.test(v.name)) n += 4; // voix de femme douces
  if (/eloise/i.test(v.name)) n -= 1;                                        // voix d’enfant : sympa, mais pas pour conter
  if (/google/i.test(v.name)) n += 1;
  if (GADGETS.test(v.name)) n -= 10;
  return n;
}

export function choisirVoix() {
  const liste = voixFrancaises();
  voixChoisie = liste.find((v) => v.voiceURI === reglages.voix)
    || [...liste].sort((a, b) => note(b) - note(a))[0]
    || null;
  return voixChoisie;
}

if (synthese) {
  choisirVoix();
  synthese.addEventListener?.('voiceschanged', choisirVoix);
}

function remplir(texte, valeurs) {
  return texte.replace(/\{(\w+)\}/g, (_, cle) => valeurs[cle] ?? reglages[cle] ?? '');
}

function trouverVariante(cle, valeurs) {
  const entree = (valeurs.id && phrases[cle + '-' + valeurs.id]) || phrases[cle];
  if (!entree) return { texte: '' };
  const liste = Array.isArray(entree) ? entree : [entree];
  const choix = liste[Math.floor(Math.random() * liste.length)];
  return typeof choix === 'string' ? { texte: choix } : choix;
}

// Dit la phrase « cle » (par exemple dire('memory-paire', { nom: 'Cappy', id: 'doudou-marron' })).
// Renvoie une promesse résolue à la fin de la phrase.
export function dire(cle, valeurs = {}) {
  const { texte, audio } = trouverVariante(cle, valeurs);
  const final = remplir(texte || '', valeurs);
  return parler(final, audio || enregistrees[normaliser(final)]);
}

export function taire() {
  if (synthese) synthese.cancel();
  if (audioEnCours) { audioEnCours.pause(); audioEnCours = null; }
}

export function parler(texte, audio) {
  taire();
  return new Promise((fin) => {
    let fait = false;
    const garde = setTimeout(() => terminer(), 3000 + (texte || '').length * 140); // au cas où « fin » n’arrive jamais
    function terminer() { if (!fait) { fait = true; clearTimeout(garde); fin(); } }

    const parSynthese = () => {
      if (!synthese || !texte) return terminer();
      const phrase = new SpeechSynthesisUtterance(texte);
      phrase.lang = 'fr-FR';
      if (voixChoisie) phrase.voice = voixChoisie;
      phrase.rate = reglages.debit;
      // Les voix naturelles sonnent mieux à leur hauteur normale
      phrase.pitch = voixChoisie && NATURELLE.test(voixChoisie.name) ? 1 : 1.05;
      phrase.volume = reglages.volumeVoix;
      phrase.onend = phrase.onerror = terminer;
      synthese.speak(phrase);
    };

    if (audio) {
      let secours = false;
      const repli = () => { if (!secours) { secours = true; parSynthese(); } };
      const son = new Audio(audio);
      son.volume = reglages.volumeVoix;
      audioEnCours = son;
      son.onended = terminer;
      son.onerror = repli;
      son.play().catch(repli);
    } else {
      parSynthese();
    }
  });
}
