# Datagma — Analyse concurrentielle

## Concurrents principaux à traiter (pages VS)

### Priorité 1 (pages à créer)
1. **Lusha** — concurrent direct sur le phone finder
2. **ContactOut** — alternative email + phone
3. **IcyPeas** — concurrent émergent

### Concurrents mentionnés dans le contenu existant
- **Clearbit** (racheté par HubSpot, devenu Breeze) — différenciation GDPR
- **Apollo** — concurrent mais aussi partenaire potentiel
- **Kaspr** — phone finder
- **Hunter.io** — email finder
- **Phantom Buster, Evaboot, Captain Data, TexAu** — tools LinkedIn scraping

---

## Datagma vs Lusha

### Avantages Datagma
- **Plus de téléphones** : Datagma 77% (Inde), 69% (UK), 74% (US) vs Lusha 44%, 29%, 41%
- **Mobiles uniquement** : Datagma garantit uniquement des mobiles ; Lusha mélange mobiles et fixes
- **Prix** : Datagma $0.58/phone vs Lusha $0.75/phone (sur plan Premium)
- **Emails inclus** dans le plan Datagma ; chez Lusha, 1 crédit = 1 email OU 1 phone (pas les deux)
- **Crédits reportables** : oui chez Datagma, oui chez Lusha
- **Pause du compte** : possible chez Datagma, non chez Lusha
- **GDPR** : Datagma crawle en temps réel (pas de base de données) — Lusha a une base de données
- **Recherche par nom+pays** : Datagma oui, Lusha nécessite souvent LinkedIn URL
- **WhatsApp intégration** : Datagma oui, Lusha non
- **Job Change Detection** : Datagma oui, Lusha non natif

### Points où Lusha est fort
- Brand recognition plus forte
- Extension Chrome très connue
- UI/UX plus mature
- Plus de crédits sur certains plans gratuits

### Positionnement messaging suggéré
"Lusha trouve des numéros. Datagma trouve les bons numéros — uniquement des mobiles, avec un taux de match 1,8x supérieur."

---

## Datagma vs Clearbit (devenu HubSpot Breeze)

### Avantages Datagma
- **GDPR by design** : Clearbit avait une base de données (incompatible GDPR sans settings spéciaux), Datagma crawle en temps réel
- **Données fraîches** : Clearbit base de données statique, Datagma temps réel
- **Prix** : Clearbit très cher pour les PME, Datagma accessible
- **Phone Finder** : Clearbit ne propose pas de phone finder natif
- **Job Change Detection** : Clearbit ne proposait pas ce feature

### Positionnement messaging suggéré
"Clearbit est une base de données qui expire. Datagma crawle le web en temps réel pour vous donner des données fraîches — et c'est 100% GDPR sans compromis."

---

## Datagma vs Apollo

### Avantages Datagma sur les téléphones
- US : Datagma 74% vs Apollo 64% — mais surtout
- Apollo mobile vs landline : sur un test, **89% des numéros Apollo étaient des fixes** (landlines), pas des mobiles
- Prix : Datagma $0.58/phone vs Apollo $2/phone

### Positionnement coexistence
Apollo est souvent utilisé pour la prospection email (forte base de données US) et Datagma pour les téléphones. Ils peuvent être complémentaires dans un waterfall.

### Page partenaire Apollo suggérée
"Comment utiliser Datagma dans Apollo pour enrichir avec des numéros mobiles que Apollo ne trouve pas"

---

## Benchmark téléphones (source : blog Datagma)

Test réalisé sur 400 profils LinkedIn (Captain Data), 3 marchés : Inde, UK, US

| Marché | Datagma | Lusha | Kaspr | Apollo |
|--------|---------|-------|-------|--------|
| Inde | **77%** | 44% | 46% | 3% |
| UK | **69%** | 29% | 44% | 22% |
| US | **74%** | 41% | 39% | 64% |
| Type | ✅ Mobile uniquement | ❌ Mixte | ❌ Mixte | ❌ 89% fixes |
| Prix | $0.58 | $0.75 | $0.60 | $2.00 |

---

## Différenciation globale Datagma

| Critère | Datagma | Concurrents |
|---------|---------|-------------|
| Type données phone | Mobiles uniquement ✅ | Mobiles + fixes |
| Recherche sans LinkedIn URL | ✅ Oui (nom+pays) | ❌ Souvent non |
| Données temps réel | ✅ Crawling live | ❌ Base de données |
| GDPR by design | ✅ Oui | ⚠️ Variable |
| WhatsApp intégration | ✅ Oui | ❌ Non |
| Job Change Detection | ✅ Oui | Partiel |
| Waterfall compatible | ✅ Oui (Clay, Fullenrich...) | Variable |
| Crédits reportables | ✅ 12 mois | Variable |
| Pause compte | ✅ Oui | ❌ Souvent non |
