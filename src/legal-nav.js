/* ============================================================
   SK AGENCE — Mini-script de navigation pour les pages légales
   (mentions-legales.html, politique-confidentialite.html)

   Charge UNIQUEMENT ce qu'il faut pour le burger mobile : pas de GSAP,
   pas de Lenis, pas de motion engine. Léger, isolé, autonome.

   - Toggle ouverture / fermeture du menu overlay
   - Scroll-lock sur <html> (pas <body>) — fix Safari iOS BFCache
   - Fermeture au clic sur un lien du menu, sur le bouton close, ou Escape
   - Focus management : premier lien à l'ouverture, retour au burger à la fermeture
   - BFCache : restauration de l'overflow au retour arrière
   ============================================================ */

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');

const openMenu = () => {
  menu?.classList.add('is-open');
  menu?.setAttribute('aria-hidden', 'false');
  burger?.setAttribute('aria-expanded', 'true');
  document.documentElement.style.overflow = 'hidden';
  const firstLink = menu?.querySelector('a');
  firstLink?.focus({ preventScroll: true });
};

const closeMenu = () => {
  menu?.classList.remove('is-open');
  menu?.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = '';
  burger?.focus({ preventScroll: true });
};

burger?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// BFCache : Safari restaure parfois l'état précédent (menu ouvert) au retour arrière
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.documentElement.style.overflow = '';
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden', 'true');
    burger?.setAttribute('aria-expanded', 'false');
  }
});
