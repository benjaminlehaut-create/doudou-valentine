// Rend bien opaques les images détourées qui sont un peu transparentes (fréquent avec ChatGPT).
//   node tools/opacifier.mjs assets/valentine
//   node tools/opacifier.mjs assets/doudous/koala-doux/face.png
// Les pixels presque opaques deviennent opaques ; les bords restent doux. Le fichier est remplacé.
// Sans risque si on le relance : une image déjà opaque ne change pas.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const cibles = process.argv.slice(2);
if (!cibles.length) { console.log('Usage : node tools/opacifier.mjs <dossier ou fichier.png> …'); process.exit(1); }

const fichiers = cibles.flatMap((c) => fs.statSync(c).isDirectory()
  ? fs.readdirSync(c).filter((f) => f.toLowerCase().endsWith('.png')).map((f) => path.join(c, f))
  : [c]);

setTimeout(principal); // après la définition des fonctions plus bas

function principal() { for (const f of fichiers) {
  try {
    const img = lirePng(fs.readFileSync(f));
    let change = 0;
    const d = img.pixels;
    // Une image voilée n’a presque aucun pixel tout à fait opaque. Sinon, on n’y touche pas.
    let visibles = 0, pleins = 0;
    for (let i = 3; i < d.length; i += 4) { if (d[i] > 0) visibles++; if (d[i] === 255) pleins++; }
    if (pleins > visibles * 0.05) { console.log(`  déjà opaque  ${f}`); continue; }
    for (let i = 3; i < d.length; i += 4) {
      const a = d[i] / 255;
      const b = Math.min(1, Math.max(0, (a - 0.08) / (0.86 - 0.08)));
      const n = Math.round(b * 255);
      if (n !== d[i]) { d[i] = n; change++; }
    }
    if (!change) { console.log(`  déjà opaque  ${f}`); continue; }
    fs.writeFileSync(f, ecrirePng(img.largeur, img.hauteur, d));
    console.log(`  opacifiée    ${f}`);
  } catch (e) {
    console.log(`  ignorée      ${f} (${e.message})`);
  }
} }

// --- PNG minimal (RGBA ou RGB 8 bits, non entrelacé) ---

function lirePng(buf) {
  let pos = 8, largeur, hauteur, type, profondeur, entrelace;
  const idat = [];
  while (pos < buf.length) {
    const long = buf.readUInt32BE(pos), nom = buf.toString('ascii', pos + 4, pos + 8), data = buf.subarray(pos + 8, pos + 8 + long);
    if (nom === 'IHDR') { largeur = data.readUInt32BE(0); hauteur = data.readUInt32BE(4); profondeur = data[8]; type = data[9]; entrelace = data[12]; }
    if (nom === 'IDAT') idat.push(data);
    if (nom === 'IEND') break;
    pos += 12 + long;
  }
  if (profondeur !== 8 || entrelace || (type !== 6 && type !== 2)) throw new Error('format PNG non pris en charge');
  const bpp = type === 6 ? 4 : 3, ligne = largeur * bpp;
  const brut = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(largeur * hauteur * 4);
  let prec = Buffer.alloc(ligne);
  for (let y = 0; y < hauteur; y++) {
    const filtre = brut[y * (ligne + 1)];
    const cur = Buffer.from(brut.subarray(y * (ligne + 1) + 1, (y + 1) * (ligne + 1)));
    for (let x = 0; x < ligne; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prec[x], c = x >= bpp ? prec[x - bpp] : 0;
      let v = cur[x];
      if (filtre === 1) v += a;
      else if (filtre === 2) v += b;
      else if (filtre === 3) v += (a + b) >> 1;
      else if (filtre === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[x] = v & 255;
    }
    for (let x = 0; x < largeur; x++) {
      for (let k = 0; k < 3; k++) out[(y * largeur + x) * 4 + k] = cur[x * bpp + k];
      out[(y * largeur + x) * 4 + 3] = bpp === 4 ? cur[x * 4 + 3] : 255;
    }
    prec = cur;
  }
  return { largeur, hauteur, pixels: out };
}

const TABLE = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const o of buf) c = TABLE[(c ^ o) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const bloc = (type, data) => { const t = Buffer.from(type), l = Buffer.alloc(4), k = Buffer.alloc(4); l.writeUInt32BE(data.length); k.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([l, t, data, k]); };

function ecrirePng(l, h, pixels) {
  const brut = Buffer.alloc(h * (l * 4 + 1));
  for (let y = 0; y < h; y++) pixels.copy(brut, y * (l * 4 + 1) + 1, y * l * 4, (y + 1) * l * 4);
  const ent = Buffer.alloc(13);
  ent.writeUInt32BE(l, 0); ent.writeUInt32BE(h, 4); ent[8] = 8; ent[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bloc('IHDR', ent), bloc('IDAT', zlib.deflateSync(brut, { level: 9 })), bloc('IEND', Buffer.alloc(0))]);
}
