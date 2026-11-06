// Menu parent : appui long de 3 secondes dans le coin en haut à droite.

import { reglages, enregistrer } from './reglages.js';
import { tousLesDoudous, imageDoudou } from './doudous.js';
import { voixFrancaises, choisirVoix, dire } from './voix.js';
import { remettreMinuteur, tempsRestant } from './minuteur.js';

const DUREE_APPUI = 3000;

export function installerCoinParent(apresFermeture) {
  const coin = document.getElementById('coin-parent');
  let minuterie = null;

  const annuler = () => {
    clearTimeout(minuterie);
    coin.classList.remove('appui');
  };

  coin.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    coin.classList.add('appui');
    minuterie = setTimeout(() => { annuler(); ouvrirMenu(apresFermeture); }, DUREE_APPUI);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => coin.addEventListener(t, annuler));
}

function ouvrirMenu(apresFermeture) {
  const menu = document.getElementById('menu-parent');
  const durees = [0, 10, 15, 20, 30, 45, 60];

  menu.innerHTML = `
    <div class="panneau">
      <h2>Menu des parents</h2>

      <label class="ligne">Prénom de l’enfant
        <input id="p-prenom" type="text" autocomplete="off" maxlength="30">
      </label>

      <label class="ligne">Volume de la voix
        <input id="p-voix-volume" type="range" min="0" max="1" step="0.05">
      </label>
      <label class="ligne">Volume des sons
        <input id="p-sons-volume" type="range" min="0" max="1" step="0.05">
      </label>
      <label class="ligne">Vitesse de la voix
        <input id="p-debit" type="range" min="0.5" max="1.2" step="0.05">
      </label>
      <div class="ligne">Voix
        <select id="p-voix"></select>
        <button id="p-tester" class="petit">Écouter</button>
      </div>
      <p class="aide">Voix trop robotique sur iPad ou iPhone ? Réglages › Accessibilité › Contenu énoncé › Voix › Français : téléchargez une voix « améliorée » ou « premium », puis choisissez-la ici.</p>

      <h3>Doudous en jeu</h3>
      <div class="choix-doudous"></div>

      <div class="ligne">Durée de jeu
        <select id="p-duree">
          ${durees.map((m) => `<option value="${m}">${m ? m + ' minutes' : 'Illimitée'}</option>`).join('')}
        </select>
      </div>
      <div class="ligne">
        <span id="p-reste"></span>
        <button id="p-minuteur" class="petit">Remettre à zéro</button>
      </div>

      <button id="p-fermer" class="fermer">Fermer</button>
    </div>`;

  const $ = (s) => menu.querySelector(s);

  // Prénom et curseurs
  $('#p-prenom').value = reglages.prenom;
  $('#p-prenom').addEventListener('input', (e) => { reglages.prenom = e.target.value.trim(); });
  [['#p-voix-volume', 'volumeVoix'], ['#p-sons-volume', 'volumeSons'], ['#p-debit', 'debit']].forEach(([sel, cle]) => {
    $(sel).value = reglages[cle];
    $(sel).addEventListener('input', (e) => { reglages[cle] = Number(e.target.value); });
  });

  // Choix de la voix
  const liste = voixFrancaises();
  $('#p-voix').innerHTML = `<option value="">Automatique</option>`
    + liste.map((v) => `<option value="${v.voiceURI}">${v.name}</option>`).join('');
  $('#p-voix').value = reglages.voix;
  $('#p-voix').addEventListener('change', (e) => { reglages.voix = e.target.value; choisirVoix(); });
  $('#p-tester').addEventListener('click', () => dire('test-voix'));

  // Doudous actifs (au moins deux)
  const actifs = new Set(reglages.actifs || tousLesDoudous().map((d) => d.id));
  const grille = $('.choix-doudous');
  tousLesDoudous().forEach((d) => {
    const b = document.createElement('button');
    b.className = 'choix' + (actifs.has(d.id) ? ' actif' : '');
    b.append(imageDoudou(d));
    b.insertAdjacentHTML('beforeend', `<span>${d.nom}</span>`);
    b.addEventListener('click', () => {
      if (actifs.has(d.id)) {
        if (actifs.size <= 2) { b.classList.remove('refus'); void b.offsetWidth; b.classList.add('refus'); return; }
        actifs.delete(d.id);
      } else {
        actifs.add(d.id);
      }
      b.classList.toggle('actif', actifs.has(d.id));
      reglages.actifs = [...actifs];
    });
    grille.append(b);
  });

  // Durée de jeu
  const majReste = () => {
    const r = tempsRestant();
    $('#p-reste').textContent = r === Infinity ? 'Pas de limite' : `Reste ${Math.max(0, Math.ceil(r / 60000))} min`;
  };
  $('#p-duree').value = String(reglages.dureeMax);
  $('#p-duree').addEventListener('change', (e) => { reglages.dureeMax = Number(e.target.value); majReste(); });
  $('#p-minuteur').addEventListener('click', () => { remettreMinuteur(); majReste(); });
  majReste();

  $('#p-fermer').addEventListener('click', () => {
    if (!reglages.prenom) reglages.prenom = 'Valentine';
    enregistrer();
    menu.classList.add('cache');
    menu.innerHTML = '';
    apresFermeture?.();
  });

  menu.classList.remove('cache');
}
