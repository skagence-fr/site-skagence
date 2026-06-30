# MASTER PROMPT — Site immersif SK Agence
*(Colle l'intégralité de ce fichier comme premier message dans Claude Code, ouvert dans ce dossier.)*

Tu vas construire le site vitrine immersif de **SK Agence**. Ce dossier contient TOUT ce dont tu as besoin — tu n'inventes RIEN :
- `brief.md` → le positionnement, la palette exacte et ses règles, la typographie, la structure validée. LIS-LE EN PREMIER.
- `contenu.md` → 100 % des textes, à utiliser MOT POUR MOT. Zéro lorem ipsum, zéro chiffre inventé, zéro faux témoignage.
- `assets/logo-sk.svg`, `logo-sk-clair.svg`, `favicon.svg` → l'identité (le point rouge est la signature de marque).
- `assets/hero-bg.mp4` (+ `hero-poster.jpg`) → la vidéo de fond du hero (sombre, halos rouges, 12 s, 250 Ko).
- `assets/realisations/*.svg` → les 3 visuels de la section réalisations.

## Stack
Vite + HTML/CSS/JS vanilla. **GSAP + ScrollTrigger** (animations, `scrub`, `pin`), **Lenis** (smooth scroll), **SplitType** (reveals). Polices Google Fonts : Anton, Manrope, IBM Plex Mono (preload). Pas de framework, pas de Three.js en v1.

## Le film (scroll = timeline) — sections dans l'ordre de contenu.md
1. **HERO** : vidéo de fond (muted autoplay loop playsinline + poster), voile sombre, « SK AGENCE » en Anton plein écran révélé lettre à lettre, sous-titre, indicateur de scroll. Préloader ≤ 1,2 s avec le logo.
2. **MANIFESTE** : section épinglée (pin), les 3 phrases se succèdent au scroll (scrub), le mot fort en `#C8102E`.
3. **OFFRES** : 5 stacked cards (s'empilent au scroll) — numéro géant mono, nom Anton, prix, ligne, 3 specs, abonnement. Surface `#141416`, liseré rouge au survol.
4. **MÉTHODE** : section épinglée à défilement **horizontal**, 4 écrans (J1 → J7), barre de progression rouge.
5. **RÉALISATIONS** : les 3 affiches SVG en grand, parallax doux + reveal, métadonnées en mono.
6. **FAQ** : accordéons sobres (détails/summary stylés), un seul ouvert à la fois.
7. **CTA FINAL** : titre géant, boutons magnétiques (mailto pré-rempli + tel), mention rareté.
8. **FOOTER** + page `mentions-legales.html` (contenu fourni).

## Règles absolues
- Palette et règle du rouge : voir brief.md §2 — le rouge JAMAIS en texte courant.
- Mobile < 768 px : pins et horizontal dégradent en défilement vertical simple ; vidéo → image poster.
- `prefers-reduced-motion` : tout lisible sans animation.
- Performance : Lighthouse ≥ 85 (perf) et ≥ 95 (accessibilité). Vidéo déjà optimisée, ne pas la réencoder.
- Interdits : émojis-icônes (utilise des SVG traits 1.5px), dégradés multicolores, images stock, carrousels auto, pop-ups.

## Méthode de travail
1. Liste les fichiers du dossier, confirme la lecture de brief.md et contenu.md.
2. Propose le plan d'animation en 10 lignes max. ATTENDS MON GO.
3. Construis section par section ; à chaque section : capture desktop 1440 ET mobile 390, juge toi-même, corrige, puis continue.
4. Livre : `index.html`, `mentions-legales.html`, assets intégrés, et `TESTS.md` (captures, Lighthouse, vérifications).
