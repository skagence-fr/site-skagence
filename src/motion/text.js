/**
 * SK Agence — Révélation mot à mot du hero
 * Utilise SplitType pour découper en mots.
 * Cible : [data-reveal-text] sur le <h1> hero.
 * Le sous-titre et le CTA enchaînent en cascade après la fin des mots.
 */

import gsap from 'gsap';
import SplitType from 'split-type';
import { DURATIONS, EASES, STAGGER, DISTANCES } from './tokens.js';

export function initHeroText() {
  const heroTitle = document.querySelector('[data-reveal-text]');
  if (!heroTitle) return;

  // Découpe en mots
  const split = new SplitType(heroTitle, { types: 'words', tagName: 'span' });
  const words = split.words;
  if (!words || !words.length) return;

  // Durée totale de la révélation des mots (pour calculer le délai de la cascade)
  const totalHeroDuration = DURATIONS.heroIn + (words.length - 1) * STAGGER.text;

  // Révélation des mots
  gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: DURATIONS.heroIn,
    ease: EASES.enter,
    stagger: STAGGER.text,
    delay: 0.1, // légère respiration après le loader
  });

  // Cascade : sous-titre + CTA + elements hero foot + hero media (index.html)
  // Sur en-savoir-plus.html : kicker + lead dans .p2-hero
  const cascadeEls = [
    '.hero__text > .tag',
    '.hero__text > .hero__sub',
    '.hero__text > .hero__accroche',
    '.hero__text > .hero__cta-row',
    '.p2-hero__kicker',
    '.p2-hero__lead',
  ]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  const heroMedia = document.querySelector('.hero__media');
  const heroFoot = document.querySelector('.hero__foot');

  // Les éléments de cascade arrivent après que les mots ont fini
  const cascadeDelay = 0.1 + totalHeroDuration * 0.6;

  if (cascadeEls.length) {
    gsap.to(cascadeEls, {
      opacity: 1,
      y: 0,
      duration: DURATIONS.enter,
      ease: EASES.enter,
      stagger: STAGGER.group,
      delay: cascadeDelay,
    });
  }

  // Le visuel hero entre ~300ms après le début des mots
  if (heroMedia) {
    gsap.to(heroMedia, {
      opacity: 1,
      y: 0,
      duration: DURATIONS.enter,
      ease: EASES.enter,
      delay: 0.3,
    });
  }

  if (heroFoot) {
    gsap.to(heroFoot, {
      opacity: 1,
      y: 0,
      duration: DURATIONS.enter,
      ease: EASES.enter,
      delay: cascadeDelay + STAGGER.group * cascadeEls.length,
    });
  }
}
