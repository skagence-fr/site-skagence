/**
 * SK Agence — Motion system entry point
 * Orchestre l'ensemble des animations. Appelé depuis main.js.
 *
 * Règle fondamentale : si prefers-reduced-motion, on ne démarre rien
 * et le contenu reste 100% lisible immédiatement.
 */

import { initReveal } from './reveal.js';
import { initHeroText } from './text.js';
import { initHover } from './hover.js';
import { initPricing } from './pricing.js';
import { initHeroMockup } from './hero-mockup.js';
import { initHomeSections } from './home-sections.js';
import { initMethode } from './methode.js';

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    // Contenu visible immédiatement — aucun JS d'animation chargé
    document.documentElement.classList.add('motion-reduced');
    return;
  }

  // Signale que le JS est prêt et que les états initiaux CSS s'appliquent
  document.documentElement.classList.add('motion-ready');

  // Initialise les systèmes
  initHeroText();
  initReveal();
  initHover();
  initPricing();
  // Mockup navigateur animé — hero colonne droite
  initHeroMockup();
  // Sections home : Pourquoi, Services, Contact (Méthode gérée séparément)
  initHomeSections();
  // Section Méthode scroll-driven (pin + scrub) — après Lenis init
  initMethode();
}
