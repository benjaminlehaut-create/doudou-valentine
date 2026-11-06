// La voix : lit les phrases de data/phrases.json.
// Si une phrase a un enregistrement (« audio »), on le joue ; sinon, voix de synthèse.

import { reglages } from './reglages.js';

const synthese = window.speechSynthesis || null;
let phrases = {};
let voixChoisie = null;
let audioEnCours = null;

export async function chargerPhrases() {
  try { phrases = await (await fetch('data/phrases.json')).json(); } catch { phrases = {}; }
}

// Voix « gadget » d’Apple à éviter (Grandma, Bubbles…)
const GADGETS = /grandma|grandpa|rocko|shelley|eddy|flo\b|reed|sandy|bubbles|bad news|bells|boing|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bahh|cellos|good news|fred|junior|kathy|ralph/i;

export function voixFrancaises() {
  if (!synthese) return [];
  return synthese.getVoices().filter((v) => (v.lang || '').toLowerCase().startsWith('fr'));
}

function note(v) {
  let n = 0;
  if (/fr[-_]fr/i.test(v.lang)) n += 3;
  if (/premium|enhanced|amélioré|natural|neural|online/i.test(v.name)) n += 5;
  if (/amélie|audrey|aurélie|marie|denise|google/i.test(v.name)) n += 2;
  if (GADGETS.test(v.name)) n -= 10;
  return n;
}

export function choisirVoix() {
  const liste = voixFrancaises();
  voixChoisie = liste.find((v) => v.voiceURI === reglages.voix)
    || liste.sort((a, b) => note(b) - note(a))[0]
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

// Dit la phrase « cle » (par exemple dire('memory-paire', { nom: 'Nounours', id: 'nounours' })).
// Renvoie une promesse résolue à la fin de la phrase.
export function dire(cle, valeurs = {}) {
  const { texte, audio } = trouverVariante(cle, valeurs);
  return parler(remplir(texte || '', valeurs), audio);
}

export function taire() {
  if (synthese) synthese.cancel();
  if (audioEnCours) { audioEnCours.pause(); audioEnCours = null; }
}

export function parler(texte, audio) {
  taire();
  return new Promise((fin) => {
    let fait = false;
    const terminer = () => { if (!fait) { fait = true; fin(); } };

    const parSynthese = () => {
      if (!synthese || !texte) return terminer();
      const phrase = new SpeechSynthesisUtterance(texte);
      phrase.lang = 'fr-FR';
      if (voixChoisie) phrase.voice = voixChoisie;
      phrase.rate = reglages.debit;
      phrase.pitch = 1.1;
      phrase.volume = reglages.volumeVoix;
      const garde = setTimeout(terminer, 2000 + texte.length * 130); // au cas où « fin » n’arrive jamais
      phrase.onend = phrase.onerror = () => { clearTimeout(garde); terminer(); };
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
