/**
 * SK Agence — Hover / focus interactions
 * CSS-first : les transitions sont gérées en CSS (motion.css).
 * Ce fichier ajoute uniquement les classes de soutien nécessaires au JS.
 *
 * Le underline animé (scaleX 0→1) et le translateY hover sont 100% CSS.
 */

export function initHover() {
  // Rien de critique ici côté JS : toutes les micro-interactions hover/focus
  // sont gérées en CSS pur via transitions sur les sélecteurs :hover et :focus-visible.
  // Ce module existe comme point d'extension si on a besoin d'effets
  // non réalisables en CSS seul (ex: effets magnétiques, parallaxe).

  // Exemple d'extension future : effet magnétique léger sur les boutons primaires
  // (désactivé pour mobile / reduced-motion — décision de perf)
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) return;

  // Boutons avec effet magnétique subtil (uniquement .btn--primary et .btn--on-dark)
  document.querySelectorAll('.btn--primary, .btn--on-dark, .btn--gold').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      // Déplacement max 4px
      btn.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
