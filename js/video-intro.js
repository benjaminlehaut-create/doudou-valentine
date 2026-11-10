// Le petit clip d’intro (#video-intro dans index.html), partagé entre le tout premier lancement
// (js/app.js) et le bouton « revoir la vidéo » de l’accueil (js/accueil.js).
// S’il n’existe pas (assets/videos/intro.mp4 absent), « suite » est appelée tout de suite :
// l’appli marche très bien sans.

export function jouerVideoIntro(suite = () => {}) {
  const video = document.getElementById('video-intro');
  let fait = false;
  const terminer = () => {
    if (fait) return;
    fait = true;
    // « suite » est appelée dès que la vidéo commence à s’effacer (fondu enchaîné avec ce qui
    // apparaît derrière), jamais après : pas de coupure nette entre les deux.
    video.classList.add('disparait');
    suite();
    setTimeout(() => {
      video.classList.add('cache');
      video.classList.remove('disparait');
      video.pause();
    }, 600);
  };
  video.classList.remove('cache', 'disparait');
  video.currentTime = 0;
  video.addEventListener('ended', terminer, { once: true });
  video.addEventListener('error', terminer, { once: true });
  video.play().catch(terminer);
  setTimeout(terminer, 15000); // sécurité, au cas où la vidéo ne déclenche jamais « ended »
}
