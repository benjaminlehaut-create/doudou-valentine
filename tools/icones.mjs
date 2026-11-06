// Dessine les icônes de l’app (un petit ourson) : node tools/icones.mjs
// Aucune bibliothèque : on calcule chaque pixel puis on écrit un PNG.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const DOSSIER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'icones');
fs.mkdirSync(DOSSIER, { recursive: true });

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const melange = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

const FOND_HAUT = hex('#ffe9d6'), FOND_BAS = hex('#ffbfae');
const BRUN = hex('#b98058'), BRUN_CLAIR = hex('#e6c09c'), MUSEAU = hex('#f1d6bb');
const NEZ = hex('#4a3030'), OEIL = hex('#2e2226'), BLANC = [255, 255, 255], JOUE = hex('#ff9fb3');

const dans = (u, v, cx, cy, r) => (u - cx) ** 2 + (v - cy) ** 2 <= r * r;
const dansEllipse = (u, v, cx, cy, rx, ry) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 <= 1;

function couleur(u, v) {
  let c = melange(FOND_HAUT, FOND_BAS, v);
  const fourrure = () => melange(BRUN, BRUN_CLAIR, Math.max(0, 1 - Math.hypot(u - 0.42, v - 0.44) / 0.32) * 0.55);
  for (const x of [0.3, 0.7]) {
    if (dans(u, v, x, 0.34, 0.11)) c = fourrure();
    if (dans(u, v, x, 0.34, 0.058)) c = BRUN_CLAIR;
  }
  if (dans(u, v, 0.5, 0.56, 0.27)) c = fourrure();
  for (const x of [0.33, 0.67]) if (dans(u, v, x, 0.64, 0.045)) c = melange(c, JOUE, 0.5);
  if (dansEllipse(u, v, 0.5, 0.655, 0.12, 0.085)) c = MUSEAU;
  if (dansEllipse(u, v, 0.5, 0.615, 0.042, 0.03)) c = NEZ;
  const bouche = Math.abs(Math.hypot(u - 0.5, v - 0.645) - 0.045);
  if (bouche < 0.007 && v > 0.665) c = NEZ;
  for (const x of [0.4, 0.6]) {
    if (dans(u, v, x, 0.52, 0.03)) c = OEIL;
    if (dans(u, v, x + 0.01, 0.508, 0.01)) c = BLANC;
  }
  return c;
}

function dessiner(taille) {
  const SUR = 3; // suréchantillonnage pour des bords doux
  const pixels = Buffer.alloc(taille * (taille * 4 + 1));
  for (let y = 0; y < taille; y++) {
    pixels[y * (taille * 4 + 1)] = 0;
    for (let x = 0; x < taille; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SUR; sy++) for (let sx = 0; sx < SUR; sx++) {
        const c = couleur((x + (sx + 0.5) / SUR) / taille, (y + (sy + 0.5) / SUR) / taille);
        r += c[0]; g += c[1]; b += c[2];
      }
      const n = SUR * SUR, i = y * (taille * 4 + 1) + 1 + x * 4;
      pixels[i] = r / n; pixels[i + 1] = g / n; pixels[i + 2] = b / n; pixels[i + 3] = 255;
    }
  }
  return png(taille, taille, pixels);
}

// --- Écriture PNG minimale ---
const TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc(buf) {
  let c = 0xffffffff;
  for (const o of buf) c = TABLE[(c ^ o) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function bloc(type, data) {
  const t = Buffer.from(type), l = Buffer.alloc(4), k = Buffer.alloc(4);
  l.writeUInt32BE(data.length);
  k.writeUInt32BE(crc(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, k]);
}
function png(l, h, brut) {
  const entete = Buffer.alloc(13);
  entete.writeUInt32BE(l, 0); entete.writeUInt32BE(h, 4);
  entete[8] = 8; entete[9] = 6; entete[10] = 0; entete[11] = 0; entete[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloc('IHDR', entete), bloc('IDAT', zlib.deflateSync(brut, { level: 9 })), bloc('IEND', Buffer.alloc(0)),
  ]);
}

for (const taille of [180, 192, 512]) {
  fs.writeFileSync(path.join(DOSSIER, `icone-${taille}.png`), dessiner(taille));
  console.log(`icone-${taille}.png`);
}
