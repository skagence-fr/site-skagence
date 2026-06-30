/**
 * SK Agence — Pricing Vitrine animations
 * Affecte les 3 grilles pricing : .pricing-vitrine, .pricing-ecommerce, .pricing-app.
 * Réutilise exclusivement les tokens de tokens.js (DURATIONS, EASES, STAGGER).
 * Aucune valeur magique inline.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATIONS, EASES, STAGGER } from './tokens.js';

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */

/**
 * Formate un entier en format français :
 * 1490 → "1 490" (espace insécable U+202F)
 */
function formatFR(n) {
  const s = String(Math.round(n));
  // Insère l'espace insécable tous les 3 chiffres depuis la droite
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Anime un compteur qui monte de startFrom jusqu'à target.
 * Vide le textContent AVANT de démarrer pour éviter tout flash du
 * contenu HTML en dur (ex : "4 900") qui serait visible entre le
 * chargement CSS et le premier tick GSAP.
 * Rend l'élément visible (opacity 1) dès le premier tick.
 */
function animateCounter(el, target, duration, ease, startFrom = 0) {
  if (!el) return;
  // Vide immédiatement le contenu statique HTML — élimine le yo-yo
  el.textContent = formatFR(startFrom);
  // Révèle l'élément (opacity 0 posée par CSS motion-ready)
  gsap.to(el, { opacity: 1, duration: 0.18, ease: 'power1.out' });
  const obj = { val: startFrom };
  gsap.to(obj, {
    val: target,
    duration,
    ease,
    onUpdate() {
      el.textContent = formatFR(obj.val);
    },
    onComplete() {
      // Garantit la valeur exacte (pas d'arrondi flottant)
      el.textContent = formatFR(target);
    },
  });
}

/**
 * Trace une coche SVG (stroke-dashoffset 20 → 0).
 * Ne modifie que stroke-dashoffset (attribut SVG, pas layout).
 */
function traceCheck(svgPath, delay = 0) {
  if (!svgPath) return;
  gsap.to(svgPath, {
    strokeDashoffset: 0,
    duration: DURATIONS.checkmark,
    ease: EASES.enter,
    delay,
  });
}

/**
 * Anime le prix + les lignes de bénéfices d'une carte.
 * @param {HTMLElement} card
 * @param {number}      targetPrice
 * @param {number}      [baseDelay=0]  délai initial avant de démarrer
 */
function animateCardContent(card, targetPrice, baseDelay = 0) {
  const amountEl = card.querySelector('.pcard__amount');
  const items    = Array.from(card.querySelectorAll('.pcard__item'));
  const checks   = Array.from(card.querySelectorAll('.pcard__check path'));

  // --- Compteur de prix ---
  // Lit data-price-start si disponible ; sinon calcule un round start cohérent
  const rawStart = amountEl?.dataset.priceStart;
  const startFrom = rawStart
    ? parseInt(rawStart, 10)
    : (targetPrice < 2000 ? 1000 : targetPrice < 3000 ? 2000 : 3000);
  animateCounter(
    amountEl,
    targetPrice,
    DURATIONS.counter,
    EASES.assert,
    startFrom
  );

  // --- Lignes de bénéfices : glissent de gauche + fade ---
  if (items.length) {
    gsap.fromTo(
      items,
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: DURATIONS.enter * 0.8,
        ease: EASES.enter,
        stagger: STAGGER.checkmark,
        delay: baseDelay + 0.12,
      }
    );
  }

  // --- Coches SVG : se tracent en cascade ---
  checks.forEach((path, i) => {
    traceCheck(path, baseDelay + 0.12 + i * STAGGER.checkmark);
  });
}

/* ──────────────────────────────────────────────
   Init d'une grille pricing individuelle
────────────────────────────────────────────── */

function initPricingGrid(grid) {
  const cards    = Array.from(grid.querySelectorAll('.pcard'));
  const center   = grid.querySelector('.pcard--center');
  const laterals = cards.filter((c) => c !== center);

  if (!cards.length) return;

  /* ── Mobile : 1 trigger par CARTE (les cartes sont stackées, on les anime à mesure qu'elles entrent dans le viewport) ── */
  const isMobile = window.matchMedia('(max-width: 880px)').matches;
  if (isMobile) {
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter() {
          gsap.to(card, {
            opacity: 1, y: 0, scale: 1,
            duration: DURATIONS.enter,
            ease: EASES.enter,
            clearProps: 'will-change,scale',
            onComplete() {
              card.querySelector('.pcard__name')?.classList.add('is-revealed');
              if (card.classList.contains('pcard--center')) {
                card.classList.add('border-revealed');
              }
              const price = parseInt(card.querySelector('.pcard__amount')?.dataset.price ?? '0', 10);
              animateCardContent(card, price, 0);
            },
          });
        },
      });
    });
    return;
  }

  /* ── Desktop : trigger global sur la grille (3 cartes visibles ensemble) ── */
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 78%',   // déclenche avant que l'œil n'arrive en bas — l'effet ne rate pas
    once: true,
    onEnter() {

      /* 1. Cartes latérales : révélation en stagger */
      gsap.to(laterals, {
        opacity: 1,
        y: 0,
        duration: DURATIONS.enter,
        ease: EASES.enter,
        stagger: STAGGER.group,
        clearProps: 'will-change',
        onComplete() {
          // Filets dorés sous les noms (déclenché par classe → transition CSS)
          laterals.forEach((card) => {
            card.querySelector('.pcard__name')?.classList.add('is-revealed');
          });
          // Contenu des latérales
          laterals.forEach((card) => {
            const price = parseInt(card.querySelector('.pcard__amount')?.dataset.price ?? '0', 10);
            animateCardContent(card, price, 0);
          });
        },
      });

      /* 2. Carte centrale : arrive ~160ms après, scale 0.96→1 */
      if (center) {
        // État initial scale
        gsap.set(center, { scale: 0.96 });

        gsap.to(center, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DURATIONS.enter,
          ease: EASES.assert,
          delay: DURATIONS.centerDelay,
          clearProps: 'will-change',
          onComplete() {
            // Filet doré sous le nom de la centrale
            center.querySelector('.pcard__name')?.classList.add('is-revealed');

            // Liseré or (::before) : apparition douce
            center.classList.add('border-revealed');

            // Contenu de la centrale
            const price = parseInt(
              center.querySelector('.pcard__amount')?.dataset.price ?? '0', 10
            );
            animateCardContent(center, price, 0);
          },
        });
      }
    },
  });

  /* ── Hover JS — renforcement sur la centrale uniquement ──
     Les cartes latérales sont 100% CSS.
     Sur la centrale : GSAP gère uniquement le liseré pulse
     (le :hover CSS s'en charge déjà, mais on s'assure de la cohérence). */

  // Rien de supplémentaire en JS ici : la pulse or est gérée
  // par l'animation CSS @keyframes gold-pulse sur .pcard--center:hover::before.
  // Le translateY hover est également CSS pur.
}

/* ──────────────────────────────────────────────
   Init principale — cible toutes les grilles pricing
────────────────────────────────────────────── */

export function initPricing() {
  const grids = document.querySelectorAll('.pricing-vitrine, .pricing-ecommerce, .pricing-app');
  grids.forEach(initPricingGrid);
}
