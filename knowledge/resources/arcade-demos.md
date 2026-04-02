# Datagma — Démos Arcade existantes

Scraping réalisé le 2 avril 2026.
**8 démos Arcade trouvées** sur datagma.com

---

## Inventaire complet

| # | Titre | ID | URL | Pages actuelles |
|---|-------|-----|-----|-----------------|
| 1 | **Sales Nav Extract** | `7arrIIMR5cayyO8nMPXT` | https://demo.arcade.software/7arrIIMR5cayyO8nMPXT | Home, Chrome Extension |
| 2 | **Enrich LinkedIn Data with phone number** | `fWn8CZJOgDunBwBExbH3` | https://demo.arcade.software/fWn8CZJOgDunBwBExbH3 | Home, File Upload |
| 3 | **Job Change Detection** | `jfMgrjfg0lD320ZYS23V` | https://demo.arcade.software/jfMgrjfg0lD320ZYS23V | Home, File Upload |
| 4 | **Hubspot Enrichment** | `UJt2dfC8dy7h9InAEhni` | https://demo.arcade.software/UJt2dfC8dy7h9InAEhni | Home |
| 5 | **How to use the Datagma Chrome Extension** | `08V16zvf6FdgSj4i8jFO` | https://demo.arcade.software/08V16zvf6FdgSj4i8jFO | Home |
| 6 | **Find employee from company name & job title (home)** | `cpyP3FfxhgI9EUhm6Q9S` | https://demo.arcade.software/cpyP3FfxhgI9EUhm6Q9S | Home |
| 7 | **Enrich Twitter** | `tJqSmsT2B8HwnfEcGHeX` | https://demo.arcade.software/tJqSmsT2B8HwnfEcGHeX | Home, File Upload |
| 8 | **Find employee from company name & job title** | `q7aUwKB7Dko3BgT78DaA` | https://demo.arcade.software/q7aUwKB7Dko3BgT78DaA | File Upload |

---

## Détail et description de chaque démo

### 1. Sales Nav Extract — `7arrIIMR5cayyO8nMPXT`
- **Lien** : https://demo.arcade.software/7arrIIMR5cayyO8nMPXT
- **Premier step** : "Click here to transform this LinkedIn search page into a CSV file."
- **Feature montrée** : Chrome Extension sur Sales Navigator — extraction en masse
- **À utiliser sur** : page Chrome Extension, page Phone Finder, homepage

### 2. Enrich LinkedIn Data with phone number — `fWn8CZJOgDunBwBExbH3`
- **Lien** : https://demo.arcade.software/fWn8CZJOgDunBwBExbH3
- **Premier step** : "You scrapped some data from LinkedIn, and you need to enrich them with phone numbers"
- **Feature montrée** : File Upload — enrichissement d'une liste LinkedIn avec numéros mobiles
- **À utiliser sur** : page Phone Finder, page File Upload, homepage

### 3. Job Change Detection — `jfMgrjfg0lD320ZYS23V`
- **Lien** : https://demo.arcade.software/jfMgrjfg0lD320ZYS23V
- **Premier step** : "Here is an extract of our CRM. Some data are two years old and we want to refresh it"
- **Feature montrée** : Job Change Detection via File Upload — rafraîchissement CRM
- **À utiliser sur** : page Job Change Detection, page HubSpot, homepage

### 4. HubSpot Enrichment — `UJt2dfC8dy7h9InAEhni`
- **Lien** : https://demo.arcade.software/UJt2dfC8dy7h9InAEhni
- **Premier step** : "Connect your HubSpot in one click"
- **Feature montrée** : Intégration HubSpot — connexion et enrichissement automatique
- **À utiliser sur** : page HubSpot, homepage

### 5. How to use the Datagma Chrome Extension — `08V16zvf6FdgSj4i8jFO`
- **Lien** : https://demo.arcade.software/08V16zvf6FdgSj4i8jFO
- **Premier step** : "Click on the Extension in the menu to install it"
- **Feature montrée** : Installation et utilisation de la Chrome Extension
- **À utiliser sur** : page Chrome Extension, homepage

### 6. Find employee from company name & job title (home) — `cpyP3FfxhgI9EUhm6Q9S`
- **Lien** : https://demo.arcade.software/cpyP3FfxhgI9EUhm6Q9S
- **Premier step** : "We have a list of companies, and we are looking for specific employees in each of them."
- **Feature montrée** : Recherche par entreprise + job title (sans LinkedIn URL)
- **À utiliser sur** : homepage, page Email Finder, page Phone Finder

### 7. Enrich Twitter — `tJqSmsT2B8HwnfEcGHeX`
- **Lien** : https://demo.arcade.software/tJqSmsT2B8HwnfEcGHeX
- **Premier step** : "Add your list of Twitter URL"
- **Feature montrée** : File Upload — enrichissement depuis des URLs Twitter/X
- **À utiliser sur** : page File Upload (cas d'usage avancé)

### 8. Find employee from company name & job title — `q7aUwKB7Dko3BgT78DaA`
- **Lien** : https://demo.arcade.software/q7aUwKB7Dko3BgT78DaA
- **Premier step** : "We have a list of companies, and we will add employees for each of them."
- **Feature montrée** : File Upload — trouver des contacts dans une liste d'entreprises
- **À utiliser sur** : page File Upload, page Data Enrichment

---

## Mapping pour le nouveau site

| Page | Démos recommandées |
|------|--------------------|
| `/en/home` | #6 (company+job title), #1 (Sales Nav), #3 (Job Change) |
| `/en/phone-finder` | #2 (Enrich LinkedIn with phones), #1 (Sales Nav Extract) |
| `/en/email-finder` | #6 (Find employee by company+job title) |
| `/en/chrome-extension` | #5 (Chrome Extension install), #1 (Sales Nav Extract) |
| `/en/file-upload` | #2 (LinkedIn+phones), #8 (company+job title), #7 (Twitter) |
| `/en/job-change-detection` | #3 (Job Change Detection) |
| `/en/hubspot` | #4 (HubSpot Enrichment) |

## Démos manquantes (à créer)
Les features suivantes n'ont pas de démo Arcade :
- [ ] API — démontrer un appel API simple (nom → email + téléphone)
- [ ] Email Finder seul (recherche par nom+entreprise → email)
- [ ] Pipedrive Enrichment
- [ ] Clay integration
- [ ] Recherche par nom + pays (le différenciateur sans LinkedIn URL)
