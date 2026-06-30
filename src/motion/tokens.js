/**
 * SK Agence — Motion tokens
 * UN seul langage de mouvement. Toutes les animations lisent ici, jamais de valeur magique ailleurs.
 */

export const DURATIONS = {
  // Apparitions
  enter:       0.6,   // 600ms — apparition générique (sections, cartes, lignes)
  heroIn:      0.7,   // 700ms — révélation hero mot à mot
  // Micro-interactions
  hover:       0.22,  // 220ms — survol bouton / carte
  focus:       0.18,  // 180ms — focus clavier
  // Pricing Vitrine (variantes documentées)
  counter:     0.55,  // 550ms — compteur de prix (décélère sur le chiffre final)
  checkmark:   0.25,  // 250ms — tracé de chaque coche SVG
  centerDelay: 0.16,  // 160ms — délai supplémentaire de la carte centrale après les latérales
  // Hero Mockup — boucle infinie (variantes documentées)
  mockupStep:  1.2,   // 1200ms — durée d'une étape de la boucle (squelette visible)
  mockupFade:  0.35,  // 350ms — cross-fade entre éléments lors des transitions
  mockupColor: 0.4,   // 400ms — inondation de couleur (étape 3)
  mockupOut:   0.4,   // 400ms — fondu de sortie avant reset (reprise boucle)
  mockupPulse: 0.3,   // 300ms — pulse de la pastille "livré" (étape 5)
  mockupHold:  0.6,   // 600ms — pause état complet avant reprise
  // Home Sections (variantes documentées)
  flipDigit:   0.4,   // 400ms — flip 3D rotateX d'un seul digit (section Pourquoi)
  traceIcon:   0.9,   // 900ms — tracé complet d'un pictogramme SVG métier (section Services)
  traceLine:   1.4,   // 1400ms — ligne or méthode de gauche à droite (section Méthode bref, legacy)
  litNum:      0.3,   // 300ms — allumage d'un numéro de méthode au passage de la ligne
  // Méthode scroll-driven (variantes documentées)
  methodeTrack: 1.4,  // 1400ms — trace du rail or sur mobile (fallback sans scrub) [legacy]
  methodeStep:  0.5,  // 500ms — transition d'état d'une étape (active/done) sur mobile [legacy]
  // Méthode timeline or (concept final — scroll-driven)
  methodeStateChange: 0.3,  // 300ms — transition d'état d'une étape (active/done/à venir)
  methodeSignature:   0.35, // 350ms — tracé SVG signature par étape (stroke-dashoffset)
  clipTitle:   0.6,   // 600ms — révélation titre contact via clip-path volet horizontal
};

export const EASES = {
  enter:  'cubic-bezier(0.16, 1, 0.3, 1)',   // power3.out — apparitions
  hover:  'cubic-bezier(0.33, 1, 0.68, 1)',  // power2.out — survols
  // Pricing Vitrine (variantes documentées)
  assert: 'cubic-bezier(0.22, 1, 0.36, 1)',  // power3.out légèrement plus contrôlé — compteur + entrée centrale
  // Home Sections (variantes documentées)
  flip:   'cubic-bezier(0.22, 1, 0.36, 1)',  // identique assert — flip de digit 3D (sensation mécanique franche)
  // Méthode scroll-driven (variantes documentées)
  methodeScrub: 'none',  // ease 'none' pour le scrub du track-line (linéaire = parfait pour scrub 1)
  // jamais linear, jamais bounce/elastic
};

export const STAGGER = {
  text:      0.06,  // 60ms entre mots du hero
  group:     0.08,  // 80ms entre items d'un groupe (cartes, listes)
  // Pricing Vitrine (variantes documentées)
  checkmark: 0.07,  // 70ms entre chaque ligne de bénéfice / coche SVG
  // Hero Mockup (variantes documentées)
  mockup:    0.08,  // 80ms entre éléments du mockup (nav items, lignes texte…)
  mockupLine: 0.1, // 100ms entre les traits de texte (étape 4 — extension scaleX)
  // Home Sections (variantes documentées)
  cards:     0.10,  // 100ms entre cartes Pourquoi (cascade diagonale)
  flipDigit: 0.08,  // 80ms entre digits consécutifs d'un même chiffre (flip 3D)
  traceIcon: 0.20,  // 200ms entre les 3 blocs services (tracé SVG séquentiel)
  formField: 0.10,  // 100ms entre champs du formulaire contact
};

export const DISTANCES = {
  enter: 20,    // 20px translateY pour les apparitions
  hero:  16,    // 16px translateY pour les mots du hero
  hover: 3,     // 3px translateY pour les boutons / cartes au hover
  // Home Sections (variantes documentées)
  hoverCard:     6,   // 6px — hover franc cartes Pourquoi standard
  hoverCardHero: 8,   // 8px — hover carte héros Pourquoi (plus marqué)
  hoverService:  4,   // 4px — hover bloc service
  formField:    16,   // 16px — translateY initial des champs contact
};
