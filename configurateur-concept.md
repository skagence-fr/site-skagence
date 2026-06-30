# Le configurateur cinématique — concept détaillé

*Document de validation. Aucun code, aucune classe finale. À valider par Kylian avant build.
Référence : `cahier-des-charges-site.md §4`, `brief.md`, `modele-operationnel.md`, `tokens.css`.*

---

## 1. Parti pris global

**On entre dans un atelier d'architecte. Une planche de travail crème éclairée par-dessus, où un
plan se dessine sous nos yeux à mesure qu'on répond.**

Pas un wizard à étapes, pas un quiz interactif, pas un "builder". Une **table de composition
éditoriale**, à mi-chemin entre la maquette d'un magazine et la planche d'un architecte. Le
visiteur ne "clique sur des options" — il **pose des éléments sur sa planche**, et l'objet
prend forme.

**Vocabulaire visuel**
- Matière : papier crème (`--c-bg`), encre bleu nuit, filets dorés. Texture **mat**, jamais
  glossy. Aucun effet de verre, aucun blur, aucun shadow flou diffus. Les ombres sont **fines,
  portées, à 45°** comme un papier posé sur une planche.
- Lumière : un seul point lumineux haut-gauche, qui crée des ombres directionnelles cohérentes
  sur tous les éléments. Sensation "studio photo silencieux", pas "scène 3D Webflow".
- Animation signature : **le glissement papier**. Tout entre par translation horizontale courte
  (40-80 px) avec une ombre qui s'allonge à l'arrivée. Pas de bounce, pas d'élastique, pas de
  fade vertical générique. Easing `--ease-out` (cubic-bezier 0.22, 1, 0.36, 1).

**Principe d'assemblage de la maquette**
La maquette n'est pas pré-existante puis "remplie" : elle naît **module par module, du haut vers
le bas**, comme un storyboard qu'on construit case après case. Chaque nouveau choix dépose une
**lame de papier** (un module) sur la planche, qui glisse depuis le bord droit, atterrit, et
projette son ombre. L'ensemble se reconfigure verticalement (les modules se réorganisent en
douceur si on insère/retire un bloc).

**Angle cinématique — transitions entre étapes**
**Un seul parti pris** : la **bascule de planche**. À chaque étape, la planche actuelle (questions
+ maquette miniature) glisse vers la gauche de 60 px en s'opacifiant à 0, pendant que la suivante
arrive depuis la droite. La maquette assemblée, elle, **ne quitte jamais l'écran** — elle reste à
sa place et continue de s'enrichir. Sensation : on tourne les pages d'un cahier d'architecte
posé sur la table, mais la maquette reste sous nos yeux en permanence. **Durée 600 ms, easing
out doux.** Jamais de fondu enchaîné lent et flou (anti-générique).

---

## 2. Déroulé pas-à-pas des 7 étapes

**Layout récurrent (desktop)** : split 40/60. Colonne gauche = la question (titre + guidance +
contrôles). Colonne droite = la **planche** où la maquette s'assemble. Une barre de progression
horizontale très discrète en haut (7 segments dorés, le segment actif épais). Le **prix "à partir
de"** est en bas de la colonne gauche, ancré, dans la typo Saira Condensed (chiffres) avec un
**filet doré qui s'allonge** quand le prix grimpe (pas un odometer agressif).

### Étape 1 — Type de projet

**Ce qu'il voit.** Trois grandes vignettes verticales empilées dans la colonne gauche : Vitrine,
E-commerce, Application. Pas de cards arrondies grises — des **plaques de papier crème** avec un
filet doré à gauche, un titre Fraunces, une ligne courte ("Pour présenter, vendre la confiance"
/ "Pour vendre en ligne, sans usine à gaz" / "Pour faire vivre un outil sur-mesure"). Colonne
droite : la planche est **vide**, seul un cadre fin doré marque l'emplacement de la future
maquette, avec la mention "Votre site, en train de se composer".

**Interaction.** Clic sur une plaque. Au hover : le filet doré passe en haut + à gauche (équerre),
la plaque se soulève de 2 px avec ombre portée plus longue.

**Visuel quand il choisit.** La plaque sélectionnée glisse vers la droite, **se transforme en
squelette de site** sur la planche : un header fin, un hero plein avec un grand titre placeholder
en Fraunces, deux sections vides en dessous, un footer. Le prix passe de "—" à "à partir de 1 490 €"
(Vitrine Essentiel) avec le filet doré qui s'étire de 0 à sa longueur cible en 800 ms.

**Micro-copy.** Titre : *« On commence par le format. »* Guidance : *« Trois objets,
trois méthodes. Choisis celui qui correspond à ce que tu veux faire. »*

### Étape 2 — Secteur d'activité + champ libre

**Ce qu'il voit.** Colonne gauche : une grille de 6 secteurs en plaques compactes (Restaurant,
Mode & beauté, Artisan, Santé & bien-être, Immobilier, Services pro) + une 7ᵉ plaque **"Autre"**.
Sous la grille, un **champ texte fin** : "Le nom de ton activité (ex. Maison Lévi, atelier de
joaillerie)." Colonne droite : la maquette squelette de l'étape 1 est toujours là.

**Interaction.** Clic sur un secteur (sélection unique). Le champ "nom" est saisi en parallèle
(facultatif mais incité).

**Visuel.** Au choix du secteur, le hero de la maquette **gagne un visuel d'accroche** : un
**bloc visuel stylisé** propre au secteur — pas une vraie photo, mais un **aplat coloré crème +
or avec une forme géométrique reconnaissable** (Restaurant = arcs concentriques évoquant une
assiette ; Mode = silhouette rectangulaire élancée ; Artisan = grille d'outils ; Santé = croix
adoucie ; Immobilier = volumes architecturaux ; Services = composition typographique). À la
saisie du nom, les **textes placeholder se réécrivent en live** : "Chez Maison Lévi, le geste est
une signature." (un slogan court généré par template par secteur, avec le nom inséré). Animation :
les anciens textes s'effacent par **clip-path horizontal** (un volet qui se ferme de gauche à
droite), les nouveaux s'écrivent par le même volet inversé. **Pas de typewriter lent**, c'est un
volet de 350 ms.

**Micro-copy.** Titre : *« Ton terrain. »* Guidance : *« On personnalise la maquette à ton métier.
Tape ton nom si tu veux le voir s'écrire à l'écran. »*

### Étape 3 — Ambiance + sélecteur d'accent

**Ce qu'il voit.** Colonne gauche : 6 vignettes d'ambiance, plus petites, en **swatchs 2D** (un
rectangle qui montre le fond, le texte et l'accent de chaque ambiance) — Dark cinématique, Premium
/ luxe, Minimal épuré, Vibrant, Naturel, Éditorial. Sous les ambiances, le **sélecteur d'accent**
(détaillé en §4).

**Interaction.** Sélection d'une ambiance (unique). Sélection d'un accent (parmi 8 propositions ou
saisie HEX).

**Visuel.** Au choix de l'ambiance, **toute la maquette se ré-habille en 500 ms** : fond, couleur
de texte et typographies basculent simultanément par **cross-fade des variables CSS** (transition
sur `background-color`, `color`, et substitution de la `font-family` du titre). Aucun reflow, juste
une bascule chromatique. L'accent doré (ou choisi) **clignote subtilement** une fois sur chaque
zone où il est appliqué (lien, filet, CTA) — un pulse 200 ms à 600 ms d'écart entre éléments
(stagger), pour signaler visuellement où l'accent agit.

**Micro-copy.** Titre : *« L'atmosphère. »* Guidance : *« On change l'air qu'on respire. Choisis
l'ambiance, choisis ta couleur. Tu vois l'effet en direct. »*

### Étape 4 — Pages souhaitées

**Ce qu'il voit.** Colonne gauche : une liste verticale de toggles propres (cases carrées avec
filet, pas de checkbox système) — Accueil (pré-cochée, désactivée), À propos, Services / Offres,
Galerie, Tarifs, Blog, Contact (pré-cochée). Chaque ligne : nom + une mini-description
(1 ligne).

**Interaction.** Toggle on/off. Multi-sélection.

**Visuel.** À l'activation d'une page, **un onglet apparaît dans la nav** de la maquette (glissement
horizontal depuis la droite, 300 ms) ET **une mini-section dédiée s'insère** dans le corps du site
(les sections existantes se décalent vers le bas avec une transition `transform` douce de 400 ms,
**jamais** de layout shift saccadé). Au toggle off : le mouvement inverse. Le prix bouge par
paliers de 200-300 € (selon la page) — le filet doré sous le prix s'allonge ou se rétracte.

**Micro-copy.** Titre : *« Les pièces de ta maison. »* Guidance : *« Chaque page = une porte qui
s'ajoute à ton site. Coche celles qui te servent vraiment. »*

### Étape 5 — Fonctionnalités

**Ce qu'il voit.** Colonne gauche : grille 2×N de **cartes-fonctionnalités** très compactes
(Réservation, Paiement, Formulaire, Galerie, Multilingue, Espace client, Blog, Chat). Chaque
carte : un pictogramme **trait fin doré** (jamais d'emoji), un titre, une ligne. **Risque
identifié** (cf. §8) : surcharge cognitive — on regroupe en **2 sous-blocs visuels** : "Vendre
& recevoir" / "Étendre & gérer", chacun avec son intertitre.

**Interaction.** Toggles. Chaque toggle déclenche une animation distincte sur la maquette.

**Visuel.** Chaque fonctionnalité ajoute un **bloc visuel signifiant** dans la maquette :
Réservation = un widget calendrier stylisé qui se déplie ; Paiement = un bouton "Acheter" qui
apparaît dans une section produit ; Galerie = une grille 3×2 de tuiles qui se composent en
cascade ; Formulaire = un encart contact qui glisse dans le footer ; etc. Le prix grimpe avec une
**règle visible** : un petit "+150 €" en or qui flotte 600 ms à droite du prix puis s'évanouit
(pas de notification toast moderne, juste un nombre qui apparaît et disparaît). Si on dépasse le
seuil Standard ou Premium, **le palier affiché change** ("à partir de 1 490 € → à partir de
2 490 €") avec une animation du chiffre par **digit roll vertical** (chaque chiffre roule sur 200 ms).

**Micro-copy.** Titre : *« Ce que ton site sait faire. »* Guidance : *« Active uniquement ce dont
tu as besoin. On reste sobre — chaque option est une vraie fonctionnalité, pas un gadget. »*

### Étape 6 — Le petit plus (champ libre)

**Ce qu'il voit.** Colonne gauche : un **grand champ texte** unique, posé sur la planche, avec
guide en filigrane. Une simple icône de stylo doré dans l'angle. La maquette à droite est dans
son état final.

**Interaction.** Saisie libre, optionnelle.

**Visuel.** Quand le visiteur écrit, **une feuille de bloc-notes** apparaît dans la planche à
droite, posée par-dessus la maquette en transparence atténuée (la maquette reste visible à 90 %),
avec le texte qu'il saisit qui s'écrit dessus. Sensation : "ce que tu écris, je l'ai noté." Au
clic sur "Continuer", la note **se replie en triangle** (corner-fold) et se range dans le coin
haut-droit de la maquette comme un post-it discret.

**Micro-copy.** Titre : *« Ton idée à toi. »* Guidance : *« Une fonction inhabituelle, une
contrainte, une référence qui t'inspire ? Écris-le. Je le lis avant de te recontacter. »*

### Étape 7 — Récap cinématique

**Ce qu'il voit.** La maquette **bascule en pleine largeur** (la colonne questions disparaît par
glissement gauche) et **se centre**. Au-dessus : un titre Fraunces *« Voilà ton projet. »*
En dessous de la maquette, un **résumé textuel formaté comme un cartouche d'exposition** (filets
dorés en haut/bas) : *« Site [type], ambiance [X], accent [hex] · [N] pages · [liste options] ·
Livré en [délai]. »* Puis le prix en très gros (Saira Condensed `--t-s-md`) : *« À partir de
[prix] € HT »*. Et le CTA principal : *« Recevoir mon devis sous 24 h »* (bouton or, plein, large).

**Interaction.** Le visiteur peut **cliquer sur n'importe quelle ligne du récap pour revenir
modifier** cette étape (lien fin doré "Modifier" à droite de chaque ligne). Le CTA ouvre le
formulaire **pré-rempli**.

**Visuel à l'assemblage final.** Quand on arrive à l'étape 7, la maquette **respire** : zoom-out
léger de 1.0 → 0.92 en 500 ms, puis re-zoom à 1.0 — comme un pas en arrière pour admirer
l'œuvre. Le cartouche en dessous se compose **ligne par ligne**, chaque ligne entre par stagger
de 80 ms (glissement horizontal court).

**Micro-copy.** Titre : *« Voilà ton projet. »* Sous-titre : *« Si ça ressemble à ce que tu
imaginais, demande ton devis. Je reviens vers toi sous 24 h ouvrées. »*

---

## 3. La maquette qui s'assemble — détail

**Niveau de fidélité : un entre-deux stylisé.**
Typo finale (Fraunces + Inter), palette finale (celle de l'ambiance + accent choisi), formes
simplifiées géométriques. **Pas de fausses photos**, pas de Lorem Ipsum, pas de vrais logos
clients. À la place : **des blocs visuels stylisés** (aplats colorés + formes géométriques
reconnaissables par secteur), et des **textes générés par template** (`Chez [Nom], [slogan
secteur].`). C'est volontairement entre la wireframe et le mockup — assez pour qu'il **se
projette**, pas assez pour qu'il pense "c'est le site final" et fasse du pixel-pushing.

**Modules constitutifs de la maquette**
1. **Header** — barre fine, "SK · [Nom du visiteur s'il l'a saisi]" à gauche, nav à droite (les
   onglets correspondent aux pages cochées étape 4).
2. **Hero** — un bloc plein largeur avec : slot image (le bloc visuel sectoriel), slot titre
   (Fraunces, généré par template), slot sous-titre, un CTA accent. C'est la pièce maîtresse.
3. **Section "à propos" / "services"** — apparaît si pages cochées : 2 ou 3 colonnes texte +
   forme géométrique.
4. **Sections fonctionnelles** — apparaissent à chaque toggle de l'étape 5 (galerie, calendrier
   réservation, etc.), modules visuels reconnaissables.
5. **Section contact / formulaire** — toujours présente, simplifiée.
6. **Footer** — fin, type et SIREN placeholder.
7. **Post-it (étape 6)** — note dorée pliée dans le coin haut-droit si le visiteur a écrit
   quelque chose.

**Comment chaque choix la modifie**
- **Type (étape 1)** → définit le squelette de base (sections présentes par défaut).
- **Secteur + nom (étape 2)** → réécrit les textes du hero ("Chez [Nom]…") et plug le bloc
  visuel sectoriel.
- **Ambiance (étape 3)** → bascule fond, encre, accent secondaire, et la typo display peut
  changer (ex. Dark cinématique = Saira en titre au lieu de Fraunces).
- **Accent (étape 3)** → la variable CSS `--accent-user` est appliquée aux : filets, CTA, liens
  hover, équerres décoratives. Volontairement **limité** pour rester lisible (cf. §4).
- **Pages (étape 4)** → ajout/retrait d'onglets de nav + sections correspondantes.
- **Fonctionnalités (étape 5)** → ajout de blocs visuels dédiés (calendrier, grille produit,
  galerie, etc.).

**Comportement de réorganisation.** Quand un module s'insère, les modules en dessous **descendent
en `transform: translateY`** (jamais en modification de hauteur réelle — donc zéro layout shift et
60 fps garanti). L'effet visuel est celui d'un accordéon ultra-doux.

---

## 4. Le sélecteur d'accent — sans casser la DA SK

**Le problème.** Si on laisse un wheel-picker brut, on récupère du fluo, du marron sale, du rose
néon. La maquette devient laide. Et la promesse "designer professionnel" tombe.

**La solution : palette éditoriale curated + picker libre encadré.**

**Palette éditoriale (8 accents pré-choisis, défendables)**
Présentés sous forme de **8 disques** alignés horizontalement, chacun avec un nom court en
dessous (typo Saira `--t-xs` en lettres espacées `--ls-eyebrow`) :
1. **Or SK** — `#A47731` (l'accent par défaut, présélectionné).
2. **Bordeaux Velours** — `#7A1F2B` (vins, mode, restaurant haut de gamme).
3. **Vert Forêt** — `#2D4A3E` (artisan, santé, naturel).
4. **Bleu Encre** — `#1B3A6B` (services pro, immobilier, fintech).
5. **Cuivre** — `#B2542C` (artisan, atelier, mode).
6. **Lavande Profonde** — `#5A4778` (beauté, bien-être, éditorial).
7. **Noir Velours** — `#1A1A1A` (luxe, mode, contemporain).
8. **Rouge Laque** — `#A8261C` (restaurant, énergie, audace mesurée).

Tous sont **désaturés-élégants**, jamais purs. Tous testés avec contraste suffisant sur fond
crème **et** sur fond foncé.

**Picker libre encadré.**
En dessous des 8 disques, un lien fin : *« Choisir une autre couleur »* qui ouvre un mini-picker
custom (pas le picker système). Le picker accepte un HEX, **mais affiche en temps réel un
indicateur de lisibilité** : si le contraste tombe sous 4.5:1 contre le fond crème **et** sous
3:1 contre le bleu nuit, un message apparaît : *« Cet accent risque d'être peu lisible. On le
testera ensemble en design. »* Le choix reste possible, mais le visiteur est prévenu — et nous
avons une info qualifiée pour la discussion commerciale.

**Garantie de lisibilité.**
L'accent du visiteur n'est appliqué qu'à un **set restreint** d'éléments :
- Les **filets décoratifs** (équerres, lignes horizontales courtes).
- Le **CTA principal** (avec calcul de couleur de texte automatique noir/blanc selon contraste).
- Le **hover** des liens.
- Les **labels d'état actif** (étape courante, page cochée).

**Jamais** appliqué aux : titres principaux, blocs de texte, fond de section. Le texte reste en
encre bleu nuit, le fond reste crème (ou bascule selon ambiance). L'accent **ponctue**, il
n'envahit pas.

---

## 5. Récap (étape 7) — la conversion

**Layout final.**
- En haut : titre Fraunces grand, *« Voilà ton projet. »*
- Centre : la maquette en pleine largeur (max 960 px), légèrement détourée par une ombre portée
  fine (papier sur table).
- Sous la maquette : le **cartouche d'exposition** — filet doré 60 px en haut, puis 4 lignes :
  - *Type · Vitrine Standard*
  - *Pages · Accueil, À propos, Services, Galerie, Contact*
  - *Options · Réservation, Formulaire de contact, Galerie filtrable*
  - *Ambiance · Premium / Luxe — Accent Bordeaux Velours*
  - *Délai · 7 jours (à réception des contenus)*
- En dessous, gros bloc prix : *« À partir de 2 940 € HT »* (Saira Condensed, taille `--t-s-md`).
- À droite du prix : *« + Maintenance à partir de 99 €/mois »* en plus petit.
- CTA principal pleine largeur sur mobile / large bouton centré sur desktop : *« Recevoir mon
  devis sous 24 h »* (fond or `--c-gold`, texte crème, hover : fond `--c-gold-2`, micro-lift 2 px).
- Sous le CTA, lien discret : *« Modifier mes choix »* (renvoie étape 1 avec l'état conservé).

**Calcul du prix.**
Base = palier Essentiel du type choisi (1 490 / 2 900 / 4 900 €). Chaque page ajoutée au-delà du
défaut (Accueil + Contact + 1 page comprise) = +200-300 €. Chaque fonctionnalité = +150-800 €
selon la complexité. **Si la somme dépasse le palier suivant, on bascule automatiquement de
palier** (passer à Standard puis Premium) — le visiteur ne voit pas le calcul, juste le résultat.
Toutes ces valeurs viennent de `modele-operationnel.md` et **doivent y rester centralisées**
(constante JSON unique, source de vérité).

**Pré-remplissage du devis.**
Le clic CTA n'envoie **pas** directement le devis. Il **ouvre un formulaire en surcouche** (modal
plein écran sur mobile, drawer latéral sur desktop), avec :
- Un résumé visuel compact du projet en haut (le cartouche miniature).
- 3 champs seulement : Nom · Email · Téléphone (optionnel).
- Un champ "Date souhaitée de mise en ligne" (datepicker).
- **Une case à cocher de consentement RGPD obligatoire** (validation décidée par Kylian) :
  *« J'accepte que SK Agence utilise mes données pour répondre à ma demande de devis.
  [Politique de confidentialité](politique-confidentialite.html). »*
  Cochage requis avant que le bouton d'envoi ne s'active. Lien externe vers la politique de
  confidentialité dans un nouvel onglet, sans fermer la surcouche.
- Le bouton final : *« Envoyer ma demande »*.

Tous les choix du configurateur sont **stockés en JSON** et envoyés avec le formulaire vers
`/api/lead` (déjà branché — Vercel serverless function + Resend, P0 livré).

**Feedback visuel à l'envoi.**
Au clic envoi : le bouton se transforme en **fine ligne dorée horizontale** (collapse vertical),
qui s'étend de 0 à 100 % de la largeur en 800 ms (faux progress bar — c'est la transition, pas
une vraie barre de chargement). Une fois étendue, la ligne **se replie en un point doré central
qui pulse une fois**, puis le contenu de la surcouche bascule sur l'**écran de confirmation** :
*« Reçu. Je reviens vers toi sous 24 h ouvrées avec ton devis détaillé. »* + une ligne en
dessous *« Tu peux fermer cet onglet — ou jeter un œil à ma méthode. »* + un lien vers la page
2.

---

## 6. Fallback `prefers-reduced-motion`

**Principe.** Aucune punition. La version reduced-motion **n'a pas le glissement papier, n'a pas
les transitions de planche, n'a pas le digit-roll**. Elle a **tout le reste**.

**Ce qui change concrètement.**
- Les transitions entre étapes deviennent **instantanées** (changement d'écran sans glissement,
  l'ancien disparaît, le nouveau apparaît).
- Les ajouts/retraits de modules sur la maquette deviennent **instantanés** (pas de translation,
  pas de stagger).
- Le digit-roll du prix devient une **substitution simple** (le nouveau nombre remplace l'ancien
  sans animation).
- Les effets de hover restent (lift de 2 px sur les plaques) mais en **transition 0 ms** au lieu
  de 200 ms — visuellement présent, juste pas animé.

**Ce qui reste.**
- Toute la **logique** (étapes, choix, prix, pré-remplissage).
- Toute la **maquette** (qui se compose, qui change de couleur, qui réagit aux choix).
- Tout le **layout** et la hiérarchie visuelle.
- Le **feedback de confirmation** à l'envoi (mais en remplacement direct, sans la ligne dorée
  qui s'étend).

**Promesse.** Un utilisateur reduced-motion voit la **même maquette finale**, prend la **même
décision**, reçoit la **même proposition**. Il perd la cinématique, pas la qualité.

---

## 7. Spécifications visuelles minimales pour le dev

### Tokens à ajouter à `tokens.css`

```
/* ---------- ACCENT DYNAMIQUE ---------- */
--accent-user:        #A47731;          /* défaut = or SK, surchargé par JS au choix */
--accent-user-on:     #F5F0E6;          /* texte sur fond accent — calculé au runtime */
--accent-user-soft:   color-mix(in srgb, var(--accent-user) 15%, transparent);

/* ---------- ÉLÉVATION (papier sur planche) ---------- */
--shadow-paper-1:     0 1px 0 rgba(14, 31, 51, 0.06), 2px 4px 8px rgba(14, 31, 51, 0.08);
--shadow-paper-2:     0 1px 0 rgba(14, 31, 51, 0.08), 4px 8px 16px rgba(14, 31, 51, 0.12);
--shadow-paper-3:     0 2px 0 rgba(14, 31, 51, 0.10), 8px 16px 32px rgba(14, 31, 51, 0.16);

/* ---------- CONFIGURATEUR ---------- */
--cfg-step-duration:  600ms;
--cfg-module-duration: 400ms;
--cfg-price-duration: 800ms;
--cfg-stagger:        80ms;
--cfg-board-bg:       var(--c-bg-2);   /* la "planche" est un peu plus dense que le fond */
--cfg-board-border:   var(--c-hairline);
```

### Wireframes ASCII descriptifs

**Layout général (desktop, étapes 1-6)**
```
┌──────────────────────────────────────────────────────────────────────┐
│  [Header SK · nav]                                                   │
├──────────────────────────────────────────────────────────────────────┤
│  ── ── ── ── ── ── ──   (progress 7 segments, segment 3 actif)       │
├────────────────────────┬─────────────────────────────────────────────┤
│                        │                                             │
│   Étape N · titre      │   ┌───────────────────────────────────┐     │
│   Guidance courte      │   │  [Header maquette · nav dynamique]│     │
│                        │   │  ┌─────────────────────────────┐  │     │
│   [Contrôles]          │   │  │  Hero · titre généré         │  │     │
│   ┌────────┐           │   │  │  [bloc visuel sectoriel]     │  │     │
│   │ choix  │           │   │  └─────────────────────────────┘  │     │
│   └────────┘           │   │  [section à propos]               │     │
│   ┌────────┐           │   │  [section services]               │     │
│   │ choix  │           │   │  [footer maquette]                │     │
│   └────────┘           │   └───────────────────────────────────┘     │
│                        │                                             │
│   ─────────────────    │                                             │
│   À partir de          │                                             │
│   2 490 € HT           │                                             │
│   ──────               │   (la planche / table de composition)       │
│                        │                                             │
│   ← Retour    Suivant →│                                             │
└────────────────────────┴─────────────────────────────────────────────┘
       40 %                              60 %
```

**Étape 7 — récap (desktop)**
```
┌──────────────────────────────────────────────────────────────────────┐
│  [Header SK · nav]                                                   │
├──────────────────────────────────────────────────────────────────────┤
│  ─ ─ ─ ─ ─ ─ ━   (progress, dernier segment actif épais)             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│              Voilà ton projet.                                       │
│                                                                      │
│      ┌───────────────────────────────────────────────────┐           │
│      │  [maquette finale, pleine largeur, ombre portée]   │           │
│      └───────────────────────────────────────────────────┘           │
│                                                                      │
│      ────────────────────────────────────────────────────            │
│      Type     · Vitrine Standard         [Modifier]                  │
│      Pages    · Accueil, À propos, …     [Modifier]                  │
│      Options  · Réservation, Formulaire  [Modifier]                  │
│      Ambiance · Premium · Bordeaux       [Modifier]                  │
│      Délai    · 7 jours (à réception)                                │
│      ────────────────────────────────────────────────────            │
│                                                                      │
│              À PARTIR DE                                             │
│              2 940 € HT          + maintenance 99 €/mois             │
│                                                                      │
│      ┌─────────────────────────────────────────────┐                 │
│      │     RECEVOIR MON DEVIS SOUS 24 H            │                 │
│      └─────────────────────────────────────────────┘                 │
│              ← Modifier mes choix                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Comportement responsive (mobile-first)

**Mobile (< 768 px).**
La split 40/60 disparaît. On passe en **stack vertical** : la maquette est au-dessus (sticky en
haut, max 50 vh), les choix en dessous (scroll natif). La maquette reste **toujours visible**
quand on choisit — c'est non-négociable, c'est la magie du configurateur.

Détail :
- La maquette est dans un **container sticky** en haut de l'écran (`position: sticky; top: var(--nav-h)`),
  hauteur fixe `50dvh` (penser `dvh` pas `vh` pour Safari iOS — cf. CLAUDE.md).
- Sous la maquette : la zone questions/choix, scrollable.
- Le prix est ancré **en bas de l'écran** dans une mini-bottom-bar de 56 px (sticky bottom),
  avec le bouton "Suivant" à droite. Toujours visible pendant le scroll.
- Les transitions horizontales entre étapes sont conservées (mais le swipe latéral n'est pas
  activé — bouton uniquement, pour éviter les conflits avec le scroll).

**Tablette (768-1024 px).**
Même split que desktop mais avec ratios 45/55, et padding latéraux réduits.

**Pas de modal expandable** pour la maquette en mobile : elle est **toujours là**, en haut. Le
visiteur ne doit pas avoir à cliquer pour voir l'effet de son choix.

---

## 8. Risques + alternatives écartées

### Risques identifiés

**1. Surcharge cognitive à l'étape 5 (fonctionnalités).**
Si on liste 8-10 fonctions à plat, le visiteur décroche. **Mitigation** : on regroupe en 2 blocs
visuels ("Vendre & recevoir" / "Étendre & gérer"), 4 toggles max par bloc, descriptions ultra-
courtes (5 mots). Si on dépasse 8 fonctionnalités à l'avenir, on en sort certaines vers une
option "Sur-mesure — on en parle" qui n'incrémente pas le prix mais signale l'intérêt.

**2. Performance sur mobile bas/moyen de gamme.**
Trop d'animations simultanées sur la maquette en mobile = chute de framerate, surtout sur Safari
iOS d'iPhone SE. **Mitigation** : on **désactive les transitions de la maquette pendant la
transition de planche** (le module ne bouge pas pendant que la planche slide). On reste sur
`transform`/`opacity` strictement. On capping à 60 fps. On teste réellement sur un iPhone SE
2020 avant validation.

**3. Risque "trop de personnalisation = projection bloquante".**
Le visiteur passe 10 minutes à choisir sa couleur d'accent, change d'ambiance 5 fois, et finit
par fermer l'onglet sans envoyer le devis. **Mitigation** : les étapes sont **courtes** (15-30 s
chacune visées), le bouton "Suivant" est **proéminent à chaque écran**, et on **conserve l'état**
si la personne revient en arrière (zéro frustration). On mesurera le temps moyen par étape en
analytics pour ajuster.

### Alternatives écartées

**Alternative A — Le builder drag & drop.**
On a envisagé un vrai builder où le visiteur **drag-and-drop des sections** sur une page vierge.
**Écarté** parce que (1) ça transforme le visiteur en client mécontent ("c'est moi qui ai fait le
design, pourquoi je te paie ?"), (2) sur mobile c'est impraticable, (3) ça contredit notre
positionnement "designer pro, pas usine self-service". On garde **le contrôle créatif** côté SK,
le visiteur exprime des **intentions**, pas des décisions de design.

**Alternative B — La maquette photoréaliste.**
On a envisagé de générer une maquette quasi-finale avec des vraies photos d'illustration par
secteur (Unsplash) et des textes de copywriting plus poussés. **Écarté** parce que (1) ça oriente
trop le visiteur vers un livrable spécifique et ouvre la porte aux "ah mais je pensais que ce
serait exactement comme ça" en livraison, (2) charge mobile lourde (images), (3) trop proche de
l'effet "AI-generated mockup" qu'on rejette dans CLAUDE.md. L'entre-deux stylisé est plus
honnête : il **promet une direction**, pas un livrable.

---

## En une ligne

**Un configurateur qui ressemble à un atelier d'architecte sur papier crème, où chaque réponse
du visiteur fait apparaître un nouveau module sur sa planche — pas un wizard, pas un quiz, une
expérience éditoriale qui projette le client dans SON futur site, sans jamais ressembler à un
formulaire.**
