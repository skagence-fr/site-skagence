/**
 * SK Agence — Hero Mockup Animation
 * Cadre navigateur + mini-site qui se construit en boucle infinie (6 s).
 *
 * 5 étapes :
 *   1. Squelette nu       t=0      → 1.2s   — tout gris, figé
 *   2. Structure          t=1.2    → 2.4s   — nav items + titre en 2 lignes
 *   3. Design             t=2.4    → 3.6s   — couleurs inondent (ink, gold)
 *   4. Contenu            t=3.6    → 4.8s   — lignes texte, eyebrow, shape
 *   5. Livré              t=4.8    → 5.6s   — pastille or pulse, pause
 *   Reprise               t=5.6    → 6.0s   — cross-fade → reset → boucle
 *
 * Règle fondamentale : animer UNIQUEMENT transform et opacity
 * (+ background-color / color qui ne provoquent pas de layout).
 * Jamais width, height, top, left, font-size, box-shadow.
 */

import gsap from 'gsap';
import { DURATIONS, EASES, STAGGER } from './tokens.js';

/* ============================================================
   SÉLECTEURS
   ============================================================ */
function queryAll(scope, sel) {
  return Array.from(scope.querySelectorAll(sel));
}

/* ============================================================
   COULEURS — constantes résolues depuis les variables CSS
   On lit les valeurs une seule fois à l'init pour éviter les
   recalculs CSSOM dans la boucle.
   ============================================================ */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim();
}

/* ============================================================
   INIT
   ============================================================ */
export function initHeroMockup() {
  const wrap = document.querySelector('.hero__mockup-wrap');
  if (!wrap) return;

  /* prefers-reduced-motion : CSS gère l'état livré statique, on ne
     fait rien côté JS — la timeline n'est pas instanciée. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* --- Sélecteurs --- */
  const delivered    = wrap.querySelector('.browser-delivered');
  const stage        = wrap.querySelector('.browser-stage');

  const msHeaderEl   = wrap.querySelector('.ms-header');
  const msLogoEl     = wrap.querySelector('.ms-header__logo');
  const navItems     = queryAll(wrap, '.ms-header__nav-item');

  const titleLines   = queryAll(wrap, '.ms-hero__title-line');
  const eyebrow      = wrap.querySelector('.ms-hero__eyebrow');
  const subEl        = wrap.querySelector('.ms-hero__sub');
  const btnPrimary   = wrap.querySelector('.ms-hero__btn--primary');
  const btnGhost     = wrap.querySelector('.ms-hero__btn--ghost');

  const textLines    = queryAll(wrap, '.ms-section__text-line');
  const visualBlock  = wrap.querySelector('.ms-section__visual');
  const bracket      = wrap.querySelector('.ms-visual__bracket');
  const shape        = wrap.querySelector('.ms-visual__shape');

  const footerItems  = queryAll(wrap, '.ms-footer__item');

  /* --- Couleurs résolues --- */
  const C = {
    skel:    `color-mix(in srgb, ${getCSSVar('--c-ink')} 18%, transparent)`,
    skelMid: `color-mix(in srgb, ${getCSSVar('--c-ink')} 30%, transparent)`,
    ink:     getCSSVar('--c-ink'),
    inkSoft: getCSSVar('--c-ink-soft'),
    gold:    getCSSVar('--c-gold'),
    bg:      getCSSVar('--c-bg'),
    bgNav:   `color-mix(in srgb, ${getCSSVar('--c-bg')} 92%, ${getCSSVar('--c-ink')} 8%)`,
    paper:   getCSSVar('--c-paper') || getCSSVar('--c-bg'),
  };

  /* ============================================================
     WILL-CHANGE : activé à l'init, nettoyé après le premier cycle
     pour ne pas saturer la mémoire GPU en permanence.
     ============================================================ */
  const animated = [
    ...navItems, ...titleLines, ...textLines,
    ...footerItems,
    eyebrow, subEl, btnPrimary, btnGhost,
    visualBlock, bracket, shape, delivered,
    msHeaderEl, msLogoEl,
  ].filter(Boolean);

  animated.forEach(el => { el.style.willChange = 'transform, opacity'; });

  /* Nettoyage après 7 s (après le premier cycle complet + marge) */
  const willChangeTimer = setTimeout(() => {
    animated.forEach(el => { el.style.willChange = 'auto'; });
  }, 7000);

  /* ============================================================
     ÉTAT INITIAL — SQUELETTE (t=0)
     Tout gris, les éléments d'étape 2+ cachés ou à l'état squelette.
     ============================================================ */
  function setSkeletonState() {
    /* Header — transparent / gris squelette */
    gsap.set(msHeaderEl, { backgroundColor: 'transparent' });
    gsap.set(msLogoEl,   { backgroundColor: C.skel });
    navItems.forEach((item, i) => {
      gsap.set(item, {
        backgroundColor: C.skel,
        opacity:  i === 0 ? 1 : 0,      // seul le 1er item est visible au squelette
        x: i === 0 ? 0 : 8,             // les autres arrivent de droite à l'étape 2
      });
    });

    /* Titre — gros bloc unique simulé par les 2 lignes */
    titleLines.forEach(line => {
      gsap.set(line, { backgroundColor: C.skel, opacity: 1, scaleX: 1, x: 0 });
    });
    /* Initialement les 2 lignes se confondent : on n'en montre qu'une */
    gsap.set(titleLines[1], { opacity: 0 });

    gsap.set(subEl,       { backgroundColor: C.skel, opacity: 0.4 });
    gsap.set(eyebrow,     { opacity: 0, scaleX: 0 });

    gsap.set(btnPrimary,  { backgroundColor: C.skel });
    gsap.set(btnGhost,    { borderColor: C.skel, opacity: 1 });

    textLines.forEach(line => {
      gsap.set(line, { backgroundColor: C.skel, scaleX: 0, opacity: 1 });
    });

    gsap.set(visualBlock, { backgroundColor: C.skel });
    gsap.set(bracket,     { opacity: 0 });
    gsap.set(shape,       { opacity: 0, scale: 0.7 });

    footerItems.forEach(item => {
      gsap.set(item, { opacity: 0, backgroundColor: C.skelMid });
    });

    gsap.set(delivered, { opacity: 0, scale: 1 });
  }

  /* Assure que la stage est visible au reset (utile sur onRepeat) */
  const origSetSkeleton = setSkeletonState;
  function setSkeletonStateWithStage() {
    gsap.set(stage, { opacity: 1 });
    origSetSkeleton();
  }

  /* Appel initial */
  setSkeletonStateWithStage();

  /* ============================================================
     TIMELINE MAÎTRESSE — repeat infini
     ============================================================ */
  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: EASES.enter },
    onRepeat: setSkeletonStateWithStage,   // reset propre à chaque reprise
  });

  /* --------------------------------------------------------
     ÉTAPE 1 — Squelette nu (0 → 1.2 s)
     Rien ne s'anime. On "attend" que le visiteur enregistre.
     -------------------------------------------------------- */
  tl.addLabel('skeleton', 0);
  /* Pause implicite : on ajoute juste un .to vide pour tenir 1.2 s */
  tl.to({}, { duration: DURATIONS.mockupStep }, 'skeleton');

  /* --------------------------------------------------------
     ÉTAPE 2 — Structure (1.2 → 2.4 s)
     Nav items glissent depuis la droite.
     Titre se sépare en 2 lignes distinctes.
     -------------------------------------------------------- */
  tl.addLabel('structure', DURATIONS.mockupStep);

  /* Nav items 2 et 3 apparaissent en stagger depuis la droite */
  navItems.slice(1).forEach((item, i) => {
    tl.to(item,
      {
        opacity: 1,
        x: 0,
        duration: DURATIONS.mockupFade,
        ease: EASES.enter,
      },
      `structure+=${i * STAGGER.mockup}`
    );
  });

  /* Ligne 2 du titre apparaît → effet "bloc → 2 lignes" */
  tl.to(titleLines[1],
    { opacity: 1, duration: DURATIONS.mockupFade, ease: EASES.hover },
    `structure+=0.1`
  );

  /* Sous-titre légèrement plus visible */
  tl.to(subEl,
    { opacity: 0.65, duration: DURATIONS.mockupFade },
    `structure+=0.15`
  );

  /* Fin étape 2 : on attend jusqu'à t=2.4 */
  tl.to({}, { duration: 0.1 }, `structure+=${DURATIONS.mockupStep - 0.3}`);

  /* --------------------------------------------------------
     ÉTAPE 3 — Design (2.4 → 3.6 s)
     Couleurs inondent : ink + gold. Pas de layout.
     -------------------------------------------------------- */
  tl.addLabel('design', DURATIONS.mockupStep * 2);

  /* Header bleu nuit */
  tl.to(msHeaderEl,
    { backgroundColor: C.ink, duration: DURATIONS.mockupColor, ease: EASES.enter },
    'design'
  );
  tl.to(msLogoEl,
    { backgroundColor: C.bg, duration: DURATIONS.mockupColor },
    'design+=0.05'
  );
  navItems.forEach((item, i) => {
    tl.to(item,
      { backgroundColor: C.bg, duration: DURATIONS.mockupColor },
      `design+=${0.05 + i * 0.04}`
    );
  });

  /* Titre bleu nuit */
  titleLines.forEach((line, i) => {
    tl.to(line,
      { backgroundColor: C.ink, duration: DURATIONS.mockupColor },
      `design+=${0.1 + i * 0.05}`
    );
  });

  /* Bouton primaire or */
  tl.to(btnPrimary,
    { backgroundColor: C.gold, duration: DURATIONS.mockupColor, ease: EASES.enter },
    'design+=0.15'
  );

  /* Bouton ghost — outline ink */
  tl.to(btnGhost,
    { borderColor: C.ink, duration: DURATIONS.mockupColor },
    'design+=0.18'
  );

  /* Bloc visuel — bleu nuit */
  tl.to(visualBlock,
    { backgroundColor: C.ink, duration: DURATIONS.mockupColor },
    'design+=0.2'
  );

  /* Équerre dorée apparaît sur le bloc */
  tl.to(bracket,
    {
      opacity: 1,
      duration: DURATIONS.mockupFade,
      ease: EASES.enter,
    },
    'design+=0.3'
  );

  /* --------------------------------------------------------
     ÉTAPE 4 — Contenu (3.6 → 4.8 s)
     Traits de texte, eyebrow, shape géométrique, footer.
     -------------------------------------------------------- */
  tl.addLabel('content', DURATIONS.mockupStep * 3);

  /* Traits de texte : extension scaleX 0 → 1 en cascade */
  textLines.forEach((line, i) => {
    tl.to(line,
      {
        scaleX: 1,
        duration: DURATIONS.enter,
        ease: EASES.enter,
      },
      `content+=${i * STAGGER.mockupLine}`
    );
  });

  /* Eyebrow doré — scale + opacité */
  tl.fromTo(eyebrow,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: DURATIONS.mockupFade, ease: EASES.enter },
    'content+=0.1'
  );

  /* Shape concentriques */
  tl.to(shape,
    {
      opacity: 1,
      scale: 1,
      duration: DURATIONS.enter,
      ease: EASES.enter,
    },
    'content+=0.2'
  );

  /* Footer items */
  footerItems.forEach((item, i) => {
    tl.to(item,
      { opacity: 1, duration: DURATIONS.mockupFade },
      `content+=${0.3 + i * STAGGER.mockup}`
    );
  });

  /* --------------------------------------------------------
     ÉTAPE 5 — Livré (4.8 → 5.6 s)
     Pastille or pulse une fois, puis stabilisée.
     Timing interne :
       4.80 → 5.00 : apparition opacity 0→1 (0.2 s)
       5.00 → 5.15 : pulse montée scale 1→1.2 (0.15 s)
       5.15 → 5.30 : pulse descente scale 1.2→1 (0.15 s)
       5.30 → 5.60 : hold état complet (0.30 s)
     Total étape 5 = 0.8 s → t=5.6 → reprise
     -------------------------------------------------------- */
  tl.addLabel('delivered', DURATIONS.mockupStep * 4);

  /* Pastille apparaît */
  tl.to(delivered,
    { opacity: 1, duration: 0.2, ease: EASES.enter },
    'delivered'
  );

  /* Pulse montée */
  tl.to(delivered,
    { scale: 1.2, duration: 0.15, ease: EASES.hover },
    'delivered+=0.2'
  );

  /* Pulse descente */
  tl.to(delivered,
    { scale: 1, duration: 0.15, ease: EASES.hover },
    'delivered+=0.35'
  );

  /* Hold : attend jusqu'à t = delivered + 0.8 = 5.6 */
  tl.to({}, { duration: 0.3 }, 'delivered+=0.5');

  /* --------------------------------------------------------
     REPRISE (5.6 → 6.0 s)
     Cross-fade : opacité du contenu enrichi → 0, puis reset
     instantané sous le voile, puis retour opacité 1.
     -------------------------------------------------------- */
  /* delivered+0.8 = 4.8+0.8 = 5.6 */
  tl.addLabel('reset', DURATIONS.mockupStep * 4 + 0.8);

  /* Fondu sortie — on fait disparaître la stage */
  tl.to(stage,
    { opacity: 0, duration: DURATIONS.mockupOut, ease: 'power2.in' },
    'reset'
  );

  /* Reset instantané des états (set sous l'opacity 0, stage déjà invisible) */
  tl.call(setSkeletonState, null, `reset+=${DURATIONS.mockupOut}`);

  /* Retour visible */
  tl.to(stage,
    { opacity: 1, duration: 0.2, ease: EASES.hover },
    `reset+=${DURATIONS.mockupOut + 0.02}`
  );

  /* ============================================================
     MOBILE : timeline légèrement accélérée (×0.85)
     ============================================================ */
  function applyMobileScale() {
    if (window.innerWidth < 768) {
      tl.timeScale(1.15); // ~15% plus rapide sur mobile
    } else {
      tl.timeScale(1);
    }
  }
  applyMobileScale();

  /* Mise à jour si l'utilisateur redimensionne (orientation change) */
  window.addEventListener('resize', applyMobileScale, { passive: true });

  /* ============================================================
     PAUSE HORS VIEWPORT — IntersectionObserver
     La timeline infinie consomme du GPU même quand le hero
     n'est pas visible. On la met en pause dès qu'il quitte
     le viewport et on la reprend quand il revient.
     ============================================================ */
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tl.resume();
        } else {
          tl.pause();
        }
      });
    },
    { threshold: 0.1 } // 10% du hero visible suffit à relancer
  );
  visibilityObserver.observe(wrap);

  /* ============================================================
     NETTOYAGE (si le composant est un jour retiré du DOM)
     ============================================================ */
  wrap._mockupCleanup = function () {
    tl.kill();
    clearTimeout(willChangeTimer);
    window.removeEventListener('resize', applyMobileScale);
    visibilityObserver.disconnect();
  };
}
