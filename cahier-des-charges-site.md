# Cahier des charges — Site SK Agence

Spécification de référence pour la refonte du site de l'agence. À lire intégralement avant tout
travail. Toute décision business (prix, délais, clause, capacité) vient de
`ressources/modele-operationnel.md` — **ne jamais inventer un prix ou un délai ici.**

> Règle d'or : prix, délais et promesses doivent être **identiques** entre le site, le configurateur
> et le contrat. Aucune contradiction tolérée.

---

## 1. Objectif & cible

- **But** : convertir un visiteur (TPE, indépendant, commerçant) en prospect qualifié via un devis/contact.
- **KPI principal** : nombre de devis qualifiés reçus (le configurateur est le moteur de cette conversion).
- **Cible** : majoritairement sur **mobile**. Le site est pensé mobile-first.
- **Principe éditorial** : moins, mais mieux. L'accueil ne contient QUE l'essentiel. Tout le détail
  va en page 2. Pas de mur de texte, pas d'info mal rangée.

## 2. Direction artistique (verrouillée)

- **Palette** : crème `#F5F0E6` (fond) · bleu nuit `#0E1F33` (texte) · or `#A47731` (accent unique).
- **Typographies** : Fraunces (display) · Saira / Inter (corps). Échelle fluide (`clamp()`), self-host woff2.
- **Ambiance** : premium, éditorial, raffiné — « Sotheby's tech ». Contraste fort, beaucoup d'air.
- **Interdits (anti-générique)** : pas de dégradé violet-bleu, pas de glassmorphism, pas de cards grises
  identiques, pas d'emoji décoratif, pas de Lorem ipsum ni d'image de stock non remplacée en prod.
- **Tout en variables CSS** (`--bg`, `--fg`, `--accent`…) pour cohérence et re-thémage.

## 3. Architecture des pages (tout à sa place)

### Navigation (onglets, verrouillés)

`Logo (→ accueil)` · `Offres & méthode` · `Configurer mon site` (CTA accent) · `Contact`

- Nav identique sur les deux pages. CTA « Configurer mon site » mis en avant (couleur accent).
- Mobile : menu hamburger propre (scroll-lock géré, fermeture au clic sur un lien).

### PAGE 1 — Accueil (scroll, l'essentiel qui convertit)

Sections, dans cet ordre exact :

1. **Hero** — promesse en une phrase + sous-titre court + bouton principal « Configurer mon site » +
   accroche « Site vitrine livré en 7 jours ». Visuellement fort, plein impact, zéro surcharge.
2. **Le configurateur** (LA signature — voir §4) — section dédiée, mise en avant. C'est le cœur du site.
3. **Ce que je fais** — 3 blocs courts : Vitrine · E-commerce · Application. Une phrase chacun.
4. **Pourquoi SK Agence** — 3 à 4 différenciateurs max : livré en 7 jours · design sur-mesure jamais
   générique · accompagnement humain · maintenance incluse. + garantie (ex. « Lighthouse 90+ »).
5. **La méthode en bref** — le process condensé en quelques étapes visuelles, avec un lien
   « Voir le détail » → page 2.
6. **CTA final + formulaire de contact court** — pré-rempli si le visiteur a utilisé le configurateur.
7. **Footer** — navigation, contact, réseaux, lien mentions légales & politique de confidentialité.

### PAGE 2 — Offres & méthode (le détail pour ceux qui creusent)

1. **La méthode détaillée** — le « 7 jours » décortiqué étape par étape + **la clause de démarrage**
   (les délais partent à réception des contenus, pas à la signature).
2. **Les offres en détail** — la grille complète (Essentiel / Standard / Premium par type), ce qui est
   inclus, la maintenance mensuelle, l'option financement Zéro Apport. (Chiffres : `modele-operationnel.md`.)
3. **Délais par type** — tableau clair : vitrine 7 j · e-commerce 2-3 sem · app simple 2-4 sem ·
   app complexe sur devis.
4. **FAQ** — les questions qui rassurent : délais, contenus à fournir, maintenance, propriété du site,
   paiement, et après la livraison.
5. **Mentions légales & RGPD** — page dédiée (ou ancre), liée depuis le footer.

> Vérifier qu'aucune info ne se chevauche entre les deux pages et que chaque élément est à sa place :
> l'accueil = décision rapide, la page 2 = approfondissement. Pas de répétition inutile.

## 4. La fonctionnalité signature — le configurateur cinématique

L'élément qui différencie SK Agence. Il doit être **incroyable, réfléchi et unique** — pas un simple
formulaire déguisé. 100 % front-end (HTML/CSS/JS + GSAP). **Pas d'IA, pas d'API, pas de coût.**

### Principe

Une expérience guidée, étape par étape, plein écran, cinématique. À chaque choix du visiteur, **une
maquette de son futur site s'assemble en direct** à l'écran, et le prix « à partir de » s'anime.
Le visiteur ne remplit pas un formulaire : il **compose et visualise son site**.

### Les étapes

1. **Type de projet** — Vitrine / E-commerce / Application. → définit le squelette de la maquette et le
   prix de base.
2. **Secteur d'activité** — choix rapide (restaurant, mode, artisan, santé, immobilier…) **+ champ libre**
   pour taper son activité. → personnalise les textes d'exemple de la maquette (« Chez [Nom]… »).
3. **Ambiance / direction visuelle** — plus que 3 choix. Proposer un éventail : Dark cinématique ·
   Premium / luxe · Minimal épuré · Vibrant · Naturel · Éditorial. **+ un sélecteur de couleur d'accent**
   pour que le visiteur choisisse SA couleur en live. → ré-habille toute la maquette instantanément.
4. **Pages souhaitées** — sélection (accueil, à propos, services, galerie, contact, blog…). → la nav et
   les sections de la maquette se mettent à jour.
5. **Fonctionnalités** — réservation, paiement, formulaire, galerie, multilingue, espace client, blog,
   chat… (toggles). → chaque option ajoute un bloc à la maquette et fait monter le prix.
6. **Le petit plus (champ libre)** — « Une idée, une fonctionnalité que tu as en tête ? » → texte libre
   capturé pour le brief. C'est ce qui laisse le visiteur exprimer ce qui lui passe par la tête.
7. **Récap cinématique** — la maquette assemblée + « Votre projet : [type], [pages], [options], ambiance
   [X], livré en [délai]. À partir de [prix]. » + CTA « Recevoir mon devis sous 24 h ».

### Ce qui le rend unique (à ne pas perdre)

- La maquette **s'assemble et se ré-habille en temps réel** — le visiteur voit SON site, pas une démo générique.
- Le **sélecteur d'accent + la personnalisation par secteur** → projection immédiate.
- Le **champ d'idée libre** → il peut rêver, et toi tu récupères une intention qualifiée.
- **Tous ses choix pré-remplissent le formulaire de devis** → lead ultra-qualifié, zéro friction.
- Transitions **cinématiques GSAP** = la signature SK.

### Contraintes techniques

- Animer uniquement `transform` / `opacity`. 60 fps. Pas de jank, pas de layout shift.
- Respecter `prefers-reduced-motion` (version sans animation).
- Prix « à partir de » et options issus de `ressources/modele-operationnel.md` (source unique).
- Fonctionne parfaitement sur mobile et Safari iOS.

> Avant de coder le configurateur en entier : le `directeur-artistique` propose le concept détaillé
> (déroulé + parti pris visuel) et **le fait valider par Kylian**. On ne code pas dans le vide.

## 5. P0 — bloquants de livraison (non négociables)

Le site ne part pas en ligne tant que ces points ne sont pas réglés :

- **Formulaire de contact réel** : il envoie vraiment (Formspree ou fonction serverless + email),
  avec validation et message de confirmation. Aujourd'hui il est factice → leads perdus en silence.
- **Mentions légales conformes** : éditeur, contact, **hébergeur** (à compléter), SIREN 105 940 159.
- **Politique de confidentialité + bandeau cookies** conforme (pas de tracking avant consentement).
- **Zéro placeholder en prod** : retirer/activer le FAB WhatsApp, le lead magnet « en cours », etc.

## 6. Critères de validation (definition of done — anti-erreur)

Le travail n'est « fini » que si TOUT est coché :

- [ ] Les deux pages existent, avec toutes les sections du §3, dans le bon ordre, rien en double.
- [ ] Navigation identique et fonctionnelle sur les deux pages, mobile inclus (hamburger OK).
- [ ] Tous les liens, ancres et le bouton de chaque section mènent au bon endroit.
- [ ] Configurateur : toutes les étapes fonctionnent, la maquette se met à jour en live, le prix s'anime,
      les choix pré-remplissent le formulaire, fallback `reduced-motion` présent.
- [ ] Formulaire : envoi réel testé (réception d'un email de test), validation + confirmation.
- [ ] Mentions légales + politique de confidentialité + cookies en place et conformes.
- [ ] Aucun Lorem ipsum, aucune image de stock non remplacée, aucun placeholder visible.
- [ ] Prix et délais affichés = exactement ceux de `modele-operationnel.md`.
- [ ] Rendu testé sur mobile réel et Safari iOS (pas de bug `100dvh`, scroll-lock, débordement).
- [ ] Lighthouse 90+ sur les 4 axes, zéro erreur console.

## 7. Déroulé pour l'équipe

1. `chef-de-projet` : intègre ce cahier des charges dans `brief.md`, planifie, séquence les agents.
2. **D'abord les P0** (§5) — pour que le site soit livrable proprement.
3. `directeur-artistique` : propose le **concept du configurateur** (§4) → validation Kylian avant build.
4. `dev` : build des 2 pages (§3) + configurateur. `dev-backend` : envoi réel du formulaire.
5. `contenu-seo` : textes définitifs (ton SK, zéro placeholder) + SEO + Open Graph.
6. `conformite` (via qa-livraison) : mentions, RGPD, cookies.
7. `qa-livraison` : passe toute la checklist §6, puis déploiement Vercel + domaine + analytics.

> Ne rien livrer tant que le §6 n'est pas intégralement coché. La qualité prime sur la vitesse —
> c'est la vitrine de l'agence, elle doit être irréprochable.
