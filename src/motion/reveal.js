/**
 * SK Agence — Reveal au scroll
 * Utilise GSAP ScrollTrigger pour des apparitions cohérentes avec le langage de mouvement.
 *
 * Cible : [data-reveal] — éléments solo
 *         [data-reveal-group] — conteneur dont les enfants [data-reveal] s'animent en cascade
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATIONS, EASES, STAGGER, DISTANCES } from './tokens.js';

export function initReveal() {
  // Groupes d'abord : les enfants sont animés en stagger
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const children = Array.from(group.querySelectorAll('[data-reveal]'));
    if (!children.length) return;

    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          stagger: STAGGER.group,
          clearProps: 'will-change',
        });
      },
    });
  });

  // Éléments solo (pas dans un groupe)
  document.querySelectorAll('[data-reveal]:not([data-reveal-group] [data-reveal])').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.enter,
          ease: EASES.enter,
          clearProps: 'will-change',
        });
      },
    });
  });
}
