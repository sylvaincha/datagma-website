# Datagma — FAQ compilée (depuis le site existant)

## FAQ Général / Pricing

**Pourquoi je ne peux pas m'inscrire avec mon adresse email perso ?**
Pour s'inscrire sur Datagma, vous avez besoin d'une adresse email professionnelle (ex: john@pearrr.com). Gmail, Yahoo, Hotmail et les emails génériques comme admin@, sales@, info@ ne sont pas acceptés.

**Avez-vous des plans pour les grandes équipes ?**
Oui. Pour 5 utilisateurs ou plus, contactez notre équipe commerciale pour un plan Enterprise sur-mesure.

**Puis-je annuler mon abonnement ?**
Oui, à tout moment. Allez dans Mon compte > Facturation > Annuler. Vous gardez vos crédits jusqu'à la fin de la période.

**Datagma s'intègre-t-il avec mon CRM ?**
Oui : HubSpot et Pipedrive en natif (enrichissement bidirectionnel). Zapier, Make, n8n pour tous les autres CRM. API REST disponible sur tous les plans payants.

**Les données Datagma sont-elles GDPR/CCPA compliant ?**
Oui. Datagma crawle des sources publiques en temps réel et ne maintient pas de base de données de données personnelles. C'est GDPR compliant by design.

**Les crédits inutilisés sont-ils reportés ?**
Oui. Les crédits non utilisés se reportent chaque mois, jusqu'à 12 mois, tant que vous êtes abonné. Sur les plans annuels, tous les crédits sont crédités à l'achat.

---

## FAQ Email Finder

**Comment trouver des emails vérifiés ?**
Entrez le nom complet, l'URL LinkedIn, ou l'entreprise + poste dans le moteur de recherche Datagma. Le système crawle le web en temps réel et retourne des emails vérifiés.

**Comment fonctionne le Email Finder ?**
Datagma scanne des sources publiques (sites web, réseaux sociaux, bases de données publiques) pour trouver l'email associé à un individu ou une entreprise.

**Peut-on extraire des emails depuis LinkedIn ?**
Oui, via la Chrome Extension. Browsez un profil LinkedIn et Datagma trouve l'email associé. Jusqu'à 2 500 profils/jour.

**Quelle est la précision des emails ?**
Datagma vérifie tous les emails avec ZeroBounce. Le système détecte aussi les catchalls en les croisant avec les comptes sociaux (LinkedIn, Facebook, GitHub) pour valider.

**Peut-on trouver des emails en masse ?**
Oui. Via File Upload (CSV jusqu'à 50 000 entrées) ou via l'API.

---

## FAQ Phone Finder

**Datagma trouve-t-il des numéros de téléphone fixes ou mobiles ?**
Uniquement des numéros MOBILES. Datagma ne retourne pas de numéros fixes.

**Quel est le taux de match pour les téléphones ?**
Environ 69-77% sur des marchés comme l'Inde, le UK et les US. Voir le benchmark complet dans notre article "Phone Numbers API Guide".

**Peut-on appeler via WhatsApp directement depuis Datagma ?**
Oui. Datagma détecte si un numéro est lié à WhatsApp et permet un click-to-call/click-to-message directement depuis l'interface.

---

## FAQ Chrome Extension

**Sur quels réseaux fonctionne la Chrome Extension ?**
LinkedIn et LinkedIn Sales Navigator.

**Combien de profils puis-je enrichir par jour ?**
2 500 profils par jour avec la Chrome Extension.

**L'extension nécessite-t-elle un cookie de session LinkedIn ?**
Non. Datagma ne nécessite pas de cookie de session LinkedIn, contrairement à certains concurrents.

---

## FAQ API

**Comment démarrer avec l'API ?**
Créez un compte, récupérez votre token API gratuit dans votre dashboard. L'API ne nécessite que des GET calls. Documentation : docs.datagma.com

**Quels inputs accepte l'API ?**
LinkedIn URL, email, nom+prénom, nom d'entreprise, site web, numéro SIREN (France).

**Quels outputs retourne l'API ?**
Personal Data (email, téléphone, job title, seniority...), Company Data (industry, size, tags...), Financial Data (funding, revenue...), Website Data (traffic, tech stack...).

---

## FAQ HubSpot Enrichment

**Comment fonctionne l'enrichissement HubSpot ?**
Datagma enrichit automatiquement tous les nouveaux contacts ajoutés à HubSpot avec 70+ propriétés custom. Les contacts existants peuvent aussi être enrichis manuellement.

**Est-ce que Datagma efface mes données HubSpot existantes ?**
Non. Datagma ne supprime aucune donnée existante.

**Comment le Job Change Detection fonctionne avec HubSpot ?**
Quand un contact quitte son entreprise, Datagma met à jour ses propriétés dans HubSpot et crée une tâche pour le propriétaire du contact.
