# Cahier des Charges - Logiciel de Gestion Scolaire avec QR Code

## 1. Présentation du Projet

**Titre** : Conception et réalisation d'un logiciel de gestion scolaire avec cartes d'identification scannables par QR Code.

**Contexte** : La gestion manuelle des informations scolaires entraîne des erreurs, des pertes de données et des difficultés dans le suivi des élèves, des paiements et des présences. Une plateforme centralisée avec cartes QR Code est nécessaire.

**Objectif général** : Développer un système de gestion administrative, académique et financière avec identification rapide par QR Code.

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
| **Enseignant** | Encodage notes, consultation classes, gestion présences |
| **Comptable** | Gestion paiements, impression reçus, rapports financiers |
| **Élève** | Consultation résultats, utilisation carte QR Code |
| **Parent** | Consultation infos, suivi paiements |

---

## 4. Besoins Fonctionnels

### Gestion des utilisateurs
Connexion, déconnexion, gestion des rôles, réinitialisation des mots de passe, interface adaptée par profil.

### Gestion des élèves
Inscription, réinscription, modification, suppression, recherche.

### Gestion des enseignants
Création, modification, suppression, affectation aux cours.

### Gestion des classes
Création, modification, attribution des élèves, attribution des cours.

### Gestion des présences
Saisie manuelle par l'enseignant (liste des élèves), historique, retards, absences.

### Gestion des notes
Encodage, modification, calcul des moyennes, classement.

### Gestion des bulletins
Génération automatique, impression PDF.

### Gestion financière
Frais scolaires, paiements, reçus, soldes, historique.

### Gestion documentaire
Attestations, certificats, relevés de notes.

### Gestion des rapports
Rapports académiques, financiers, de présence.

---

## 5. Besoins Non Fonctionnels

- Sécurisé (JWT, BCrypt, HTTPS, rôles)
- Rapide
- Disponible 24h/24
- Responsive (ordinateur et smartphone)
- Évolutif et maintenable

---

## 6. Architecture Technique

```
Frontend (React + TypeScript + Tailwind CSS)
       ↓
    API REST (Elysia.js)
       ↓
Backend (Bun + Elysia + Prisma ORM)
       ↓
   PostgreSQL (Supabase / Neon / Railway)
       ↓
 Stockage PDF (Cloudinary / S3 / Local)
```

---

## 7. Modèle Conceptuel des Données (MCD) - Version Améliorée

### Entités principales

```
UTILISATEUR (id, nom, email, mot_de_passe, rôle, date_creation, actif)
├── ADMINISTRATEUR (hérite) : pas d'attributs supplémentaires
├── DIRECTEUR (hérite) : pas d'attributs supplémentaires
├── ENSEIGNANT (hérite) : spécialité
├── COMPTABLE (hérite) : pas d'attributs supplémentaires
├── ELEVE (hérite) : matricule, postnom, sexe, date_naissance, adresse, téléphone_parent, classe_id
└── PARENT (hérite) : téléphone, adresse
```

```
ANNEE_SCOLAIRE (id, libelle, date_debut, date_fin, active)
CLASSE (id, nom_classe, section, niveau, annee_scolaire_id)
COURS (id, intitule, coefficient, classe_id, enseignant_id)
SEANCE (id, cours_id, date, heure_debut, heure_fin)
CARTE_QR (id, code, eleve_id, date_creation, active)
PRESENCE (id, seance_id, eleve_id, date, heure_arrivee, statut)
NOTE (id, eleve_id, cours_id, cote, trimestre, date)
BULLETIN (id, eleve_id, trimestre, date_generation)
BULLETIN_LIGNE (id, bulletin_id, cours_id, cote, coefficient, moyenne)
FRAIS_SCOLAIRE (id, libelle, montant, classe_id, annee_scolaire_id)
PAIEMENT (id, eleve_id, frais_scolaire_id, montant, date_paiement, mode_paiement, reference)
RECU (id, paiement_id, numero_recu, date_generation)
```

### Relations

- **UTILISATEUR** → **ÉLÈVE/ENSEIGNANT/PARENT** : héritage (1:1)
- **CLASSE** → **ANNÉE SCOLAIRE** : N:1
- **ÉLÈVE** → **CLASSE** : N:1
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
UTILISATEUR (id UUID PK, nom VARCHAR, email VARCHAR UNIQUE, mot_de_passe VARCHAR, role VARCHAR, date_creation TIMESTAMP, actif BOOLEAN)

ELEVE (id UUID PK FK→UTILISATEUR, matricule VARCHAR UNIQUE, postnom VARCHAR, sexe VARCHAR, date_naissance DATE, adresse TEXT, telephone_parent VARCHAR, classe_id UUID FK→CLASSE)

ENSEIGNANT (id UUID PK FK→UTILISATEUR, specialite VARCHAR)

PARENT (id UUID PK FK→UTILISATEUR, telephone VARCHAR, adresse TEXT)

ANNEE_SCOLAIRE (id UUID PK, libelle VARCHAR, date_debut DATE, date_fin DATE, active BOOLEAN)

CLASSE (id UUID PK, nom_classe VARCHAR, section VARCHAR, niveau INT, annee_scolaire_id UUID FK→ANNEE_SCOLAIRE)

COURS (id UUID PK, intitule VARCHAR, coefficient INT, classe_id UUID FK→CLASSE, enseignant_id UUID FK→ENSEIGNANT)

SEANCE (id UUID PK, cours_id UUID FK→COURS, date DATE, heure_debut TIME, heure_fin TIME)

CARTE_QR (id UUID PK, code VARCHAR UNIQUE, eleve_id UUID FK→ELEVE, date_creation TIMESTAMP, active BOOLEAN)

PRESENCE (id UUID PK, seance_id UUID FK→SEANCE, eleve_id UUID FK→ELEVE, date DATE, heure_arrivee TIME, statut VARCHAR)

NOTE (id UUID PK, eleve_id UUID FK→ELEVE, cours_id UUID FK→COURS, cote DECIMAL, trimestre INT, date DATE)

BULLETIN (id UUID PK, eleve_id UUID FK→ELEVE, trimestre INT, date_generation TIMESTAMP)

BULLETIN_LIGNE (id UUID PK, bulletin_id UUID FK→BULLETIN, cours_id UUID FK→COURS, cote DECIMAL, coefficient INT)

FRAIS_SCOLAIRE (id UUID PK, libelle VARCHAR, montant DECIMAL, classe_id UUID FK→CLASSE, annee_scolaire_id UUID FK→ANNEE_SCOLAIRE)

PAIEMENT (id UUID PK, eleve_id UUID FK→ELEVE, frais_scolaire_id UUID FK→FRAIS_SCOLAIRE, montant DECIMAL, date_paiement DATE, mode_paiement VARCHAR, reference VARCHAR)

RECU (id UUID PK, paiement_id UUID FK→PAIEMENT UNIQUE, numero_recu VARCHAR UNIQUE, date_generation TIMESTAMP)
```

---

---

> **Product Backlog déplacé vers** → `docs/backlog.md`

## 10. API REST - Version Complète

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Connexion |
| POST | /api/auth/logout | Déconnexion |
| POST | /api/auth/forgot-password | Demande réinitialisation |
| POST | /api/auth/reset-password | Réinitialiser mot de passe |

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
| POST | /api/classes | Ajouter classe |
| PUT | /api/classes/:id | Modifier |
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

### QR Code
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/qr/generate | Générer QR Code pour un élève |
| GET | /api/qr/eleve/:id | QR Code d'un élève |
| POST | /api/qr/scan | Scanner QR Code (identification élève) |

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
   - *Enseignant* : ses cours, ses classes, présences du jour
   - *Comptable* : encaissements, impayés, soldes
   - *Élève* : ses notes, ses bulletins, sa carte QR
   - *Parent* : suivi de son enfant (notes, présence, paiements)
3. **Élèves** — Liste + formulaire CRUD + fichier
4. **Enseignants** — Liste + formulaire CRUD
5. **Classes** — Liste + formulaire + affectation élèves
6. **Cours** — Liste + formulaire + affectation enseignants
7. **QR Code** — Génération + impression + scan (lecteur webcam)
8. **Présences** — Saisie manuelle + historique + rapport
9. **Notes** — Grille d'encodage + relevés
10. **Bulletins** — Génération + aperçu + PDF
11. **Paiements** — Caisse + soldes + reçus + historique
12. **Frais scolaires** — Configuration des frais par classe
13. **Rapports** — Graphiques + exports
14. **Paramètres** — Utilisateurs, rôles, sauvegarde
15. **Profil** — Mon profil, changement mot de passe

---

## 13. Processus de Saisie des Présences

1. Enseignant sélectionne un cours et crée une séance
2. La séance s'affiche avec la liste des élèves inscrits
3. L'enseignant coche manuellement chaque élève : **Présent**, **Retard** ou **Absent**
4. Optionnel : scan du QR Code pour identifier rapidement un élève
5. Validation groupée : toutes les présences sont enregistrées en une fois
6. L'historique est consultable par séance, cours, période ou élève

---

## 14. Sécurité

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

### Tests fonctionnels
- Connexion
- CRUD élèves
- Saisie manuelle des présences
- Encodage notes
- Paiement + reçu
- Génération bulletin

### Tests techniques
- Tests unitaires (Jest)
- Tests d'intégration (Supertest)
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

- Application mobile Android/iOS
- Notifications SMS et email
- Paiement Mobile Money (Orange Money, M-Pesa, Wave)
- Bibliothèque numérique
- Reconnaissance faciale
- Portail parent dédié
- Signature électronique des bulletins
- Tableau de bord avec IA prédictive
- Emploi du temps intelligent
