# Cahier des Charges - Logiciel de Gestion Scolaire avec QR Code

## 1. Présentation du Projet

**Titre** : Conception et réalisation d'un logiciel de gestion scolaire avec cartes d'identification scannables par QR Code.

**Contexte** : La gestion manuelle des informations scolaires entraîne des erreurs, des pertes de données et des difficultés dans le suivi des élèves, des paiements et des présences. Une plateforme centralisée avec cartes QR Code est nécessaire.

**Objectif général** : Développer un système de gestion administrative, académique et financière avec identification rapide par QR Code.

> **Contrainte** : Livraison en **5 jours ouvrés**. Voir le tableau ci-dessous pour le périmètre.

---

## 1bis. Périmètre du projet (8 sprints)

| Module | Inclus | v2 |
|--------|--------|----|
| **Multi-tenancy** (entité ECOLE, isolation ecole_id sur toutes les tables) | ✅ | Interface création école |
| Auth (login multi-école par sous-domaine, 2 champs : email + mot de passe) | ✅ | Réinitialisation mot de passe |
| Élèves (CRUD, recherche, fiche, photo) | ✅ | Import CSV |
| Classes (CRUD, affectation élèves) | ✅ | — |
| Enseignants (CRUD, liste, distinction titulaire/non-titulaire) | ✅ | — |
| Préparation de leçons (fiches, objectifs, fichiers, historique) | ✅ **Zone enseignant** | — |
| Cours (CRUD, affectation enseignant) | ✅ | — |
| Interface titulaire (dashboard classe, suivi global des élèves) | ✅ | Rapports avancés |
| Séances (création) | ✅ | — |
| Présences (saisie batch, présent/retard/absent) | ✅ | Rapport période |
| Carte PVC + QR Code (carte élève personnalisable avec photo + **aperçu avant impression**, QR lié au profil complet) | ✅ **Fonction signature — réservé concepteur** | Scan webcam |
| Dashboard (stats de base) | ✅ | Rapports avancés |
| Profil (changement mot de passe) | ✅ | — |
| **Loading states** (skeleton, spinner, barre progression sur chaque action) | ✅ | Animations avancées |
| Déploiement | ✅ | CI/CD avancé |
| Notes & bulletins | ❌ | v2 |
| Paiements & reçus | ❌ | v2 |
| Notifications SMS et email automatisées | ✅ **Service notifications** | — |
| Paiement Mobile Money (Orange Money, M-Pesa, Wave) | ✅ **Moyens de paiement** | — |
| Bibliothèque numérique (ressources pédagogiques) | ✅ **Gestion documentaire** | — |
| Portail parent dédié (compte autonome) | ✅ **Interface parent** | — |
| Signature électronique des bulletins | ✅ **Validation numérique** | — |
| Sauvegardes & audit log | ❌ | v2 |

---

## 2. Problèmes à Résoudre

- Gestion manuelle des présences
- Perte ou détérioration des registres
- Difficulté de suivi des paiements
- Temps important pour produire les bulletins
- Absence de statistiques fiables
- Risque de fraude sur l'identification des élèves

---

## 3. Acteurs du Système

| Acteur | Responsabilités |
|--------|----------------|
| **Administrateur** | Gestion complète, utilisateurs, paramétrage, sauvegardes |
| **Directeur** | Consultation statistiques, validation rapports, contrôle |
| **Enseignant titulaire** | Gestion complète de sa classe (présences, notes, bulletins, suivi global des élèves) |
| **Enseignant non titulaire** | Encodage notes de ses cours, gestion présences de ses séances uniquement |
| **Concepteur** (super-admin) | Accès exclusif à la création et impression des cartes PVC — fonction signature du logiciel |
| **Comptable** | Gestion paiements, impression reçus, rapports financiers |
| **Élève** | Consultation résultats, utilisation carte QR Code |
| **Parent** | Consultation infos, suivi paiements, notifications suivi enfant |
| **Visiteur** (scan QR) | Accès public au profil résumé de l'élève via QR Code |

---

## 4. Besoins Fonctionnels

### Gestion des utilisateurs
Connexion, déconnexion, gestion des rôles, réinitialisation des mots de passe, interface adaptée par profil.

### Gestion des élèves
Inscription, réinscription, modification, suppression, recherche.

### Gestion des enseignants
Création, modification, suppression, affectation aux cours. Distinction **titulaire** (responsable d'une classe) et **non titulaire** (intervient sur des cours spécifiques).

### Préparation de leçons
Les enseignants (titulaires et non titulaires) disposent d'une **zone de préparation de leçon** :
- Créer une fiche de leçon (titre, objectifs, matériel, déroulement, évaluation)
- Rattacher la leçon à un cours et une classe
- Joindre des fichiers (PDF, images, vidéos)
- Historique des leçons préparées
- Modifier, supprimer, dupliquer une leçon
- Impression de la fiche de leçon

### Interface titulaire de classe
L'enseignant désigné comme **titulaire** d'une classe a accès à :
- Vue d'ensemble complète de **sa classe** (effectif, liste élèves, photo)
- Dashboard spécifique : taux de présence global, moyennes générales, absences par élève
- Suivi individuel : notes, présences, conduite de chaque élève de sa classe
- Génération de rapports de classe
- Accès à **tous** les cours de sa classe (pas seulement les siens)
- Saisie des présences pour **n'importe quel cours** de sa classe (remplacement, surveillance)

L'enseignant **non titulaire** voit uniquement :
- Ses cours assignés
- Les présences de ses propres séances
- Ses notes encodées

### Gestion des classes
Création, modification, attribution des élèves, attribution des cours, désignation d'un **enseignant titulaire** responsable de la classe.

> **3 cycles scolaires supportés** : Maternelle (PS, MS, GS), Primaire (CP, CE1, CE2, CM1, CM2), Secondaire (7e, 8e, 9e, 1e, 2e, 3e, Tle). Le niveau est géré en texte libre pour s'adapter aux systèmes éducatifs locaux.

### Gestion des présences
Saisie manuelle par l'enseignant (liste des élèves), historique, retards, absences.

### Gestion des notes
Encodage, modification, calcul des moyennes, classement.

### Gestion des bulletins
Génération automatique, impression PDF, **signature électronique** (validation numérique par le directeur).

### Gestion financière
Frais scolaires, paiements, reçus, soldes, historique.

> **Moyens de paiement supportés** : espèces, virement bancaire, **Mobile Money** (Orange Money, M-Pesa, Wave). Chaque paiement mobile génère une référence de transaction traçable.

### Gestion documentaire
Attestations, certificats, relevés de notes, **bibliothèque numérique** (partage de ressources pédagogiques, livres, exercices).

### Gestion des rapports
Rapports académiques, financiers, de présence.

---

## 5. Besoins Non Fonctionnels

- **Multi-tenancy** : isolation totale des données par école (chaque école a son propre environnement, utilisateurs, sessions)
- **Loading states** : chaque action (sauvegarde, chargement liste, génération QR, impression) doit afficher un feedback visuel (spinner, skeleton)
- Sécurisé (JWT, BCrypt, HTTPS, rôles)
- Rapide (pagination systématique)
- Disponible 24h/24
- **Notifications** : SMS et email pour alerter parents (absences, paiements, résultats)
- **API mobile** : endpoints dédiés pour consommation par application Android/iOS (React Native)
- Responsive (ordinateur et smartphone)
- Évolutif et maintenable

---

## 6. Architecture Technique

```
                    ┌─────────────────────────────────────┐
                    │      Application Mobile (v2)         │
                    │    React Native / Flutter            │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
Sous-domaines :     │     PWA Frontend (React + TS +      │
ecole1.app.com      │     Tailwind CSS) — détecte sous-   │
ecole2.app.com      │     domaine + mode hors-ligne       │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │   API REST v1 (Elysia.js)            │
                    │   extrait ecole_id du sous-domaine   │
                    │   isolation multi-tenant par req     │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │   Backend (Bun + Elysia + Prisma)    │
                    │   Service notifications (SMTP/SMS)   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │   PostgreSQL — row-level isolation   │
                    │   par ecole_id                      │
                    └─────────────────────────────────────┘
                    ┌─────────────────────────────────────┐
                    │   Stockage /uploads/<ecole_slug>/    │
                    │   (photos, logos, QR, bulletins PDF)│
                    └─────────────────────────────────────┘
```

---

## 7. Modèle Conceptuel des Données (MCD) - Version Améliorée

### Entités principales

```
ECOLE (id, nom, slug UNIQUE, logo_url, adresse, telephone, email, date_creation, actif)
    ↑  racine multi-tenant — toutes les entités ci-dessous ont ecole_id
    │
UTILISATEUR (id, nom, email, mot_de_passe, rôle, date_creation, actif, ecole_id)
├── ADMINISTRATEUR (hérite) : pas d'attributs supplémentaires
├── DIRECTEUR (hérite) : pas d'attributs supplémentaires
├── ENSEIGNANT (hérite) : spécialité, est_titulaire BOOLEAN
├── COMPTABLE (hérite) : pas d'attributs supplémentaires
├── ELEVE (hérite) : matricule, postnom, sexe, date_naissance, adresse, téléphone_parent, classe_id
└── PARENT (hérite) : téléphone, adresse
```

```
ANNEE_SCOLAIRE (id, libelle, date_debut, date_fin, active, ecole_id)
CLASSE (id, nom_classe, section, niveau, annee_scolaire_id, titulaire_id FK→ENSEIGNANT, ecole_id)
  section ∈ {'Maternelle', 'Primaire', 'Secondaire'}
COURS (id, intitule, coefficient, classe_id, enseignant_id, ecole_id)
SEANCE (id, cours_id, date, heure_debut, heure_fin, ecole_id)
CARTE_QR (id, code, eleve_id, date_creation, active, ecole_id)
LEGON (id, titre, objectifs, materiel, deroulement, evaluation, cours_id, enseignant_id, date_creation, ecole_id)
LEGON_FICHIER (id, legon_id, nom_fichier, url_fichier, type, ecole_id)
PRESENCE (id, seance_id, eleve_id, date, heure_arrivee, statut, ecole_id)
NOTE (id, eleve_id, cours_id, cote, trimestre, date, ecole_id)
BULLETIN (id, eleve_id, trimestre, date_generation, ecole_id)
BULLETIN_LIGNE (id, bulletin_id, cours_id, cote, coefficient, moyenne, ecole_id)
FRAIS_SCOLAIRE (id, libelle, montant, classe_id, annee_scolaire_id, ecole_id)
PAIEMENT (id, eleve_id, frais_scolaire_id, montant, date_paiement, mode_paiement, reference, ecole_id)
RECU (id, paiement_id, numero_recu, date_generation, ecole_id)
```

### Relations

- **ÉCOLE** → toutes les entités : 1:N (racine multi-tenant)
- **UTILISATEUR** → **ÉLÈVE/ENSEIGNANT/PARENT** : héritage (1:1)
- **CLASSE** → **ANNÉE SCOLAIRE** : N:1
- **ÉLÈVE** → **CLASSE** : N:1
- **ENSEIGNANT** → **CLASSE (titulaire)** : 1:N (un enseignant peut être titulaire de plusieurs classes)
- **ENSEIGNANT** → **COURS** : 1:N
- **COURS** → **CLASSE** : N:1
- **COURS** → **SEANCE** : 1:N
- **SEANCE** → **PRÉSENCE** : 1:N
- **ÉLÈVE** → **PRÉSENCE** : 1:N
- **ÉLÈVE** → **CARTE_QR** : 1:N
- **ÉLÈVE** → **NOTE** : 1:N
- **COURS** → **NOTE** : 1:N
- **ÉLÈVE** → **BULLETIN** : 1:N
- **BULLETIN** → **BULLETIN_LIGNE** : 1:N
- **ÉLÈVE** → **PAIEMENT** : 1:N
- **FRAIS_SCOLAIRE** → **PAIEMENT** : 1:N
- **FRAIS_SCOLAIRE** → **CLASSE** : N:1
- **FRAIS_SCOLAIRE** → **ANNÉE_SCOLAIRE** : N:1
- **PAIEMENT** → **REÇU** : 1:1

---

## 8. Schéma Relationnel - Version Améliorée

```sql
ECOLE (id UUID PK, nom VARCHAR, slug VARCHAR UNIQUE, logo_url VARCHAR, adresse TEXT, telephone VARCHAR, email VARCHAR, date_creation TIMESTAMP, actif BOOLEAN)

UTILISATEUR (id UUID PK, nom VARCHAR, email VARCHAR, mot_de_passe VARCHAR, role VARCHAR, date_creation TIMESTAMP, actif BOOLEAN, ecole_id UUID FK→ECOLE)
  UNIQUE(email, ecole_id)  -- un email peut exister dans des écoles différentes

ELEVE (id UUID PK FK→UTILISATEUR, matricule VARCHAR, postnom VARCHAR, sexe VARCHAR, date_naissance DATE, adresse TEXT, telephone_parent VARCHAR, classe_id UUID FK→CLASSE, ecole_id UUID FK→ECOLE)
  UNIQUE(matricule, ecole_id)

ENSEIGNANT (id UUID PK FK→UTILISATEUR, specialite VARCHAR, est_titulaire BOOLEAN DEFAULT false, ecole_id UUID FK→ECOLE)

PARENT (id UUID PK FK→UTILISATEUR, telephone VARCHAR, adresse TEXT, ecole_id UUID FK→ECOLE)

ANNEE_SCOLAIRE (id UUID PK, libelle VARCHAR, date_debut DATE, date_fin DATE, active BOOLEAN, ecole_id UUID FK→ECOLE)

CLASSE (id UUID PK, nom_classe VARCHAR, section VARCHAR CHECK(section IN ('Maternelle','Primaire','Secondaire')), niveau VARCHAR, annee_scolaire_id UUID FK→ANNEE_SCOLAIRE, titulaire_id UUID FK→ENSEIGNANT, ecole_id UUID FK→ECOLE)
  -- niveau : 'PS','MS','GS' pour Maternelle | 'CP','CE1','CE2','CM1','CM2' pour Primaire | '7e','8e','9e','1e','2e','3e','Tle' pour Secondaire

COURS (id UUID PK, intitule VARCHAR, coefficient INT, classe_id UUID FK→CLASSE, enseignant_id UUID FK→ENSEIGNANT, ecole_id UUID FK→ECOLE)

SEANCE (id UUID PK, cours_id UUID FK→COURS, date DATE, heure_debut TIME, heure_fin TIME, ecole_id UUID FK→ECOLE)

CARTE_QR (id UUID PK, code VARCHAR, eleve_id UUID FK→ELEVE, date_creation TIMESTAMP, active BOOLEAN, ecole_id UUID FK→ECOLE)
  UNIQUE(code, ecole_id)

LEGON (id UUID PK, titre VARCHAR, objectifs TEXT, materiel TEXT, deroulement TEXT, evaluation TEXT, cours_id UUID FK→COURS, enseignant_id UUID FK→ENSEIGNANT, date_creation TIMESTAMP, ecole_id UUID FK→ECOLE)

LEGON_FICHIER (id UUID PK, legon_id UUID FK→LEGON, nom_fichier VARCHAR, url_fichier VARCHAR, type VARCHAR, ecole_id UUID FK→ECOLE)

PRESENCE (id UUID PK, seance_id UUID FK→SEANCE, eleve_id UUID FK→ELEVE, date DATE, heure_arrivee TIME, statut VARCHAR, ecole_id UUID FK→ECOLE)

NOTE (id UUID PK, eleve_id UUID FK→ELEVE, cours_id UUID FK→COURS, cote DECIMAL, trimestre INT, date DATE, ecole_id UUID FK→ECOLE)

BULLETIN (id UUID PK, eleve_id UUID FK→ELEVE, trimestre INT, date_generation TIMESTAMP, ecole_id UUID FK→ECOLE)

BULLETIN_LIGNE (id UUID PK, bulletin_id UUID FK→BULLETIN, cours_id UUID FK→COURS, cote DECIMAL, coefficient INT, ecole_id UUID FK→ECOLE)

FRAIS_SCOLAIRE (id UUID PK, libelle VARCHAR, montant DECIMAL, classe_id UUID FK→CLASSE, annee_scolaire_id UUID FK→ANNEE_SCOLAIRE, ecole_id UUID FK→ECOLE)

PAIEMENT (id UUID PK, eleve_id UUID FK→ELEVE, frais_scolaire_id UUID FK→FRAIS_SCOLAIRE, montant DECIMAL, date_paiement DATE, mode_paiement VARCHAR, reference VARCHAR, ecole_id UUID FK→ECOLE)

RECU (id UUID PK, paiement_id UUID FK→PAIEMENT UNIQUE, numero_recu VARCHAR, date_generation TIMESTAMP, ecole_id UUID FK→ECOLE)
  UNIQUE(numero_recu, ecole_id)
```

---

---

> **Product Backlog déplacé vers** → `docs/backlog.md`

## 10. API REST - Version Complète

### Authentification (multi-école par sous-domaine)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Connexion (email + mot de passe) |
| POST | /api/auth/logout | Déconnexion |
| POST | /api/auth/forgot-password | Demande réinitialisation |
| POST | /api/auth/reset-password | Réinitialiser mot de passe |

> **Multi-tenancy par sous-domaine** : chaque école accède via `https://<ecole-slug>.app.com`. Le sous-domaine est détecté automatiquement côté backend, pas de champ supplémentaire dans le formulaire. Le JWT embarque `{ user_id, ecole_id, role }`. Chaque requête API filtre automatiquement par `ecole_id` via middleware.

### Utilisateurs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/users | Liste des utilisateurs |
| GET | /api/users/:id | Détail utilisateur |
| POST | /api/users | Créer utilisateur |
| PUT | /api/users/:id | Modifier utilisateur |
| DELETE | /api/users/:id | Supprimer utilisateur |

### Élèves
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/eleves | Liste des élèves |
| GET | /api/eleves/:id | Détail élève |
| POST | /api/eleves | Ajouter élève |
| PUT | /api/eleves/:id | Modifier élève |
| DELETE | /api/eleves/:id | Supprimer élève |
| GET | /api/eleves/:id/presences | Présences d'un élève |
| GET | /api/eleves/:id/notes | Notes d'un élève |
| GET | /api/eleves/:id/bulletins | Bulletins d'un élève |
| GET | /api/eleves/:id/paiements | Paiements d'un élève |
| GET | /api/eleves/:id/solde | Solde d'un élève |

### Enseignants
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/enseignants | Liste des enseignants |
| POST | /api/enseignants | Ajouter enseignant |
| PUT | /api/enseignants/:id | Modifier |
| DELETE | /api/enseignants/:id | Supprimer |
| GET | /api/enseignants/:id/cours | Cours d'un enseignant |

### Classes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/classes | Liste des classes |
| POST | /api/classes | Ajouter classe (section: Maternelle/Primaire/Secondaire, titulaire_id optionnel) |
| PUT | /api/classes/:id | Modifier (changer titulaire, section, niveau) |
| DELETE | /api/classes/:id | Supprimer |
| GET | /api/classes/:id/eleves | Élèves d'une classe |
| GET | /api/classes/:id/cours | Cours d'une classe |

### Cours
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/cours | Liste des cours |
| POST | /api/cours | Ajouter cours |
| PUT | /api/cours/:id | Modifier |
| DELETE | /api/cours/:id | Supprimer |

### Préparation de leçons
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/v1/legons | Liste des leçons (filtrées par enseignant connecté) |
| POST | /api/v1/legons | Créer une fiche de leçon (titre, objectifs, matériel, déroulement, évaluation) |
| GET | /api/v1/legons/:id | Détail d'une leçon |
| PUT | /api/v1/legons/:id | Modifier une leçon |
| DELETE | /api/v1/legons/:id | Supprimer une leçon |
| POST | /api/v1/legons/:id/fichiers | Joindre un fichier à la leçon |
| GET | /api/v1/legons/:id/print | Imprimer la fiche de leçon |
| GET | /api/v1/legons/cours/:coursId | Leçons liées à un cours |

### QR Code & Carte PVC
| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | /api/v1/qr/generate/:eleveId | Générer QR Code lié au profil complet de l'élève | Tous rôles |
| GET | /api/v1/qr/eleve/:eleveId | Récupérer le QR Code | Tous rôles |
| GET | /api/v1/qr/eleve/:eleveId/profil | Profil complet accessible via QR (notes, présence, conduite, activités) | Public (via scan) |
| GET | /api/v1/carte/modele | Récupérer le modèle de carte PVC configuré | Tous rôles (lecture seule) |
| PUT | /api/v1/carte/modele | Personnaliser le modèle de carte (couleurs, logo, champs) | **Concepteur uniquement** |
| GET | /api/v1/carte/eleve/:eleveId/preview | Aperçu HTML de la carte (sans contrôles) | Tous rôles |
| GET | /api/v1/carte/eleve/:eleveId/print | Générer la carte PVC prête à imprimer (PDF) | **Concepteur uniquement** |
| POST | /api/v1/carte/print/batch | Impression groupée de cartes (lots) | **Concepteur uniquement** |

### Présences
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/presences | Liste des présences |
| POST | /api/presences | Enregistrer présence (saisie manuelle) |
| POST | /api/presences/batch | Enregistrer présences groupées (par séance) |
| GET | /api/presences/:id | Détail |
| PUT | /api/presences/:id | Modifier statut |
| GET | /api/presences/seance/:seanceId | Présences d'une séance |
| GET | /api/presences/rapport | Rapport de présence |

### Séances
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/seances | Liste des séances |
| POST | /api/seances | Créer séance |
| PUT | /api/seances/:id | Modifier |
| DELETE | /api/seances/:id | Supprimer |

### Notes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/notes | Liste des notes |
| POST | /api/notes | Encoder note |
| PUT | /api/notes/:id | Modifier |
| DELETE | /api/notes/:id | Supprimer |
| POST | /api/notes/moyennes | Calculer moyennes |

### Bulletins
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/bulletins | Liste des bulletins |
| POST | /api/bulletins/generate | Générer bulletin |
| GET | /api/bulletins/:id/pdf | Télécharger PDF |
| GET | /api/bulletins/eleve/:eleveId | Bulletins d'un élève |

### Paiements
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/paiements | Liste des paiements |
| POST | /api/paiements | Enregistrer paiement |
| GET | /api/paiements/:id | Détail |
| GET | /api/paiements/:id/recu | Reçu PDF |

### Frais Scolaires
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/frais | Liste des frais |
| POST | /api/frais | Ajouter frais |
| PUT | /api/frais/:id | Modifier |
| DELETE | /api/frais/:id | Supprimer |

### Rapports
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/rapports/presences | Rapport présences |
| GET | /api/rapports/financier | Rapport financier |
| GET | /api/rapports/academique | Rapport académique |
| GET | /api/dashboard/stats | Statistiques tableau de bord |

### Paramètres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/settings | Paramètres système |
| PUT | /api/settings | Modifier paramètres |
| POST | /api/backup | Sauvegarde manuelle |

---

## 11. Structure du Projet

```
gestion-scolaire/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── roles.ts
│   │   │   └── validate.ts
│   │   ├── validators/
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   └── migrations/
│   │   ├── utils/
│   │   └── index.ts
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── docs/
    ├── analyse.md
    ├── backlog.md
    └── charte-graphique.md
```

---

## 12. Interfaces à Développer

1. **Connexion** — Formulaire email + mot de passe
2. **Dashboard** — Cartes statistiques adaptées au rôle :
   - *Admin* : vue globale (utilisateurs, sauvegardes, stats système)
   - *Directeur* : stats académiques, financières, taux de présence
   - *Enseignant titulaire* : vue complète de sa classe (présences, notes, bulletins, suivi individuel de chaque élève)
   - *Enseignant non titulaire* : ses cours uniquement, présences de ses séances
   - *Comptable* : encaissements, impayés, soldes
   - *Élève* : ses notes, ses bulletins, sa carte QR
   - *Parent* (portail dédié) : suivi de son enfant (notes, présence, paiements, notifications en temps réel)
3. **Élèves** — Liste + formulaire CRUD + fichier
4. **Enseignants** — Liste + formulaire CRUD
5. **Classes** — Liste + formulaire + affectation élèves
6. **Cours** — Liste + formulaire + affectation enseignants
7. **Préparation de leçons** — Fiches de leçon (titre, objectifs, matériel, déroulement, évaluation), rattachement cours/classe, jointure fichiers, historique, impression
8. **Carte PVC personnalisable** — Générateur de carte étudiant avec photo + QR Code + modèle configurable (couleurs, logo, champs affichés). Impression directe au format carte d'identité. **Fonction signature du logiciel.**
8. **Présences** — Saisie manuelle + historique + rapport
9. **Notes** — Grille d'encodage + relevés
10. **Bulletins** — Génération + aperçu + PDF
11. **Paiements** — Caisse + soldes + reçus + historique
12. **Frais scolaires** — Configuration des frais par classe
13. **Rapports** — Graphiques + exports
14. **Paramètres** — Utilisateurs, rôles, sauvegarde
15. **Profil** — Mon profil, changement mot de passe
16. **Portail parent** — Interface dédiée pour le suivi des enfants (notes, présences, paiements, notifications) avec accès via un lien unique ou compte dédié
17. **Application mobile** (v2) — React Native, scan QR, notifications push, mode hors-ligne

---

## 13. Processus de Saisie des Présences

1. Enseignant sélectionne un cours et crée une séance
2. La séance s'affiche avec la liste des élèves inscrits
3. L'enseignant coche manuellement chaque élève : **Présent**, **Retard** ou **Absent**
4. Optionnel : scan du QR Code pour identifier rapidement un élève
5. Validation groupée : toutes les présences sont enregistrées en une fois
6. L'historique est consultable par séance, cours, période ou élève

---

## 14. Carte PVC Personnalisable — Fonction Signature

> **Élément différenciateur du logiciel — réservé au concepteur (super-admin)** : la carte étudiante avec QR Code dynamique. L'école ne peut pas imprimer ni modifier le modèle de carte.

Le QR Code sur la carte ne sert pas qu'aux présences. Il pointe vers une **page web unique** qui centralise **toutes** les informations de l'élève :

| Information | Détail |
|-------------|--------|
| **Notes** | Relevé par trimestre, moyennes, classement |
| **Présences** | Taux de présence, absences, retards |
| **Conduite** | Sanctions, avertissements, félicitations |
| **Activités** | Clubs, projets, applications scolaires |

La carte est **personnalisable uniquement par le concepteur** (super-admin) :
- Couleurs (fond, texte, accent)
- Logo de l'établissement
- Champs affichés (photo, matricule, classe, etc.)
- Format (CR-80 ou CR-100)
- Mention au verso
- Type de PVC (blanc, métallisé)

> Les administrateurs d'école voient uniquement l'aperçu et le QR Code. La section "Impression" et "Personnalisation du modèle" leur est masquée — seuls les utilisateurs avec le rôle `CONCEPTEUR` y ont accès.

### Aperçu avant impression (accessible à tous)
Avant d'imprimer, l'utilisateur voit un **aperçu temps réel** de la carte :

1. Le concepteur sélectionne un élève ou un lot d'élèves
2. Le système génère un **aperçu HTML/CSS** de la carte (recto + verso) dans une modale
3. Le concepteur peut ajuster les paramètres (couleur, champs) et voir l'aperçu se mettre à jour **instantanément**
4. Validation → génération du PDF prêt à imprimer

> **Loading state** : un skeleton de la carte s'affiche pendant la génération de l'aperçu

### Cycle de vie
1. **Génération** : automatique à l'inscription de l'élève (loading spinner sur le bouton)
2. **Aperçu** : modale interactive avec preview temps réel (visible par l'école, sans les contrôles de personnalisation)
3. **Impression** : depuis l'interface concepteur uniquement, en lots ou à l'unité (barre de progression pour les impressions groupées)
4. **Désactivation** : à la sortie de l'élève (fin d'année, exclusion)
5. **Réimpression** : en cas de perte (l'école fait la demande → le concepteur imprime)

### Loading states (UI)
| Action | Feedback |
|--------|----------|
| Connexion | Bouton "Connexion..." désactivé + spinner |
| Chargement liste élèves/classes/cours | Skeleton rows (5 lignes animées) |
| Ajout/Modification élève | Bouton "Enregistrement..." désactivé |
| Génération QR Code | Spinner sur la carte + "Génération du QR..." |
| Aperçu carte | Skeleton carte (recto/verso) |
| Impression carte | Barre de progression + "Impression en cours..." |
| Sauvegarde présence | Bouton "Validation..." + checkmark animé |
| Dashboard | Skeleton cards (4 cartes) |
| Upload photo | Barre de progression avec % |
| Création fiche leçon | Spinner "Enregistrement..." |
| Chargement liste leçons | Skeleton rows |
| Impression fiche leçon | Spinner "Génération PDF..." |
| Suppression | Modal confirmation + "Suppression..." |
| Envoi notification | Spinner "Envoi..." + checkmark |
| Paiement Mobile Money | Spinner "Transaction en cours..." + confirmation |
| Signature bulletin | Spinner "Signature..." + badge "Signé" |
| Upload bibliothèque | Barre progression + % |

---

## 15. Sécurité

- **JWT** pour authentification
- **BCrypt** pour hash des mots de passe
- **HTTPS** obligatoire
- **Validation** des formulaires (Joi/Zod)
- **RBAC** (Role-Based Access Control)
- **Rate limiting** sur les endpoints critiques
- **Journalisation** des activités (audit trail)
- **Sauvegardes** automatiques PostgreSQL
- **CORS** configuré

---

## 15. Tests

### Tests (périmètre 5 jours)
- Test manuel du parcours complet : connexion → créer classe → inscrire élève → générer QR → créer séance → saisir présences → dashboard
- Tests unitaires sur les services critiques (auth, présence, élève)

### Tests (v2)
- Tests d'intégration automatisés (Supertest)
- Tests E2E (Cypress/Playwright)
- Tests de performance (k6)

---

## 16. Déploiement

| Couche | Plateforme |
|--------|-----------|
| Frontend | Vercel / Netlify |
| Backend | Railway / Render / VPS Ubuntu |
| Base de données | PostgreSQL (Supabase / AWS RDS) |
| Stockage PDF | Cloudinary / S3 / Local |
| CI/CD | GitHub Actions |

---

## 17. Évolutions Futures

- Tableau de bord avec IA prédictive
- Emploi du temps intelligent

---

## 18. Améliorations recommandées (analyse)

### Modèle de données
- **Ajouter `ELEVE_PARENT`** : table N:N entre élève et parent (actuellement aucun lien)
- **Ajouter `HORAIRE`** : planning hebdomadaire (jour, heure, salle) pour emploi du temps
- **Ajouter `DISCIPLINE`** : suivi des sanctions/comportements

### Règles métier à clarifier
- Formule de calcul des moyennes (pondération ? éliminatoire ?)
- Nombre de trimestres et dates de coupure
- Exemptions/réductions sur frais scolaires

### Technique
- Versionner l'API : `/api/v1/...`
- Spécifier la gestion d'état frontend (TanStack Query recommandé)
- Pagination sur toutes les listes
- Upload photos élèves (stockage local ou cloud)
- Validation Zod partagée frontend/backend

### Conformité
- RGPD : consentement parental, droit à l'effacement des données élèves
