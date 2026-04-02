# Datagma Website

Site marketing de **datagma.com** — real-time B2B data enrichment.

## Stack
- [Astro](https://astro.build) (static output)
- [Tailwind CSS](https://tailwindcss.com)
- MDX pour les pages de contenu
- 7 langues : EN, FR, DE, NL, IT, ES, PT

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer le dev server
npm run dev
# → http://localhost:4321/en/home

# Build statique
npm run build
```

## Structure du projet

```
src/
  components/      Nav.astro, Footer.astro, ...
  layouts/         BaseLayout.astro
  pages/
    en/            Pages anglaises (source)
    fr/            Pages françaises
    de/            ...
    [lang]/        Router dynamique (pages legacy)
  styles/
    global.css     Design system
  scripts/
    site.js        JS global (mobile menu, lang switch, animations)
public/
  i18n/            Traductions JSON par langue
  images/          Assets visuels
{lang}/            Pages legacy HTML (fr/pricing.html, etc.)
```

## Routage
- `/` → redirect vers `/en/home`
- `/{lang}/{page}` → page statique (MDX ou legacy HTML)

## Architecture de référence
Ce projet suit la même architecture que **Enrich-CRM** (`/Users/sylvain/Documents/enrich-crm`).  
Pour les patterns de code, scripts de traduction et exemples de pages, se référer à ce projet.

## Contexte produit
Voir `AGENTS.md` pour la documentation complète du produit, des pages, du design system et du workflow.
