/**
 * SK Agence — Section Méthode : Timeline or verticale, scroll-driven
 *
 * CONCEPT :
 *   Une ligne or se trace verticalement au scroll. Un marqueur unique
 *   (track-head) avance à la tête de la ligne. 4 étapes s'allument
 *   en 3 états (à venir / active / done) au fil du scroll.
 *   4 dots fixes sur le rail, positionnés par JS sur l'axe du rail,
 *   alignés avec le haut du contenu de chaque step.
 *
 * ARCHITECTURE — ANCRAGE RÉEL PAR ÉTAPE (correctif #2) :
 *   À chaque frame de scroll, on lit la position RÉELLE de chaque .methode__step
 *   (getBoundingClientRect) par rapport au milieu du viewport. La track-head
 *   et l'activation des dots sont calculées en interpolant entre les CENTRES
 *   réels des étapes — pas via un proxy progress 0→1 étalé linéairement sur
 *   la hauteur de section. Conséquence : la course de la ligne ne peut PAS
 *   être compressée par une mauvaise estimation de la hauteur.
 *
 * SCROLLTRIGGER :
 *   - start: 'top bottom' / end: 'bottom top' (range large, juste pour fire onUpdate
 *     pendant que la section est visible)
 *   - PAS de scrub : sync direct sur géométrie réelle, aucune inertie globale.
 *   - onRefresh : relit la géométrie (cache rail + positions dots) puis re-sync.
 *
 * RÈGLE D'ACTIVATION (synchro 1:1 avec le regard) :
 *   step i active   ⇔ viewportMid ∈ [center_i, center_(i+1))   (dernier reste active jusqu'à fin section)
 *   step i done     ⇔ viewportMid ≥ center_(i+1)
 *   step i à venir  ⇔ viewportMid < center_i
 *   track-head pos  = interpolation linéaire entre dot_i et dot_(i+1)
 *                     en fonction de (viewportMid - center_i) / (center_(i+1) - center_i).
 *   Au-delà du dernier centre, on interpole jusqu'au bas de la section (point virtuel)
 *   pour que la ligne continue à descendre jusqu'au bas du rail.
 *
 * DOTS :
 *   Placés dans le rail HTML (4 divs .methode__dot).
 *   JS les positionne verticalement après rendu (ResizeObserver).
 *   Classes : is-active / is-done (pilotées par JS, pas par le step).
 *
 * DÉTAILS SIGNATURE SVG :
 *   stroke-dasharray / stroke-dashoffset animé via GSAP
 *   à l'entrée de chaque étape (once par étape).
 *   03 Blocs : 3 rects en cascade (stagger 80ms).
 *
 * TOKENS UTILISÉS :
 *   DURATIONS.methodeSignature   — 350ms tracé SVG (helper drawSignature, no-op au B5)
 *
 * REDUCED-MOTION :
 *   CSS gère l'état final via @media (prefers-reduced-motion: reduce).
 *   JS s'arrête immédiatement si reduce est actif (géré par initMotion).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Durées locales du tracé SVG (no-op si SVG retirés au B5 Temps 1) ─── */
const DUR_SIG   = 0.35;
const EASE_SIG  = 'power3.out';

export function initMethode() {
  const section = document.querySelector('.methode');
  if (!section) return;

  /* ─── Reduced-motion : CSS gère l'état final, JS s'arrête ─── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* Positionner les dots sans animation pour RM */
    positionDots(section);
    return;
  }

  /* ─── Éléments DOM ─── */
  const trackLine  = section.querySelector('#methode-track-line');
  const trackHead  = section.querySelector('#methode-track-head');
  const stepEls    = section.querySelectorAll('.methode__step');
  const dotEls     = section.querySelectorAll('.methode__dot');
  const rail       = section.querySelector('.methode__rail');

  if (!trackLine || !trackHead || stepEls.length === 0 || !rail) return;

  /* ─── Initialisation des SVG signature (no-op si SVG retirés au B5 Temps 1) ─── */
  const sigData = initSignatures(stepEls);

  /* ─── État de suivi des steps (-1 à venir / 0 active / 1 done) ─── */
  const stepStates = Array.from({ length: stepEls.length }, () => -1);

  /* ─── Caches géométrie — recalculés à chaque refresh ─── */
  let cachedRailH = 0;
  let dotPositionsPx = []; // position absolue (px) du centre de chaque dot dans le rail

  /* ─── Lissage visuel (lerp) — boucle rAF continue pour glissement beurré.
     sync() écrit la CIBLE (targetHeadPx) ; tick() interpole current → target
     à chaque frame écran et écrit head + line (solidaires).
     SMOOTH = 0.18 : ~90 % de la distance parcourue en ~12 frames (~200 ms à
     60 fps). Bon compromis douceur / réactivité — imperceptible sur desktop,
     gomme le "grain" iOS où les events scroll arrivent par paquets. */
  const SMOOTH = 0.18;
  let targetHeadPx  = 0;
  let currentHeadPx = 0;

  function readGeometry() {
    positionDots(section); // place dot.style.top = centre vertical de chaque étape
    cachedRailH = rail.offsetHeight;
    dotPositionsPx = Array.from(dotEls).map((d) => parseFloat(d.style.top) || 0);
  }

  /* ─── Application de l'état d'une étape (CSS classes + snap + SVG signature + B5 Temps 2) ─── */
  function applyStepState(step, dot, state, prevState, i) {
    step.classList.toggle('is-active', state === 0);
    step.classList.toggle('is-done',   state === 1);

    if (dot) {
      dot.classList.toggle('is-active', state === 0);
      dot.classList.toggle('is-done',   state === 1);
    }

    if (state === 1 && prevState === 0 && dot) {
      triggerDotSnap(dot);
    }

    /* Signatures SVG : guards en place (paths = [] si SVG retirés au B5 Temps 1) */
    if (state >= 0 && !sigData[i].drawn) {
      sigData[i].drawn = true;
      drawSignature(sigData[i]);
    }
    if (state === -1 && sigData[i].drawn) {
      sigData[i].drawn = false;
      resetSignature(sigData[i]);
    }

    /* B5 Temps 2 : animations internes de la mini-interface.
       On RÉUTILISE le signal is-active déjà calculé par le moteur de synchro,
       pas de second ScrollTrigger. À l'entrée en "active" (depuis "à venir"),
       on ajoute .is-revealed → CSS keyframes jouent. À la sortie (retour à
       "à venir"), on retire la classe → permet de rejouer au prochain passage. */
    const visual = step.querySelector('.methode__visual');
    if (visual) {
      if (state >= 0 && prevState === -1) {
        revealVisual(visual, i);
      } else if (state === -1 && prevState >= 0) {
        hideVisual(visual, i);
      }
    }
  }

  /* ─── B5 Temps 2 : helpers d'animation interne ─── */
  /* Trackers d'animations en cours (pour annuler proprement au scroll inverse) */
  const visualTimers = new Map(); // i → setTimeout id
  const visualRafs   = new Map(); // i → requestAnimationFrame id

  function revealVisual(visual, i) {
    visual.classList.add('is-revealed');

    /* Étape 04 (i=3) : compteur perf 0 → 100 (synchronisé avec l'apparition du badge) */
    if (i === 3) {
      cancelVisualJob(i);
      const numEl = visual.querySelector('.ui-live__perf-num');
      if (numEl) {
        const tid = setTimeout(() => {
          visualTimers.delete(i);
          animateCount(numEl, 100, 1000, i);
        }, 700);
        visualTimers.set(i, tid);
      }
    }
  }

  function hideVisual(visual, i) {
    visual.classList.remove('is-revealed');

    /* Annule animations JS en cours + reset état final affiché si pas d'anim */
    if (i === 3) {
      cancelVisualJob(i);
      const numEl = visual.querySelector('.ui-live__perf-num');
      if (numEl) numEl.textContent = '100';
    }
  }

  function cancelVisualJob(i) {
    if (visualTimers.has(i)) {
      clearTimeout(visualTimers.get(i));
      visualTimers.delete(i);
    }
    if (visualRafs.has(i)) {
      cancelAnimationFrame(visualRafs.get(i));
      visualRafs.delete(i);
    }
  }

  /* Compteur numérique 0 → target sur duration ms (easeOutQuad) */
  function animateCount(el, target, duration, i) {
    const from = 0;
    const start = performance.now();
    el.textContent = String(from);
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 1 ? 1 - (1 - t) * (1 - t) : 1;
      const val = Math.round(from + (target - from) * eased);
      el.textContent = String(val);
      if (t < 1) {
        visualRafs.set(i, requestAnimationFrame(frame));
      } else {
        visualRafs.delete(i);
      }
    }
    visualRafs.set(i, requestAnimationFrame(frame));
  }

  /* ─── Snap animation du dot (active → done) ─── */
  function triggerDotSnap(dot) {
    dot.classList.remove('is-snap');
    void dot.offsetWidth; // force reflow
    dot.classList.add('is-snap');
    setTimeout(() => dot.classList.remove('is-snap'), 300);
  }

  /* ─── SYNC — ANCRAGE RÉEL PAR ÉTAPE (correctif #2) + RAMPE D'ENTRÉE (correctif #3)
     À chaque appel, on relit le centre de chaque .methode__step dans le
     viewport, puis on calcule headPx par interpolation linéaire entre
     les dots adjacents — et non depuis un progress global compressé.
     Le PREMIER segment (haut du rail → dot 1) utilise la même mécanique :
     interpolation glissante entre une "ancre d'entrée" (step 1 entre dans
     l'écran) et center_0 (step 1 au centre du viewport).
     ───────────────────────────────────────────────────────────────────── */
  function sync() {
    if (cachedRailH <= 0 || stepEls.length === 0) return;

    const innerH = window.innerHeight;
    const viewportMid = innerH / 2;
    const N = stepEls.length;

    /* Centre vertical de chaque étape dans le repère viewport (px depuis top viewport) */
    const centers = new Array(N);
    for (let i = 0; i < N; i++) {
      const r = stepEls[i].getBoundingClientRect();
      centers[i] = r.top + r.height / 2;
    }

    /* "Point virtuel" = bas de la section, pour laisser la ligne continuer à
       descendre entre le dernier dot et le bas du rail quand on scroll au-delà
       de la dernière étape (cohérent avec l'ancien comportement scaleY → 1). */
    const sectionBottom = section.getBoundingClientRect().bottom;
    const anchorsY  = [...centers, sectionBottom];
    const anchorsPx = [...dotPositionsPx, cachedRailH];

    /* === Correctif #3 : ANCRE D'ENTRÉE du 1er segment ===
       entryAnchorValue = valeur que prend centers[0] au moment précis où
       le HAUT de l'étape 1 atteint le BAS du viewport (step1.top === innerH).
       À ce moment, step1.center = innerH + step1.height/2.
       Sémantique : "l'étape 1 commence clairement à entrer dans l'écran"
       → la track-head amorce un glissement progressif de 0 vers dotPos[0]. */
    const step1Height = stepEls[0].getBoundingClientRect().height;
    const entryAnchorValue = innerH + step1Height / 2;

    /* Position de la track-head (px sur le rail) par interpolation linéaire */
    let headPx;
    if (centers[0] >= entryAnchorValue) {
      /* Étape 1 pas encore entrée dans le viewport → ligne à 0 (inchangé) */
      headPx = 0;
    } else if (centers[0] > viewportMid) {
      /* PREMIER SEGMENT (correctif #3) : étape 1 entre dans l'écran mais
         pas encore au centre. Glissement de 0 vers dotPos[0] proportionnel
         à la descente de centers[0] entre entryAnchorValue et viewportMid.
         Symétrique au scroll inverse : la ligne se RÉTRACTE en glissant. */
      const span = entryAnchorValue - viewportMid;
      const t = span > 0 ? (entryAnchorValue - centers[0]) / span : 0;
      headPx = t * dotPositionsPx[0];
    } else if (viewportMid >= anchorsY[anchorsY.length - 1]) {
      /* Au-delà du point virtuel (= bas section) → ligne à 100% */
      headPx = cachedRailH;
    } else {
      /* MAPPING DOT 1 → DOT 4 (correctif #2, validé) — INCHANGÉ.
         Interpolation entre les centres réels des étapes successives. */
      headPx = 0;
      for (let i = 0; i < anchorsY.length - 1; i++) {
        if (viewportMid >= anchorsY[i] && viewportMid < anchorsY[i + 1]) {
          const span = anchorsY[i + 1] - anchorsY[i];
          const t = span > 0 ? (viewportMid - anchorsY[i]) / span : 0;
          headPx = anchorsPx[i] + t * (anchorsPx[i + 1] - anchorsPx[i]);
          break;
        }
      }
    }

    /* Écriture CIBLE (pas de DOM ici pour head/line) — la position visuelle
       est ensuite lissée par tick() dans une boucle rAF continue.
       Track-head ET track-line sont pilotées par currentHeadPx dans tick()
       pour rester solidaires (aucun décalage visuel head/line). */
    targetHeadPx = headPx;

    /* États des steps — calés sur les centres réels :
       active ⇔ viewportMid ∈ [center_i, center_(i+1)) ; dernier reste active. */
    for (let i = 0; i < N; i++) {
      let newState;
      if (viewportMid < centers[i]) {
        newState = -1; // à venir
      } else if (i < N - 1 && viewportMid >= centers[i + 1]) {
        newState = 1; // done
      } else {
        newState = 0; // active
      }

      if (newState !== stepStates[i]) {
        const prev = stepStates[i];
        stepStates[i] = newState;
        applyStepState(stepEls[i], dotEls[i], newState, prev, i);
      }
    }
  }

  /* ─── Boucle rAF continue — lisse la track-head (et la track-line solidaire).
     Interpolation linéaire (lerp) current → target à chaque frame écran :
       current += (target - current) * SMOOTH
     Snap final anti-oscillation quand |delta| < 0.1 px : garantit que le head
     atteint exactement sa position finale à l'arrêt du scroll (pas figé court).
     ÉTATS des dots (is-active/is-done) restent pilotés directement par sync() —
     l'allumage reste synchro avec le scroll réel, seul le glissement visuel
     de la track-head/line est lissé. */
  function tick() {
    const delta = targetHeadPx - currentHeadPx;
    if (Math.abs(delta) < 0.1) {
      currentHeadPx = targetHeadPx;
    } else {
      currentHeadPx += delta * SMOOTH;
    }
    trackHead.style.transform = `translate(-50%, calc(-50% + ${currentHeadPx}px))`;
    const scaleY = cachedRailH > 0
      ? Math.max(0, Math.min(1, currentHeadPx / cachedRailH))
      : 0;
    trackLine.style.transform = `translateX(-50%) scaleY(${scaleY})`;
    requestAnimationFrame(tick);
  }

  /* ─── Init géométrie + 1re sync + init anti-flash + démarrage boucle ─── */
  readGeometry();
  sync();                          /* calcule targetHeadPx */
  currentHeadPx = targetHeadPx;    /* cale current sur target → pas de flash 0→pos */
  requestAnimationFrame(tick);     /* démarre la boucle continue */

  /* ─── ScrollTrigger : un seul, range large (section visible), PAS de scrub.
     onUpdate fire à chaque scroll-frame → sync() met à jour targetHeadPx +
     états. tick() (boucle continue) lisse la position visuelle. Pas besoin
     de dédup rAF ici : sync() lui-même est léger (pas d'écriture DOM head/line),
     et tick() garantit au plus 1 écriture head/line par frame écran. ─── */
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end:   'bottom top',
    onUpdate: sync,
    onRefresh: () => {
      readGeometry();
      sync();
    },
  });

  /* ResizeObserver : layout change → refresh ScrollTrigger → onRefresh ci-dessus
     → readGeometry + sync. Couvre les cas où la section change de taille sans scroll
     (rotation device, font swap tardif, image décodée…). */
  const ro = new ResizeObserver(() => {
    ScrollTrigger.refresh();
  });
  ro.observe(section);
}

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * positionDots — Place chaque .methode__dot sur le CENTRE vertical de son étape.
 * Les dots sont dans le rail (position absolute, transform translate -50%/-50%) :
 * `top = centreVerticalDeLEtape` met le centre du dot pile au milieu de l'étape.
 *
 * Pourquoi le centre (et non le haut) ?
 *   Le scrub est calé sur 'top center' → 'bottom center' (passage de la section
 *   devant le milieu du viewport). Quand le centre du viewport atteint le centre
 *   d'une étape, l'utilisateur est en train de la LIRE — c'est le bon moment
 *   pour allumer le dot correspondant.
 */
function positionDots(section) {
  const rail    = section.querySelector('.methode__rail');
  const stepEls = section.querySelectorAll('.methode__step');
  const dotEls  = section.querySelectorAll('.methode__dot');

  if (!rail || stepEls.length === 0) return;

  const railRect = rail.getBoundingClientRect();

  stepEls.forEach((step, i) => {
    const dot = dotEls[i];
    if (!dot) return;

    const stepRect = step.getBoundingClientRect();
    /* Centre vertical de l'étape, dans le repère du rail */
    const relTop = stepRect.top - railRect.top + stepRect.height / 2;
    dot.style.top = `${relTop}px`;
  });
}

/**
 * initSignatures — Lit les longueurs de chemin SVG et initialise l'état masqué.
 */
function initSignatures(stepEls) {
  return Array.from(stepEls).map((step) => {
    const sig   = step.querySelector('.methode__sig');
    const paths = sig ? Array.from(sig.querySelectorAll('.methode__sig-path')) : [];

    const pathData = paths.map((path) => {
      let len;
      if (typeof path.getTotalLength === 'function') {
        try { len = path.getTotalLength(); } catch { len = 60; }
      } else {
        /* Rect : périmètre */
        const w = parseFloat(path.getAttribute('width') || 10);
        const h = parseFloat(path.getAttribute('height') || 10);
        len = (w + h) * 2;
      }
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
      return { el: path, len };
    });

    return { sig, paths: pathData, drawn: false };
  });
}

/**
 * drawSignature — Anime le tracé stroke-dashoffset de chaque path.
 * Pour les 3 rects (step 03), cascade avec stagger 80ms.
 */
function drawSignature({ paths }) {
  paths.forEach(({ el }, j) => {
    gsap.to(el, {
      strokeDashoffset: 0,
      duration: DUR_SIG,
      ease: EASE_SIG,
      delay: j * 0.08,
    });
  });
}

/**
 * resetSignature — Remet les paths en état masqué (remontée du scroll).
 */
function resetSignature({ paths }) {
  paths.forEach(({ el, len }) => {
    gsap.set(el, { strokeDashoffset: len });
  });
}
