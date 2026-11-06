// Récompenses visuelles : pluie de cœurs et confettis.

const COULEURS = ['#ff8fab', '#ffc46b', '#9ad0f5', '#b8a4f0', '#8fd6a8', '#ffb38a'];
const FORMES = ['❤', '★', '✿', '●'];

const calque = () => document.getElementById('calque-fete');
const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];

// Une gerbe de cœurs et d’étoiles autour d’un point de l’écran.
export function gerbe(x, y, nombre = 12) {
  for (let i = 0; i < nombre; i++) {
    const p = document.createElement('span');
    p.className = 'particule';
    p.textContent = i % 3 === 0 ? '★' : '❤';
    const angle = (Math.PI * 2 * i) / nombre + Math.random() * 0.5;
    const distance = 70 + Math.random() * 90;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.color = auHasard(COULEURS);
    p.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * distance - 40 + 'px');
    p.style.fontSize = 22 + Math.random() * 20 + 'px';
    calque().append(p);
    setTimeout(() => p.remove(), 1300);
  }
}

// Gerbe centrée sur un élément.
export function gerbeSur(element, nombre) {
  const r = element.getBoundingClientRect();
  gerbe(r.left + r.width / 2, r.top + r.height / 2, nombre);
}

// Grande fête : confettis sur tout l’écran.
export function confettis(nombre = 70) {
  for (let i = 0; i < nombre; i++) {
    const p = document.createElement('span');
    p.className = 'confetti';
    p.textContent = auHasard(FORMES);
    p.style.left = Math.random() * 100 + 'vw';
    p.style.color = auHasard(COULEURS);
    p.style.fontSize = 18 + Math.random() * 26 + 'px';
    p.style.animationDelay = Math.random() * 0.9 + 's';
    p.style.animationDuration = 2.2 + Math.random() * 1.4 + 's';
    p.style.setProperty('--tourne', (Math.random() * 720 - 360) + 'deg');
    calque().append(p);
    setTimeout(() => p.remove(), 4800);
  }
}
