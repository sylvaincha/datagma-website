# Datagma — Vue d'ensemble produit

## Tagline actuelle
"Choose the Best Contact Detail Finder — B2B Data Enrichment & Phone Finder"

## Proposition de valeur principale
Datagma est un outil de data enrichment B2B en temps réel spécialisé dans la recherche de **numéros de téléphone mobile** et d'**emails vérifiés**. Contrairement aux concurrents, Datagma n'a pas de base de données statique : il crawle le web en temps réel à chaque requête.

## Chiffres clés (à mettre en avant)
- **3 millions** d'emails vérifiés trouvés par jour
- **7 millions** de numéros de téléphone mobile trouvés par jour
- **75+ data points** par contact
- **3 millions+** de contacts enrichis

## Différenciateurs majeurs

### 1. Téléphones mobiles — le vrai avantage concurrentiel
Datagma trouve UNIQUEMENT des numéros MOBILES (pas de fixes). Les concurrents mélangent mobiles et fixes dans leur résultat.

Benchmark interne (400 profils LinkedIn, sources: India, UK, US) :
| | Datagma | Lusha | Kaspr | Apollo |
|---|---|---|---|---|
| Inde | **77%** | 44% | 46% | 3% |
| UK | **69%** | 29% | 44% | 22% |
| US | **74%** | 41% | 39% | 64% |
| Type | ✅ Mobile only | ❌ Mixte | ❌ Mixte | ❌ 89% fixes |

Prix par téléphone : Datagma $0.58 | Lusha $0.75 | Kaspr $0.6 | Apollo $2

### 2. Recherche par nom + pays (sans LinkedIn URL)
Datagma permet de trouver un contact en entrant simplement :
- Prénom + Nom + Pays
- Nom + Entreprise
- LinkedIn URL
- Email
- Siren (FR)
- Nom d'entreprise seul

Les concurrents nécessitent souvent une URL LinkedIn.

### 3. Données en temps réel (pas de base de données)
- Crawling du web public à chaque requête
- 100% GDPR compliant par design (pas de stockage de données personnelles)
- Si quelqu'un change d'entreprise, on trouve ses nouvelles coordonnées immédiatement

### 4. WhatsApp intégration
- Détecte si un numéro est lié à WhatsApp
- Click-to-call et click-to-message depuis l'interface

### 5. Vérification emails avancée
- Partenariat avec ZeroBounce pour vérification
- Advanced Catchall Detection : vérifie si l'email catchall est lié à un compte social (LinkedIn, Facebook, GitHub)
- Advanced Bounce Detection : partenariat avec les outils d'envoi email froids pour identifier les bounces

## Fonctionnalités

### Email Finder
- Trouve des emails vérifiés depuis : nom+entreprise, LinkedIn URL, job title+company
- Anti-bounce et anti-catchall avancés
- API disponible
- Bulk via File Upload (CSV)
- Extension Chrome

### Phone Finder
- UNIQUEMENT numéros mobiles
- Lookup par nom, LinkedIn URL, entreprise, job title
- WhatsApp intégration native
- API disponible
- Bulk jusqu'à 50 000 contacts

### Job Change Detection
- Alertes en temps réel (1-2 semaines) quand un contact change d'entreprise
- Intégration HubSpot, Pipedrive, API, Zapier, Make
- Crée automatiquement une tâche dans le CRM
- Signal d'achat le plus chaud : contacter quelqu'un qui vient de changer de poste

### Chrome Extension
- Fonctionne sur LinkedIn et LinkedIn Sales Navigator
- Extraction des emails et téléphones depuis un profil
- Export CSV/list
- Bulk depuis Sales Navigator
- 2 500 profils/jour

### File Upload
- Upload CSV avec contacts incomplets
- Enrichit avec 75+ data points
- Modes : Email Only, Phone Only, Employee Search, Twitter, Job Change, Full Enrichment
- Jusqu'à 50 000 entrées
- Données en temps réel

### API
- REST API, GET calls uniquement
- Inputs acceptés : LinkedIn URL, Email, Nom+Prénom, Nom d'entreprise, Site web, Siren
- Outputs : Personal Data, Company Data, Financial Data, Website Data
- Documentation : https://docs.datagma.com
- Token gratuit disponible

## Data points disponibles (75+)

### Données personnelles
email vérifiés, numéros mobiles, job title, role, seniority, gender, date of birth, LinkedIn URL

### Données entreprise  
tags (B2B/B2C/SaaS...), industry, locations, taille, nombre d'employés, présence sociale, HQ address, company phone, legal name, SIREN (FR), technology used

### Données financières
revenue, total amount raised, last funding date, last funding type, IPO, investors, funding stage

### Données web
Semrush traffic, Alexa Rank, traffic sources, advertising platforms, tech stack

## Intégrations
- HubSpot (natif, bidirectionnel)
- Pipedrive (natif, bidirectionnel)
- Zapier
- Make (ex-Integromat)
- n8n
- API REST (tous plans payants)
- Clay (provider natif)
- Captain Data
- WhatsApp

## ICP (Ideal Customer Profile)
1. **SDR/BDR/AE** en prospection outbound
2. **Growth Hackers** enrichissant des listes Clay/N8N/Make
3. **RevOps** maintenant la qualité CRM (HubSpot, Pipedrive)
4. **Développeurs** intégrant Email/Phone Finder dans leurs apps
5. **Recruteurs** cherchant les coordonnées de candidats

## Cas d'usage
- Prospection LinkedIn → extraction emails + téléphones en masse
- Enrichissement CRM HubSpot/Pipedrive automatique
- Waterfall enrichment (Clay, Fullenrich, BetterContact...)
- Job Change Monitoring pour ré-activer des leads froids
- Recrutement : trouver les coordonnées de candidats
- API pour PLG : enrichir chaque nouveau signup avec les données entreprise

## Conformité
- GDPR aligné (pas de base de données statique)
- CCPA compliant
- Emails vérifiés par ZeroBounce / NeverBounce
- DPA disponible sur demande
