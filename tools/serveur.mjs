// Petit serveur local, sans rien installer : node tools/serveur.mjs
// Ouvre l’app sur l’ordinateur, et sur l’iPad (même Wi-Fi) grâce à l’adresse affichée.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon',
};

const serveur = http.createServer((req, res) => {
  let chemin = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (chemin.endsWith('/')) chemin += 'index.html';
  const fichier = path.join(RACINE, chemin);
  if (!fichier.startsWith(RACINE) || fichier.includes(`${path.sep}tools${path.sep}`)) { res.writeHead(403).end(); return; }

  fs.stat(fichier, (err, info) => {
    if (err || !info.isFile()) { res.writeHead(404).end('Introuvable'); return; }
    const entetes = {
      'Content-Type': TYPES[path.extname(fichier).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes',
    };
    // Lecture partielle (nécessaire pour l’audio et la vidéo sur iPad)
    const plage = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (plage) {
      const debut = plage[1] ? Number(plage[1]) : 0;
      const fin = plage[2] ? Number(plage[2]) : info.size - 1;
      res.writeHead(206, { ...entetes, 'Content-Range': `bytes ${debut}-${fin}/${info.size}`, 'Content-Length': fin - debut + 1 });
      fs.createReadStream(fichier, { start: debut, end: fin }).pipe(res);
    } else {
      res.writeHead(200, { ...entetes, 'Content-Length': info.size });
      fs.createReadStream(fichier).pipe(res);
    }
  });
});

serveur.listen(PORT, '0.0.0.0', () => {
  const adresses = Object.values(os.networkInterfaces()).flat()
    .filter((a) => a && a.family === 'IPv4' && !a.internal).map((a) => a.address);
  console.log('\n  Le monde des doudous est lancé !\n');
  console.log(`  Sur cet ordinateur :  http://localhost:${PORT}`);
  adresses.forEach((a) => console.log(`  Sur l’iPad (même Wi-Fi) :  http://${a}:${PORT}`));
  console.log('\n  Pour arrêter : fermer cette fenêtre (ou Ctrl+C).\n');
  if (process.argv.includes('--ouvrir')) exec(`start "" http://localhost:${PORT}`);
});
