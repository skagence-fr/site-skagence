# BRIEF STRATÉGIQUE — site SK Agence

*(Lu par Claude Code et tous les agents avant toute ligne de code. Source de vérité avec
`cahier-des-charges-site.md` et `contenu.md`.)*

> **Hiérarchie des documents** (en cas de contradiction, le plus haut gagne) :
> 1. `cahier-des-charges-site.md` — la spec produit (structure, P0, DoD).
> 2. `/Users/elmagico/Documents/SK-Agence/modele-operationnel.md` — **source unique** des prix, délais,
>    clauses, capacité. **Ne jamais réinventer un prix ou un délai ailleurs.**
> 3. Ce `brief.md` — le « pourquoi » derrière la spec (marché, parti pris, analyses de conversion).
> 4. `contenu.md` — les textes définitifs à intégrer.
>
> *Note chemin :* le cahier des charges référence `ressources/modele-operationnel.md`, mais le
> fichier vit à la racine `/SK-Agence/modele-operationnel.md`. À harmoniser plus tard ; en attendant,
> c'est le chemin racine qui fait foi.

---

## 1 · Le marché et la case vide que SK occupe

Trois familles se partagent le marché du site pour TPE/commerces en France :

| Acteur | Promesse | Faille exploitée par SK |
|---|---|---|
| **Agences classiques** | « Sur mesure » | 3 semaines à 3 mois, devis opaques, 3 000-8 000 €, interlocuteurs multiples |
| **Plateformes self-service** (Wix, Shopify…) | « Faites-le vous-même » | Le commerçant n'a ni le temps ni l'œil ; résultat générique ; zéro conformité FR ; zéro humain |
| **Freelances low-cost** | « Pas cher » | Livraison aléatoire, disparition après livraison, aucun suivi |

**La case vide : la productisation.** Prix affichés publiquement (personne ne le fait), délai
contractuel de 7 jours, abonnement de maintenance systématique, conformité française incluse,
UN interlocuteur. Le site doit incarner ces 5 preuves — chaque section en démontre une.

**Le niveau d'exécution du site EST l'argument de vente** : un commerçant qui ressent le « waouh »
se dit « je veux ça pour moi ». D'où la signature du configurateur cinématique (§4 du cahier des
charges) qui projette le visiteur dans SON futur site.

## 2 · Direction artistique (verrouillée — voir §2 du cahier des charges)

DA actée pour le site de l'agence : **crème + bleu nuit + or**, esthétique « Sotheby's tech »,
premium / éditorial / raffiné. Codes hex, typos et règles d'usage : `cahier-des-charges-site.md §2`.

**Pourquoi ce parti pris (et pas le dark / rouge initialement envisagé)** :

- Le site de l'agence vend du **sérieux / confiance / haut de gamme** (le client achète notre
  travail). Le dark + rouge porte mieux l'énergie cinématique d'un projet client ; la palette
  claire porte mieux le positionnement « partenaire premium » sur le site agence.
- C'est une **exception assumée** pour le site SK Agence. L'ADN dark de `CLAUDE.md` reste le
  défaut pour les **projets clients**.

**Anti-générique** (rappel des interdits du cahier §2) : pas de dégradé violet-bleu, pas de
glassmorphism, pas de cards grises identiques, pas d'emoji décoratif, pas de Lorem ipsum ni
d'image de stock non remplacée. Tout en variables CSS pour re-thémage immédiat.

## 3 · Architecture (cahier §3 fait foi)

Le site se découpe en **2 pages**, navigation identique (cahier §3 / Navigation) :

- **PAGE 1 — Accueil** : l'essentiel qui convertit (hero → configurateur → ce que je fais →
  pourquoi SK → méthode en bref → CTA + formulaire → footer).
- **PAGE 2 — Offres & méthode** : le détail pour ceux qui creusent (méthode 7 jours détaillée +
  clause de démarrage, grille d'offres complète, délais par type, FAQ, mentions/RGPD).

**Règle de séparation** : l'accueil = décision rapide, page 2 = approfondissement. Aucune info
ne se chevauche. Aucune répétition inutile.

## 4 · Structure : ce qui est AJOUTÉ et RETIRÉ (analyse de conversion)

**AJOUTÉ vs versions précédentes**

- **Le configurateur cinématique** (cahier §4) — la signature. Ce n'est PAS un formulaire déguisé,
  c'est une expérience guidée qui assemble en live la maquette du futur site du visiteur. C'est ce
  qui transforme l'intérêt en lead qualifié pré-rempli.
- **FAQ** (sur page 2) : lève les objections réelles (propriété, abonnement, résiliation, distance,
  rapidité=qualité ?, budget serré → Zéro Apport).
- **Clause de démarrage visible** : « les délais partent à réception des contenus, pas à la
  signature ». Affichée sur le site, dans le configurateur et dans le contrat (cohérence
  imposée par `modele-operationnel.md`).
- **Preuve par la vitesse** : la date de mise en ligne du site lui-même en footer (« Ce site a
  été produit en X jours » — à compléter honnêtement à la livraison).

**RETIRÉ (et pourquoi)**

- Blog : rien à publier régulièrement = signal d'abandon. À réintroduire seulement avec des
  études de cas.
- Page équipe / photos : studio à un interlocuteur — la stat « 1 interlocuteur » le dit mieux
  qu'une page vide.
- Témoignages inventés : **INTERDIT**. La preuve = les 3 réalisations + les chiffres. Les avis
  réels remplaceront à mesure.
- Réseaux sociaux : aucun lien mort ou compte vide.
- Carrousels automatiques, pop-ups, chat widget : bruit.

## 5 · Prix, délais, capacité (source unique)

**Aucun chiffre n'est défini dans ce fichier.** Tout vient de
`/Users/elmagico/Documents/SK-Agence/modele-operationnel.md` :

- Grille tarifaire (Vitrine / E-commerce / App × Essentiel / Standard / Premium + maintenance).
- Délais par type (7 jours vitrine, 2-3 sem e-com, 2-4 sem app simple, sur devis app complexe).
- Clause de démarrage (à réception des contenus).
- Capacité (1 nouveau départ / semaine, 1-2 projets actifs en parallèle).

Le configurateur affiche « à partir de » le palier Essentiel ; chaque option ajoute du coût et
peut faire basculer vers Standard / Premium. **Toute valeur affichée sur le site ou dans le
configurateur doit être identique à celle du modèle opérationnel.** Une seule erreur = perte de
confiance + risque juridique.

## 6 · P0 et Definition of Done (cahier §5 et §6 font foi)

Avant toute mise en ligne :

- **P0 bloquants** (cahier §5) : formulaire réel, mentions complètes (hébergeur), politique de
  confidentialité + bandeau cookies conforme, zéro placeholder en prod.
- **Definition of Done** (cahier §6) : checklist à cocher intégralement — 2 pages présentes,
  navigation OK, configurateur fonctionnel + reduced-motion, formulaire testé, conformité OK,
  zéro placeholder, prix/délais alignés sur le modèle opérationnel, Safari iOS + mobile OK,
  Lighthouse 90+ sur les 4 axes.

**Aucune livraison sans §6 intégralement coché.**

## 7 · Lexique technique de référence

Vanilla HTML/CSS/JS + Vite (déjà en place). GSAP + ScrollTrigger (`scrub`, `pin`), Lenis (smooth
scroll), SplitType (reveal de texte), stacked cards, section horizontale épinglée, parallax,
bouton magnétique, curseur custom, préloader. Vidéo : `muted autoplay loop playsinline` + poster.

Animations du configurateur : **uniquement `transform` / `opacity`**, 60 fps, zéro layout shift,
fallback `prefers-reduced-motion` obligatoire (cahier §4 / Contraintes techniques).
