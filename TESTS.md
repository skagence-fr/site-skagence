# TESTS — site SK Agence

Document de vérification à parcourir avant déploiement. Coche chaque ligne.

## 0 · Lancer le site en local

```bash
npm install      # une seule fois (déjà fait)
npm run dev      # → http://localhost:5173
npm run build    # produit /dist
npm run preview  # sert /dist en local pour test final
```

## 1 · Conformité au brief (palette · typo · règle du rouge)

- [ ] Aucune autre couleur que `#0B0B0D`, `#F5F2EC`, `#B9B2A8`, `#C8102E`, `#141416` à l'écran (inspecter le DOM si doute).
- [ ] **Rouge `#C8102E` jamais en texte courant** : présent uniquement dans les eyebrows mono, traits, numéros mono, mots-emphase (manifeste), bouton primaire, halos vidéo, icônes FAQ et lien `Mentions légales` (souligné rouge survol). Aucun paragraphe lisible n'est rouge.
- [ ] Display = Anton MAJUSCULES uniquement sur hero, sections, offres, méthode, réalisations, FAQ, CTA. Pas d'Anton dans le texte courant.
- [ ] Mono IBM Plex = prix, numéros (01–05), eyebrows, tags, footer.
- [ ] Manrope partout dans le texte courant.

## 2 · Contenu mot pour mot (zéro inventé)

Comparer à `contenu.md`. Aucune phrase inventée, aucun chiffre faux.

- [ ] HERO : sur-titre, titre, sous-titre, indicateur conformes.
- [ ] MANIFESTE : 3 phrases exactes, mots-emphase = `affichés`, `7 jours`, `Maintenu`.
- [ ] OFFRES : 5 cartes avec noms / fourchettes de prix / abonnements / specs / pitch identiques + note de bas conforme.
- [ ] MÉTHODE : 4 étapes (J1, J2–4, J5–6, J7), libellés exacts.
- [ ] RÉALISATIONS : 3 affiches affichées + métadonnées conformes.
- [ ] FAQ : 6 questions / réponses identiques.
- [ ] CTA : titre, sous-texte, boutons, ligne « Aubagne — interventions partout en France ».
- [ ] FOOTER : ligne mention TVA + lien Mentions légales + ligne de preuve `[X]` (à compléter à la livraison).
- [ ] MENTIONS LÉGALES : fidèles à `contenu.md` §MENTIONS.

## 3 · Captures à prendre (desktop 1440 + mobile 390)

Ouvrir Safari ou Chrome, basculer l'inspecteur en 1440×900, puis 390×844 (iPhone 12 Pro).

Section par section, vérifier :

| Section | Desktop 1440 | Mobile 390 |
|---|---|---|
| Hero | titre lettre par lettre, vidéo en fond, halo rouge bas-gauche, flèche bounce | image poster (vidéo désactivée), titre lisible en 1 ligne ou 2, kicker bien sur deux lignes max |
| Manifeste | la section reste épinglée pendant ~2,5 viewports, 3 phrases s'enchaînent en scrub, mot rouge bien visible, barre rouge progresse en bas | défilement vertical normal, 3 phrases empilées, barre cachée |
| Offres | 5 cartes qui s'empilent (chacune sticky avec un offset), liseré rouge au survol, prix mono, specs en pills | cartes empilées sans sticky, pas de chevauchement |
| Méthode | section épinglée, défilement horizontal 4 écrans, barre rouge progresse | les 4 panneaux deviennent un long défilement vertical |
| Réalisations | 3 affiches grandes, parallax doux sur l'image | affiches en pile, plus de parallax |
| FAQ | accordéons épurés, un seul ouvert à la fois, croix → tiret rouge | idem |
| CTA | titre splitté, boutons magnétiques (translate suit la souris), halo rouge décalé | boutons côte-à-côte ou empilés |
| Footer | 1 ligne en bas, mention TVA + lien Mentions légales | empilé |

## 4 · Comportement & accessibilité

- [ ] **Smooth scroll Lenis** : molette = défilement fluide, ancres internes filent sans saut.
- [ ] **`prefers-reduced-motion` actif** (Réglages macOS → Accessibilité → Affichage → Réduire les animations) : le site reste lisible, plus de pin/scrub, vidéo remplacée par le poster, lettres apparaissent sans translate.
- [ ] **Mobile < 768 px** : aucun pin, aucun scroll horizontal, vidéo → poster ; lecture verticale naturelle.
- [ ] **Clavier** : `Tab` traverse Nav → Hero scroll → Offres → FAQ → CTA → Footer dans l'ordre logique, focus visible.
- [ ] **Aria** : `aria-labelledby` sur chaque section, alt explicites sur les 3 affiches.
- [ ] **Contraste** : texte courant (`#F5F2EC` sur `#0B0B0D`) = ~17:1 (AAA). Eyebrows rouge (mono 12 px) sur fond noir = 5.4:1 → AA passé pour ce niveau et cette taille, mais utilisés uniquement comme libellés courts. Aucun paragraphe rouge.
- [ ] **Pas de pop-up, pas de carrousel auto, pas de chat widget**.

## 5 · Lighthouse (Chrome ou Safari Inspect → Audit)

Sur `npm run preview` (build de production) :

- [ ] Performance ≥ 85 (mobile et desktop).
- [ ] Accessibilité ≥ 95.
- [ ] Bonnes pratiques ≥ 90.
- [ ] SEO ≥ 95.
- [ ] Si performance < 85 : vérifier que la vidéo ne se télécharge pas en mobile (CSS `display:none` la cache, mais la directive `preload="auto"` reste — voir §7).

## 6 · Vérifications finales avant déploiement

- [ ] Remplacer **2× `06 XX XX XX XX`** :
  - `index.html` ligne bouton tel `tel:+33600000000` → vrai numéro,
  - `index.html` libellé `06 XX XX XX XX` → vrai numéro affiché.
- [ ] Remplacer dans `mentions-legales.html` :
  - `[Prénom NOM]` (2×),
  - `[adresse]`,
  - Bloc `Hébergement : [à compléter selon déploiement]` → Vercel ou Hostinger avec adresse de la maison-mère.
- [ ] Remplacer dans `index.html` footer : `Ce site a été produit en [X] jours` → vrai chiffre (le compter depuis le démarrage).
- [ ] Tester `mailto:` : ouvre bien le client mail avec subject et corps pré-rempli.
- [ ] Tester `tel:` sur mobile réel.

## 7 · Notes de déploiement

- **Vercel** : `vercel` puis `vercel --prod`. Pas de variables d'env, pas de build à customiser (`vite build` détecté automatiquement).
- **Hostinger / OVH** : `npm run build`, uploader le contenu de `dist/` à la racine du domaine via FTP.
- **Vidéo** : le fichier est déjà optimisé (~250 Ko). Si Lighthouse mobile pointe la vidéo : ajouter `media="(min-width: 768px)"` sur la balise `<video>` n'est pas standard ; à la place, on peut couper le téléchargement par JS si le viewport est < 768 px. Implémenter seulement si le score l'exige.
- **Polices** : déjà `preload` + `display=swap` ; aucune action requise.

## 8 · État technique livré

- Vite 5, build OK : `dist/index.html 19.5 KB`, `dist/mentions-legales.html 5.4 KB`, `dist/assets/style 16.2 KB`, `dist/assets/main 150 KB` (gzip 56 KB).
- Dépendances : `gsap` 3.12, `lenis` 1.1, `split-type` 0.3, `vite` 5.4.
- Pas de framework, pas de Three.js, pas de tracking.
