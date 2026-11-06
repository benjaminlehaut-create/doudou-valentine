// Génère les images manquantes avec l’API OpenAI (gpt-image-1).
//
//   node tools/generate-assets.mjs            génère ce qui manque
//   node tools/generate-assets.mjs --essai    liste ce qui serait généré, sans rien appeler
//   node tools/generate-assets.mjs --force accueil   regénère les fichiers dont le nom contient « accueil »
//
// La clé se met dans un fichier .env à la racine (jamais envoyé sur GitHub) :
//   OPENAI_API_KEY=sk-...
// La liste des images est dans data/images-a-generer.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const essai = args.includes('--essai');
const iForce = args.indexOf('--force');
const forcer = iForce >= 0 ? (args[iForce + 1] || '') : null;

// Lecture du fichier .env (facultatif)
const fichierEnv = path.join(RACINE, '.env');
if (fs.existsSync(fichierEnv)) {
  for (const ligne of fs.readFileSync(fichierEnv, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(ligne);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const liste = JSON.parse(fs.readFileSync(path.join(RACINE, 'data', 'images-a-generer.json'), 'utf8'));
const cle = process.env.OPENAI_API_KEY;

const aFaire = liste.images.filter((img) => {
  const cible = path.join(RACINE, img.fichier);
  const existe = fs.existsSync(cible) && fs.statSync(cible).size > 0;
  if (forcer !== null && img.fichier.includes(forcer)) return true;
  if (existe) console.log(`  déjà là   ${img.fichier}`);
  return !existe;
});

if (!aFaire.length) { console.log('\nRien à générer.'); process.exit(0); }
if (essai) { aFaire.forEach((i) => console.log(`  à générer ${i.fichier}`)); process.exit(0); }
if (!cle) { console.error('\nClé manquante : ajoute OPENAI_API_KEY=... dans le fichier .env'); process.exit(1); }

for (const img of aFaire) {
  const cible = path.join(RACINE, img.fichier);
  const format = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp' }[path.extname(cible).toLowerCase()] || 'png';
  const prompt = `${liste.style}\n\n${img.prompt}`;
  const options = {
    model: 'gpt-image-1',
    prompt,
    size: img.taille || '1024x1024',
    quality: img.qualite || 'high',
    output_format: format,
    ...(img.transparent ? { background: 'transparent' } : {}),
  };

  process.stdout.write(`  génération ${img.fichier} … `);
  try {
    let reponse;
    if (img.reference) {
      // À partir d’une photo du vrai doudou : API d’édition
      const photo = path.join(RACINE, img.reference);
      if (!fs.existsSync(photo)) { console.log(`photo absente (${img.reference}), ignoré`); continue; }
      const formulaire = new FormData();
      Object.entries(options).forEach(([k, v]) => formulaire.append(k, String(v)));
      const type = /\.png$/i.test(photo) ? 'image/png' : /\.webp$/i.test(photo) ? 'image/webp' : 'image/jpeg';
      formulaire.append('image', new Blob([fs.readFileSync(photo)], { type }), path.basename(photo));
      reponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST', headers: { Authorization: `Bearer ${cle}` }, body: formulaire,
      });
    } else {
      reponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
    }
    const donnees = await reponse.json();
    if (!reponse.ok) throw new Error(donnees.error?.message || reponse.statusText);
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, Buffer.from(donnees.data[0].b64_json, 'base64'));
    console.log('ok');
  } catch (e) {
    console.log(`échec : ${e.message}`);
  }
}
