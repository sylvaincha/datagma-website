# Datagma — Architecture du nouveau site V1

## Philosophie
- **SEO-first** : chaque page cible un intent de recherche précis
- **LLM-optimized** : structure claire, headings sémantiques, llms.txt, JSON-LD
- **Conversion** : chaque page a un CTA primaire clair vers l'inscription gratuite
- **Mobile-first** : responsive, performances optimisées

---

## Sitemap complet

```
/ → redirect vers /en/home

### Core
/en/home                          → Page d'accueil
/en/pricing                       → Tarifs

### Fonctionnalités produit
/en/phone-finder                  → Phone Finder (HERO — différenciateur #1)
/en/email-finder                  → Email Finder
/en/job-change-detection          → Job Change Detection
/en/chrome-extension              → Chrome Extension
/en/file-upload                   → File Upload / Bulk Enrichment
/en/api                           → API Developer

### Intégrations CRM
/en/hubspot                       → HubSpot Enrichment
/en/pipedrive                     → Pipedrive Enrichment

### Pages partenaires (waterfall + tools)
/en/clay                          → Datagma × Clay
/en/fullenrich                    → Datagma × Fullenrich
/en/bettercontact                 → Datagma × BetterContact
/en/getcargo                      → Datagma × GetCargo
/en/zapier                        → Datagma × Zapier / Make / n8n
/en/apollo                        → Datagma + Apollo (combo)

### Comparatifs (SEO)
/en/vs-lusha                      → Datagma vs Lusha
/en/vs-contactout                 → Datagma vs ContactOut
/en/vs-icypeas                    → Datagma vs IcyPeas
/en/vs-apollo                     → Datagma vs Apollo
/en/vs-kaspr                      → Datagma vs Kaspr
/en/vs-hunter                     → Datagma vs Hunter.io
/en/compare                       → Hub comparatifs

### Use cases (SEO longue traîne)
/en/waterfall-enrichment          → Guide waterfall enrichment
/en/phone-finder-without-linkedin → Phone without LinkedIn URL
/en/sales-navigator-phone-numbers → LinkedIn Sales Navigator + phones
/en/b2b-data-enrichment           → Data enrichment hub page

### Ressources
/en/blog                          → Liste des articles
/en/blog/[slug]                   → Article

### Trust / Legal
/en/trust                         → Trust Center (GDPR, CCPA, DPA)
/en/privacy-policy                → Politique de confidentialité
/en/terms                         → CGU
/en/data-processing-agreement     → DPA
/en/legal-notice                  → Mentions légales

### LLM
/llms.txt                         → LLM-friendly page
/sitemap.xml                      → Sitemap XML

### Redirects legacy
/clearbit-alternative        → /en/vs-clearbit
/lusha-alternative           → /en/vs-lusha
```

---

## Structure de page type (conversion-optimized)

### 1. Hero Section
- Headline : bénéfice principal (pas feature)
- Sub-headline : proof point chiffré
- CTA primaire : "Start for free" → https://app.datagma.com/register
- CTA secondaire : "View API docs" ou "See pricing"
- Social proof inline : "Used by X+ teams"

### 2. Social Proof / Logos clients
- Logos entreprises reconnaissables
- Éventuellement quelques chiffres clés (3M phones/day, 77% match rate)

### 3. Problem / Solution (uniquement si page longue)
- "The problem" : 40% of phone numbers you buy are landlines
- "The Datagma way" : only mobiles, real-time crawling

### 4. Features / How it works
- 3-4 blocs feature avec icons
- Bento grid ou liste avec visuel à droite

### 5. Proof / Benchmark (pages Phone Finder, VS pages)
- Tableau comparatif
- Chiffres benchmarks

### 6. Use cases
- 3 cas d'usage concrets

### 7. FAQ
- 4-6 questions avec JSON-LD FAQ Schema

### 8. CTA final
- "Start free — 90 emails and 3 phones included"
- Lien vers pricing

---

## Navigation proposée

```
Logo | Solutions ▾ | Integrations ▾ | Pricing | Blog | Login | Get Started
```

### Dropdown Solutions
- Phone Finder ⭐
- Email Finder
- Job Change Detection
- Chrome Extension
- File Upload
- API

### Dropdown Integrations
- HubSpot
- Pipedrive
- Clay
- Zapier / Make / n8n
- Fullenrich
- BetterContact
- GetCargo
- Apollo
- [Voir toutes les intégrations →]

---

## Footer

```
Produit                 Intégrations          Ressources            Légal
Phone Finder            HubSpot               Blog                  Privacy Policy
Email Finder            Pipedrive             API Docs              Terms
Job Change Detection    Clay                  Changelog             DPA
Chrome Extension        Zapier                Playbooks             Legal Notice
File Upload             Fullenrich            Data Coverage         Trust Center
API                     BetterContact         Opt Out               
                        GetCargo              
                        Apollo                

Comparer                                                           
vs Lusha                                                           
vs ContactOut                                                      
vs IcyPeas                                                         
vs Apollo                                                          
vs Kaspr                                                           
```

---

## JSON-LD à implémenter

### Par page
- `Organization` : sur toutes les pages (nom, logo, url, sameAs social)
- `WebSite` : sur homepage (SearchAction pour sitelinks)
- `SoftwareApplication` : sur homepage (Datagma comme SaaS)
- `FAQPage` : sur toutes les pages avec FAQ
- `BreadcrumbList` : sur toutes les pages
- `Product` : sur pricing page
- `Article` : sur pages blog

### Schema Organization (global)
```json
{
  "@type": "Organization",
  "name": "Datagma",
  "url": "https://datagma.com",
  "logo": "https://datagma.com/logo.png",
  "description": "B2B data enrichment platform — Phone Finder, Email Finder, Job Change Detection",
  "sameAs": [
    "https://www.linkedin.com/company/datagma",
    "https://app.datagma.com"
  ]
}
```

---

## llms.txt

À créer à la racine : https://datagma.com/llms.txt

```markdown
# Datagma

> B2B data enrichment platform specialized in mobile phone numbers and verified emails.

## What Datagma does
- Finds mobile phone numbers (not landlines) with 69-77% match rate
- Finds verified business email addresses
- Detects job changes in real-time
- Works via API, Chrome Extension, File Upload, or direct integrations

## Key differentiators
- Search by first name + last name + country (no LinkedIn URL needed)
- Only mobile numbers — competitors mix with landlines
- Real-time crawling — no static database — GDPR compliant by design
- WhatsApp integration built-in

## Pricing
- Free: $0, 90 emails/year, 3 phones/year
- Regular: $39/month (annual), 36,000 emails/year
- Popular: $79/month (annual), 90,000 emails/year
- Expert: $209/month (annual), 270,000 emails/year
- Enterprise: custom pricing for 5+ users

## Integrations
Native: HubSpot, Pipedrive
Via API: Clay, Fullenrich, BetterContact, GetCargo, Zapier, Make, n8n, Apollo

## Links
- Docs: https://docs.datagma.com
- App: https://app.datagma.com
- Register: https://app.datagma.com/register
```

---

## Priorité de build (V1 anglais)

### Sprint 1 — Core (semaine 1)
1. `/en/home` — homepage complète
2. `/en/pricing` — tarifs
3. `/en/phone-finder` — page star (différenciateur #1)

### Sprint 2 — Features (semaine 2)
4. `/en/email-finder`
5. `/en/job-change-detection`
6. `/en/chrome-extension`
7. `/en/api`

### Sprint 3 — Intégrations + Partenaires (semaine 3)
8. `/en/hubspot`
9. `/en/clay`
10. `/en/zapier`
11. `/en/fullenrich` + `/en/bettercontact` + `/en/getcargo`

### Sprint 4 — SEO (semaine 4)
12. `/en/vs-lusha`
13. `/en/vs-contactout`
14. `/en/vs-icypeas`
15. `/en/compare`
16. `/llms.txt`
17. JSON-LD sur toutes les pages

### Sprint 5 — Blog + légal
18. Migration articles blog existants
19. Pages légales (privacy, terms, DPA)
20. Traductions FR, DE, NL, IT, ES, PT

---

## Optimisation SEO par type de page

### Pages features (phone-finder, email-finder...)
- Title : "[Feature] — Find [X] with Datagma | [Chiffre clé]"
- H1 : bénéfice utilisateur (pas feature name)
- Keywords : "[feature] tool", "find [data type] from linkedin", "b2b [data type] finder"

### Pages comparatifs (vs-lusha...)
- Title : "Datagma vs [Competitor] — [Key differentiator] | Datagma"
- H1 : "Datagma vs [Competitor]: Which finds more mobile numbers?"
- Contenu : tableau comparatif, benchmark, verdict
- Keywords : "[competitor] alternative", "vs [competitor]", "[competitor] vs datagma"

### Pages partenaires (clay, fullenrich...)
- Title : "Use Datagma in [Tool] — Phone Enrichment | Datagma"
- H1 : "[Tool] + Datagma: Find mobile numbers [Tool] can't"
- Keywords : "datagma [tool]", "[tool] phone enrichment", "[tool] api key datagma"
