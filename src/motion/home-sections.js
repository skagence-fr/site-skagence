/**
 * SK Agence — Home Sections animations
 * 4 gestes signatures, 4 sections, un seul langage (tokens.js).
 *
 * Section 1 · Pourquoi SK Agence — flip 3D de digits (rotateX)
 * Section 2 · Ce que je fais  — pictogrammes SVG tracés (stroke-dashoffset)
 * Section 3 · Méthode bref    — ligne or qui se trace + numéros s'allument
 * Section 4 · Contact         — clip-path ligne par ligne + formulaire en cascade
 *
 * Règles :
 *   - Animer UNIQUEMENT transform, opacity, stroke-dashoffset.
 *   - Aucune valeur magique inline : tout passe par tokens.js.
 *   - prefers-reduced-motion : rien ne s'anime, contenu lisible immédiatement.
 *   - Zéro CLS : les éléments occupent leur espace final dès le frame 1.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATIONS, EASES, STAGGER, DISTANCES } from './tokens.js';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TOKENS ÉTENDUS — variantes spécifiques aux sections home
   ============================================================ */

/** Flip de digit 3D — durée cible ~400 ms (0.4 s) */
const FLIP_DUR   = 0.4;
/** Stagger entre digits consécutifs du même chiffre */
const FLIP_STAG  = 0.08;
/** Easing du flip — EASES.assert (cubic-bezier(0.22, 1, 0.36, 1)) */
const FLIP_EASE  = EASES.assert;

/** Tracé SVG — durée cible ~900 ms */
const TRACE_DUR  = 0.9;
/** Stagger entre blocs services (3 blocs, 200 ms entre chacun) */
const TRACE_STAG = 0.2;

/** Durée de la ligne or méthode */
const LINE_DUR   = 1.4;
/** Délai d'allumage d'un numéro après que la ligne le dépasse */
const LIT_DUR    = 0.3;

/** Stagger entre champs du formulaire (100 ms) */
const FORM_STAG  = 0.1;

/* ============================================================
   SECTION 1 · POURQUOI SK AGENCE
   Geste : flip de digits 3D (compteur mécanique vintage)
   ============================================================ */

/**
 * Parcourt les nœuds texte d'un élément et wrap les suites de chiffres
 * en spans .flip-digit-wrap[aria-hidden] > .flip-digit.
 * Préserve la structure HTML (em, strong…) — ne touche qu'aux TextNodes.
 * Accessibilité : ajoute un aria-label sur l'élément racine avec le texte brut,
 * puis les .flip-digit-wrap sont aria-hidden.
 *
 * @param {HTMLElement} el
 * @returns {HTMLElement[]} tous les .flip-digit injectés
 */
function wrapDigits(el) {
  /* 1. Sauvegarde le texte brut avant modification pour aria-label */
  const plainText = el.textContent.trim();
  if (!/\d/.test(plainText)) return [];

  /* 2. Set aria-label sur le parent pour accessibilité */
  el.setAttribute('aria-label', plainText);

  const injected = [];

  /* 3. Parcours récursif des nœuds texte */
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!/\d/.test(text)) return;

      const tokens = text.match(/(\d+|\D+)/g) || [];
      const frag = document.createDocumentFragment();

      tokens.forEach(tok => {
        if (/^\d+$/.test(tok)) {
          const wrap = document.createElement('span');
          wrap.className = 'flip-digit-wrap';
          wrap.setAttribute('aria-hidden', 'true');

          for (const ch of tok) {
            const span = document.createElement('span');
            span.className = 'flip-digit';
            span.textContent = ch;
            wrap.appendChild(span);
            injected.push(span);
          }
          frag.appendChild(wrap);
        } else {
          frag.appendChild(document.createTextNode(tok));
        }
      });

      node.parentNode.replaceChild(frag, node);

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      /* Clone la liste des enfants car on modifie le DOM pendant le walk */
      Array.from(node.childNodes).forEach(walk);
    }
  }

  walk(el);
  return injected;
}

/**
 * Initialise les états de départ des digits pour le flip.
 * Appelé après wrapDigits, avant le ScrollTrigger.
 */
function initFlipState(digits) {
  gsap.set(digits, {
    rotateX: -90,
    opacity: 0,
    transformOrigin: 'center bottom',
  });
}

/**
 * Anime les digits en flip 3D au reveal.
 * @param {HTMLElement[]} digits
 * @param {number}        baseDelay  délai initial avant le premier digit
 */
function animateFlip(digits, baseDelay = 0) {
  gsap.to(digits, {
    rotateX: 0,
    opacity: 1,
    duration: FLIP_DUR,
    ease: FLIP_EASE,
    stagger: FLIP_STAG,
    delay: baseDelay,
    clearProps: 'will-change',
  });
}

/**
 * Initialise la section Pourquoi SK Agence.
 * - Grille bento (CSS seulement — déjà fait)
 * - Flip de digits sur les chiffres-clés
 * - Apparition en cascade asymétrique des cartes
 * - Hover franc géré en CSS (home-sections.css)
 */
function initPourquoi() {
  const grid = document.querySelector('.pourquoi__grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.diff__block'));
  if (!cards.length) return;

  /* --- Collecte et wrap des digits dans les titres --- */
  const allDigitSets = [];
  cards.forEach((card) => {
    const titleEl = card.querySelector('.diff__title');
    if (!titleEl) return;

    const digits = wrapDigits(titleEl);
    if (digits.length) {
      initFlipState(digits);
      allDigitSets.push({ card, digits });
    }
  });

  /* --- ScrollTrigger : cascade asymétrique + flip --- */
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 76%',
    once: true,
    onEnter() {
      /* Ordre d'apparition : carte héros (0) en premier, puis cascade
         diagonale : (1), (2), (3) — pas plat gauche-droite */
      const order = [0, 2, 1, 3]; /* héros, maintenance, design, interlocuteur */
      const CARD_STAG = 0.1; /* 100ms entre cartes */

      order.forEach((idx, i) => {
        const card = cards[idx];
        if (!card) return;
        const delay = i * CARD_STAG;

        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          delay,
          clearProps: 'will-change',
          onComplete() {
            /* Flip des digits de cette carte juste après son apparition */
            const set = allDigitSets.find(s => s.card === card);
            if (set) animateFlip(set.digits, 0);
          },
        });
      });
    },
  });
}

/* ============================================================
   SECTION 2 · CE QUE JE FAIS
   Geste : pictogrammes SVG tracés stroke-dashoffset
   ============================================================ */

/**
 * Calcule et initialise les stroke-dasharray/dashoffset de tous les
 * paths d'un SVG pour l'animation de tracé.
 * @param {SVGElement} svg
 * @returns {SVGPathElement[]} les paths animables (classe .picto-stroke)
 */
function initSVGTrace(svg) {
  const paths = Array.from(svg.querySelectorAll('.picto-stroke'));
  paths.forEach(path => {
    const len = path.getTotalLength ? path.getTotalLength() : 100;
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
  });
  return paths;
}

/**
 * Anime un picto SVG : tracé des paths + apparition du détail or.
 * @param {SVGElement} svg
 * @param {number}     delay  délai initial
 */
function traceSVG(svg, delay = 0) {
  const paths   = Array.from(svg.querySelectorAll('.picto-stroke'));
  const accents = Array.from(svg.querySelectorAll('.picto-accent, .picto-accent-stroke'));

  /* Tracé des paths — dashoffset → 0 */
  paths.forEach((path, i) => {
    const len = parseFloat(path.style.strokeDasharray) || 100;
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: TRACE_DUR,
      ease: EASES.enter,
      delay: delay + i * 0.12,
    });
  });

  /* Détail or : apparaît après le tracé */
  const accentDelay = delay + TRACE_DUR * 0.7;
  if (accents.length) {
    gsap.to(accents, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: EASES.enter,
      delay: accentDelay,
      stagger: 0.05,
    });
  }
}

/**
 * Initialise la section "Ce que je fais".
 * - Initialise les SVG pour le tracé
 * - ScrollTrigger : blocs apparaissent + pictos se tracent en stagger
 */
function initServices() {
  const grid = document.querySelector('.services__grid');
  if (!grid) return;

  const blocks = Array.from(grid.querySelectorAll('.service__block'));
  if (!blocks.length) return;

  /* Init SVG pour chaque bloc */
  blocks.forEach(block => {
    const svg = block.querySelector('.service__picto');
    if (svg) initSVGTrace(svg);

    /* Accents : scale initial pour l'apparition */
    const accents = Array.from(block.querySelectorAll('.picto-accent, .picto-accent-stroke'));
    gsap.set(accents, { scale: 0.6, opacity: 0, transformOrigin: 'center center' });
  });

  /* ScrollTrigger */
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 78%',
    once: true,
    onEnter() {
      blocks.forEach((block, i) => {
        const blockDelay = i * TRACE_STAG;

        /* Bloc apparaît */
        gsap.to(block, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          delay: blockDelay,
          clearProps: 'will-change',
        });

        /* Picto se trace après l'apparition du bloc */
        const svg = block.querySelector('.service__picto');
        if (svg) {
          traceSVG(svg, blockDelay + 0.15);
        }
      });
    },
  });
}

/* ============================================================
   SECTION 3 · MÉTHODE EN BREF
   Geste : ligne or qui se trace + numéros qui s'allument
   ============================================================ */

/**
 * Initialise la section Méthode en bref.
 * - Injecte la ligne or `.methode-bref__line` dans la liste
 * - Détecte si mobile (vertical) ou desktop (horizontal)
 * - Trace la ligne or, puis allume chaque numéro au passage de la ligne
 */
function initMethode() {
  const section = document.querySelector('.methode-bref');
  if (!section) return;

  const list  = section.querySelector('.methode-bref__list');
  const steps = Array.from(section.querySelectorAll('.methode-bref__step'));

  if (!list || !steps.length) return;

  /* Injection de la ligne or (élément décoratif, géré par JS) */
  let line = list.querySelector('.methode-bref__line');
  if (!line) {
    line = document.createElement('div');
    line.className = 'methode-bref__line';
    line.setAttribute('aria-hidden', 'true');
    list.prepend(line);
  }

  /* Numéros dans chaque étape */
  const nums = steps.map(s => s.querySelector('.methode-bref__num')).filter(Boolean);

  /* Dim initial de tous les numéros */
  nums.forEach(n => n.classList.add('is-dim'));

  const isMobile = () => window.innerWidth <= 768;

  ScrollTrigger.create({
    trigger: list,
    start: 'top 78%',
    once: true,
    onEnter() {
      /* 1. Apparition des étapes en stagger */
      gsap.to(steps, {
        opacity: 1,
        y: 0,
        duration: DURATIONS.enter,
        ease: EASES.enter,
        stagger: 0.12,
        clearProps: 'will-change',
      });

      /* 2. Tracé de la ligne or */
      const mobile = isMobile();
      const lineProp  = mobile ? 'scaleY' : 'scaleX';

      gsap.fromTo(
        line,
        { [lineProp]: 0 },
        {
          [lineProp]: 1,
          duration: LINE_DUR,
          ease: EASES.enter,
          delay: 0.25,
          onUpdate() {
            /* Calcule la progression et allume les numéros au passage */
            const progress = this.progress();
            const count    = nums.length;

            nums.forEach((num, idx) => {
              /* Seuil de déclenchement : quand la ligne atteint cet étape */
              const threshold = idx / (count - 1 || 1);
              /* Un peu avant le seuil exact pour effet naturel */
              const trigger   = Math.max(0, threshold - 0.05);

              if (progress >= trigger && num.classList.contains('is-dim')) {
                num.classList.remove('is-dim');
                num.classList.add('is-lit');
                gsap.fromTo(
                  num,
                  { opacity: 0.2 },
                  { opacity: 1, duration: LIT_DUR, ease: EASES.enter }
                );
              }
            });
          },
        }
      );
    },
  });
}

/* ============================================================
   SECTION 4 · CONTACT
   Geste : clip-path sur le titre + formulaire en cascade
   ============================================================ */

/**
 * Initialise la section Contact.
 * - Titre : révélation clip-path volet horizontal
 * - Sous-titre : fade-in
 * - Formulaire : champs en cascade (stagger 100 ms)
 */
function initContact() {
  const section = document.querySelector('.cta');
  if (!section) return;

  const titleEl    = section.querySelector('.cta__title');
  const subEl      = section.querySelector('.cta__sub');
  const tagEl      = section.querySelector('.cta__head .tag');
  const form       = section.querySelector('.quote');

  if (!titleEl) return;

  /* SÉCURITÉ TITRE : le titre est visible par défaut (pas de clip-path en CSS).
     On ajoute .cta__title--clipped MAINTENANT pour déclencher le clip, uniquement
     parce qu'on est dans cette fonction — ce qui signifie que GSAP a chargé et que
     l'init est confirmée. Si cette fonction n'est pas atteinte (JS crash, import fail),
     le titre reste lisible. */
  titleEl.classList.add('cta__title--clipped');

  /* On set uniquement le tag (non ciblé par CSS) */
  if (tagEl) gsap.set(tagEl, { opacity: 0 });

  /* Champs du formulaire — exclut les champs masqués (data-channel="tel" hidden)
     pour ne pas interférer avec la logique de tabs email/téléphone de main.js */
  let formEls = [];
  if (form) {
    formEls = [
      /* Champs visibles uniquement — [hidden] est géré par main.js */
      ...Array.from(form.querySelectorAll('.quote__field:not([hidden])')),
      form.querySelector('.quote__consent'),
      form.querySelector('.quote__submit-row'),
      form.querySelector('.quote__reassurance'),
    ].filter(Boolean);
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter() {
      /* 1. Tag eyebrow */
      if (tagEl) {
        gsap.to(tagEl, {
          opacity: 1,
          duration: DURATIONS.hover,
          ease: EASES.enter,
        });
      }

      /* 2. Titre — clip-path volet horizontal → révèle de gauche à droite
         clearProps via onComplete garantit que la propriété est bien retirée
         même si la timeline est interrompue en milieu de course */
      gsap.to(titleEl, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.6,
        ease: EASES.enter,
        delay: 0.1,
        onComplete() {
          /* Retire le clip-path ET la classe de sécurité — titre pleinement libre */
          gsap.set(titleEl, { clearProps: 'clipPath' });
          titleEl.classList.remove('cta__title--clipped');
        },
      });

      /* 3. Sous-titre — fade-in après le titre */
      if (subEl) {
        gsap.to(subEl, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          delay: 0.45,
        });
      }

      /* 4. Formulaire — cascade de champs */
      if (formEls.length) {
        gsap.to(formEls, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          stagger: FORM_STAG,
          delay: 0.55,
          clearProps: 'will-change',
        });
      }
    },
  });
}

/* ============================================================
   INIT PRINCIPALE
   ============================================================ */

export function initHomeSections() {
  /* Garde-fou : si reduced motion, le CSS a déjà tout rendu visible */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  initPourquoi();
  initServices();
  /* initMethode() retiré : la section méthode a été refondée en scroll-driven.
     Le nouveau module est src/motion/methode.js — appelé depuis index.js. */
  initContact();
}
