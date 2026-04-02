# AGENTS.md — Datagma Website

## Vue d'ensemble du projet

Ce dépôt contient le site marketing de **Datagma** (datagma.com), un outil B2B de data enrichment en temps réel.

Le site est construit avec la même stack technique qu'Enrich-CRM (`/Users/sylvain/Documents/enrich-crm`) :
- **Framework** : Astro (static output)
- **CSS** : Tailwind CSS + design system custom (`src/styles/global.css`, `src/styles/legacy-pages.css`)
- **Langues** : EN, FR, DE, NL, IT, ES, PT (7 langues)
- **Routage** : `/{lang}/{page}` (ex: `/en/home`, `/fr/pricing`)
- **Déploiement** : Vercel (static)

---

## Produit — Ce qu'est Datagma

**Datagma** est un outil de data enrichment B2B en temps réel. Il permet à des équipes Sales, Marketing et RevOps de :

### Fonctionnalités principales
| Fonctionnalité | Description |
|---|---|
| **Email Finder** | Trouve des emails pro vérifiés à partir d'un nom + entreprise ou URL LinkedIn |
| **Phone Finder** | Trouve des numéros directs (mobiles et fixes) |
| **Job Change Detection** | Alerte quand un contact change d'entreprise ou de poste (dans les 1-2 semaines) |
| **Bulk Enrichment** | Upload CSV → enrichissement en masse → téléchargement des résultats |
| **API** | API REST pour enrichir en masse ou à la volée |
| **Chrome Extension** | Extension pour prospecter directement depuis LinkedIn |
| **File Upload** | Upload CSV pour enrichir en bulk |

### Intégrations
- **Zapier / Make / n8n** (via HTTP / webhooks)
- **Clay** (provider natif)
- **API REST** (tous plans payants)
- **WhatsApp** (sur tous les plans payants)

### Plans et tarifs (2026)
| Plan | Prix mensuel | Emails/an | Téléphones/an |
|---|---|---|---|
| **Free** | $0 | 90 | 3 |
| **Regular** | $39/mois (annuel) / $49/mois | 36 000 | 1 200 |
| **Popular** | $79/mois (annuel) / $99/mois | 90 000 | 3 000 |
| **Expert** | $209/mois (annuel) / $261/mois | 270 000 | 9 000 |
| **Enterprise** | Sur devis (5+ users) | — | — |

- Crédits non utilisés reportés jusqu'à 12 mois
- Économie de ~20% avec la facturation annuelle
- Coût par contact : ~$0.016/email, ~$0.33-$0.49/téléphone

### Positionnement marché
- **Concurrent principal** : Hunter.io, Dropcontact, Kaspr, Lusha, Apollo, ZoomInfo, Cognism, Snov.io, PhantomBuster
- **Différenciation** : temps réel (pas de base de données statique), WhatsApp integration, Chrome Extension, prix abordables
- **GDPR** aligné et CCPA compliant
- **Taux de match** : ~70-80% pour contacts US et Europe occidentale

---

## Architecture des pages

### Structure de routage
```
/                           → Redirect vers /en/home
/{lang}/home                → Page d'accueil
/{lang}/pricing             → Tarifs
/{lang}/email-finder        → Email Finder
/{lang}/phone-finder        → Phone Finder
/{lang}/job-change-detection → Job Change Detection
/{lang}/chrome-extension    → Extension Chrome
/{lang}/api                 → Documentation API
/{lang}/zapier              → Intégration Zapier/Make/n8n
/{lang}/how-it-works        → Comment ça marche
/{lang}/data-coverage       → Couverture des données
/{lang}/blog                → Liste des articles
/{lang}/blog/{slug}         → Article de blog
/{lang}/vs-{competitor}     → Pages de comparatif Datagma vs X
/{lang}/{c1}-vs-{c2}        → Pages de comparatif X vs Y
/{lang}/compare             → Hub de comparaison
/{lang}/trust               → Trust Center / GDPR
/{lang}/privacy-policy      → Politique de confidentialité
/{lang}/terms               → CGU
/{lang}/contact             → Contact
```

### Comment les pages sont servies
Il y a deux approches dans ce projet :

**1. Pages Astro MDX** (préférée pour les nouvelles pages) :
- Fichier : `src/pages/{lang}/{page}.mdx`
- Layout : `src/layouts/BaseLayout.astro`
- HTML complet avec composants Astro

**2. Pages Legacy HTML** (pour traduire rapidement des pages existantes) :
- Fichier source EN : `en/{page}.html` (contient un `<main>...</main>`)
- Router Astro : `src/pages/[lang]/[page].astro` extrait le `<main>` et le sert
- Composant : `src/components/LocalizedLegacyMain.astro`
- Traductions JSON : `public/i18n/{lang}/{page}.json`

**Recommandation** : Utiliser l'approche MDX pour toutes les nouvelles pages. L'approche legacy HTML est là pour référence et compatibilité.

---

## Design System

### Couleurs de marque Datagma
- **Primaire** : `blue-600` (#2563eb) — remplace le violet d'Enrich-CRM
- **Secondaire** : `blue-50`, `blue-100` pour les backgrounds
- **Accent** : `green-500` pour les checkmarks/succès
- **Dark** : `gray-900` pour les textes principaux

> ⚠️ Enrich-CRM utilise violet/indigo. Datagma utilise **bleu** comme couleur principale.

### Classes CSS importantes
```css
/* Dans src/styles/global.css */
.btn-primary    /* Bouton principal bleu */
.btn-cta        /* Bouton CTA animé avec shine effect */
.bento-card     /* Carte avec glassmorphism */
.hero-cta       /* Hero CTA avec animation */
.fade-up        /* Animation d'apparition */
.font-display   /* Police Space Grotesk */
```

### Typographie
- **Display/titres** : Space Grotesk (font-display)
- **Corps** : Inter
- **Code** : IBM Plex Mono (si besoin)

---

## Internationalisation (i18n)

### Langues supportées
`en`, `fr`, `de`, `nl`, `it`, `es`, `pt`

### Fichiers de traduction
```
public/i18n/{lang}/common.json    → Traductions communes (nav, footer, CTA...)
public/i18n/{lang}/{page}.json   → Traductions spécifiques à une page
public/blog-i18n/{lang}.json     → Métadonnées blog (titres, descriptions)
```

### Règles de traduction par langue
- **FR** : vouvoiement ("vous"), typographie française (espace avant : ; ! ?)
- **DE** : Sie (forme de politesse), terminologie B2B professionnelle
- **NL** : u (forme de politesse)
- **IT** : Lei (forma di cortesia)
- **ES** : usted (forma de cortesía)
- **PT** : você (forma de tratamento), portugais européen (pas brésilien)

### Composant Nav et Footer
- Toutes les traductions de navigation sont dans `src/components/Nav.astro` et `src/components/Footer.astro`
- Pas de fichier JSON séparé pour la nav (inline dans le composant)

---

## Workflow de développement

### Démarrer le dev server
```bash
npm install
npm run dev
# → http://localhost:4321
```

### Créer une nouvelle page
1. Créer `src/pages/en/{page}.mdx` avec le contenu EN
2. Créer `src/pages/fr/{page}.mdx`, `src/pages/de/{page}.mdx`, etc. (ou utiliser l'approche legacy HTML)
3. Ajouter les liens dans `Nav.astro` et `Footer.astro`
4. Créer `public/i18n/{lang}/{page}.json` si nécessaire

### Créer une page EN puis la traduire avec GPT-4o
```bash
# Script de traduction disponible dans enrich-crm pour référence :
# /Users/sylvain/Documents/enrich-crm/scripts/_translate_pricing.py
# Adapte ce script en changeant le chemin source et les langues cibles
```

### Build et déploiement
```bash
npm run build   # Génère dist/
# Déploiement automatique via Vercel sur push main
```

---

## Référence : Projet Enrich-CRM

Le projet **Enrich-CRM** (`/Users/sylvain/Documents/enrich-crm`) est le projet de référence pour :
- Le design system complet et les composants
- Les scripts de traduction GPT-4o (`scripts/_gpt4o_translate.py`, `scripts/_translate_pricing.py`)
- L'architecture de routage multilingue (`src/pages/[lang]/[page].astro`)
- Le composant `LocalizedLegacyMain.astro` pour les pages legacy
- Les pages de comparatif (`src/pages/en/vs-[slug].astro`, `src/pages/en/[comparison].astro`)

**Pour copier un pattern** : regarde le fichier correspondant dans enrich-crm et adapte le contenu pour Datagma.

---

## Pages prioritaires à créer (TODO)

### Phase 1 — Pages core (MVP)
- [ ] `/en/home` — Page d'accueil (hero, fonctionnalités, pricing teaser, témoignages)
- [ ] `/en/pricing` — Tarifs détaillés (Free / Regular / Popular / Expert / Enterprise)
- [ ] `/en/email-finder` — Feature page Email Finder
- [ ] `/en/phone-finder` — Feature page Phone Finder
- [ ] `/en/job-change-detection` — Feature page Job Change Detection

### Phase 2 — Intégrations et API
- [ ] `/en/api` — Documentation API / Developer page
- [ ] `/en/chrome-extension` — Extension Chrome
- [ ] `/en/zapier` — Intégrations Zapier/Make/n8n

### Phase 3 — SEO et comparatifs
- [ ] `/en/vs-apollo` — Datagma vs Apollo
- [ ] `/en/vs-hunter` — Datagma vs Hunter.io
- [ ] `/en/vs-dropcontact` — Datagma vs Dropcontact
- [ ] `/en/vs-kaspr` — Datagma vs Kaspr
- [ ] `/en/vs-lusha` — Datagma vs Lusha
- [ ] `/en/vs-cognism` — Datagma vs Cognism
- [ ] `/en/vs-zoominfo` — Datagma vs ZoomInfo
- [ ] `/en/vs-snov` — Datagma vs Snov.io
- [ ] `/en/compare` — Hub de comparaison

### Phase 4 — Traductions (6 langues)
- [ ] Traduire toutes les pages EN vers FR, DE, NL, IT, ES, PT
- [ ] Utiliser les scripts de traduction de enrich-crm comme base

---

## Contenu et messaging

### Propositions de valeur clés
1. **Emails vérifiés en temps réel** — pas de base de données statique qui expire
2. **Téléphones directs** — mobiles et fixes avec taux de match élevé
3. **Job changes en 1-2 semaines** — le signal d'achat le plus puissant
4. **Chrome Extension** — prospecter directement depuis LinkedIn
5. **GDPR compliant** — données alignées RGPD et CCPA

### ICP (Ideal Customer Profile)
- SDR / BDR / AE qui prospectent en outbound
- Growth Hackers qui enrichissent des listes Clay/N8N
- RevOps qui maintiennent la qualité CRM (via API, Zapier ou File Upload)
- Développeurs qui intègrent un Email Finder ou Phone Finder dans leurs apps

### Ton et style
- Professionnel mais accessible
- Axé sur les résultats et les cas d'usage concrets
- Chiffres précis (taux de match, nombre de contacts, vitesse)
- Pas de sur-promesse — honnêteté sur les limites (ex: 70-80% match rate)

---

## Informations légales / RGPD
- Données alignées RGPD et CCPA compliant
- Hébergement : à documenter (confirmer avec l'équipe)
- DPA disponible sur demande

---

## Contacts et liens utiles
- App : https://app.datagma.com
- Login : https://app.datagma.com/login
- Register : https://app.datagma.com/register
- LinkedIn : https://www.linkedin.com/company/datagma
- G2 : https://www.g2.com/products/datagma/reviews (à vérifier)
