# Product Backlog — Gestion Scolaire QR Code

**Priorités** : 🔴 J1 | 🟡 J2 | 🟢 J3 | 🔵 J4 | ⚪ J5 | 🟣 J6 | 🟤 J7 | ⚫ J8

---

> **Règle transverse** : chaque action (sauvegarde, chargement, génération, impression) doit afficher un loading state — spinner sur bouton, skeleton rows pour les listes, barre de progression pour les uploads/impressions groupées.

---

## J1 — Setup & Authentification (multi-école)

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| S-001 | Initialiser backend (Bun + Elysia + Prisma + PostgreSQL) | 🔴 J1 | 2h | ok
| S-002 | Initialiser frontend (React + TypeScript + Tailwind + React Query) | 🔴 J1 | 2h |
| S-003 | Schéma Prisma avec entité ECOLE + ecole_id sur toutes les tables | 🔴 J1 | 3h |
| US-001 | Seed de l'école + administrateur principal (création école + admin) | 🔴 J1 | 1h |
| US-002 | Connexion multi-école (par sous-domaine — email + mot de passe uniquement) | 🔴 J1 | 3h |
| US-003 | Déconnexion | 🔴 J1 | 1h |
| US-004 | Interface adaptée au rôle (layout sidebar, routing, school context) | 🔴 J1 | 3h |
| S-004 | Middleware auth JWT + filtre ecole_id sur chaque requête | 🔴 J1 | 2h |

---

> **Loading states J2** : skeleton rows sur les listes, spinner sur boutons de sauvegarde, barre de progression upload photo.

## J2 — Élèves & Classes

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| US-006 | Ajouter un élève | 🟡 J2 | 3h |
| US-007 | Modifier un élève | 🟡 J2 | 1h |
| US-008 | Supprimer un élève | 🟡 J2 | 1h |
| US-009 | Rechercher un élève | 🟡 J2 | 2h |
| US-011 | Fiche détail élève (photo, infos) | 🟡 J2 | 2h |
| US-012 | Créer une classe (section: Maternelle/Primaire/Secondaire, niveau texte) | 🟡 J2 | 1h |
| US-013 | Modifier une classe | 🟡 J2 | 1h |
| US-014 | Supprimer une classe | 🟡 J2 | 1h |
| US-019 | Affecter un élève à une classe | 🟡 J2 | 2h |
| S-008 | Désigner un enseignant titulaire pour une classe (endpoint + interface) | 🟡 J2 | 1h |

---

## J3 — Enseignants & Cours

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| US-015 | Créer un cours | 🟢 J3 | 2h |
| US-016 | Modifier un cours | 🟢 J3 | 1h |
| US-017 | Supprimer un cours | 🟢 J3 | 1h |
| US-018 | Affecter un enseignant à un cours | 🟢 J3 | 2h |
| US-020 | Ajouter un enseignant (avec flag est_titulaire) | 🟢 J3 | 2h |
| US-021 | Modifier un enseignant | 🟢 J3 | 1h |
| US-022 | Supprimer un enseignant | 🟢 J3 | 1h |
| US-023 | Liste des enseignants | 🟢 J3 | 1h |
| US-068 | Créer une fiche de leçon (titre, objectifs, matériel, déroulement, évaluation) | 🟢 J3 | 3h |
| US-069 | Joindre des fichiers à une leçon + imprimer fiche | 🟢 J3 | 2h |

---

## J4 — Présences & Carte Étudiante QR (Fonction Signature)

> **Fonction signature du logiciel** : La carte PVC personnalisable avec QR Code est l'élément différenciateur. Le QR ne sert pas qu'aux présences — il centralise **toutes** les infos de l'élève (notes, conduite, présences, applications).
> **Réservé au concepteur (super-admin)** : la personnalisation du modèle et l'impression sont exclusives au rôle `CONCEPTEUR`. L'école voit l'aperçu et le QR mais ne peut ni modifier ni imprimer.
> **Loading states** : aperçu avec skeleton, barre de progression pour impression groupée, spinner sur génération QR.

| ID | Libellé | Jour | Estimation | Rôle |
|----|---------|------|------------|------|
| US-024 | Générer un QR Code lié au profil complet de l'élève (notes, présence, conduite, activités) | 🔵 J4 | 4h | Tous |
| US-025 | Créer un modèle de carte PVC personnalisable (photo, nom, classe, QR, logo établissement) | 🔵 J4 | 3h | **Concepteur** |
| US-025a | **Aperçu carte avant impression** (modale interactive HTML/CSS, mise à jour temps réel des paramètres) | 🔵 J4 | 2h | Tous (lecture) / Concepteur (édition) |
| US-025b | Imprimer la carte PVC via navigateur (format carte d'identité, barre de progression pour lots) | 🔵 J4 | 2h | **Concepteur** |
| US-027 | Créer une séance de cours | 🔵 J4 | 2h |
| US-028 | Enregistrer présence (saisie manuelle depuis une liste) | 🔵 J4 | 4h |
| US-029 | Marquer un retard | 🔵 J4 | 1h |
| US-030 | Marquer une absence | 🔵 J4 | 1h |

---

> **Loading states J5** : skeleton cards sur dashboard, spinner sur génération de rapports.

## J5 — Dashboard & Finalisation

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| US-031 | Consulter l'historique des présences | ⚪ J5 | 2h |
| US-048 | Tableau de bord (cartes statistiques — vue générale + vue titulaire avec suivi de classe) | ⚪ J5 | 4h |
| S-005 | Page profil + changement mot de passe | ⚪ J5 | 1h |
| S-006 | Déploiement (Vercel + Railway + Supabase) | ⚪ J5 | 3h |
| S-007 | Tests manuels + corrections | ⚪ J5 | 3h |

---

## J6 — Notifications & Portail Parent

> **Loading states J6** : spinner envoi notification, skeleton dashboard parent.

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| S-009 | Service notifications (config SMTP + passerelle SMS) | 🟣 J6 | 3h |
| US-057 | Envoi notification automatique (absence, rappel paiement, résultat) | 🟣 J6 | 4h |
| US-058 | Portail parent — création compte parent lié aux élèves | 🟣 J6 | 3h |
| US-059 | Portail parent — dashboard suivi (notes, présence, paiements) | 🟣 J6 | 4h |

---

## J7 — Paiement Mobile Money & Signature Bulletins

> **Loading states J7** : spinner transaction paiement, skeleton génération bulletin.

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| US-060 | Intégration API Mobile Money (Orange Money, M-Pesa, Wave) | 🟤 J7 | 5h |
| US-061 | Interface paiement Mobile Money (montant, référence, confirmation) | 🟤 J7 | 3h |
| US-062 | Historique transaction Mobile Money + reçu | 🟤 J7 | 2h |
| US-063 | Signature électronique des bulletins (validation directeur, cachet numérique) | 🟤 J7 | 4h |

---

## J8 — Bibliothèque Numérique & Reconnaissance Faciale

> **Loading states J8** : spinner upload fichier, skeleton liste ressources, spinner scan facial.

| ID | Libellé | Jour | Estimation |
|----|---------|------|------------|
| US-064 | Bibliothèque numérique — upload ressources (PDF, images, liens) | ⚫ J8 | 3h |
| US-065 | Catégorisation, recherche et partage de ressources par classe | ⚫ J8 | 2h |
| US-066 | Reconnaissance faciale — intégration caméra + identification élève | ⚫ J8 | 5h |
| US-067 | Reconnaissance faciale — lien avec présence (marquer présent via visage) | ⚫ J8 | 3h |

---

## Synthèse

| Jour | US | Estimation |
|------|----|------------|
| J1 (Setup & Auth) | 8 | ~15h |
| J2 (Élèves & Classes) | 10 | ~15h |
| J3 (Enseignants & Cours) | 10 | ~16h |
| J4 (Présences & QR Code) | 8 | ~19h |
| J5 (Dashboard & Deploy) | 5 | ~13h |
| J6 (Notifications & Parent) | 4 | ~14h |
| J7 (Mobile Money & Signature) | 4 | ~14h |
| J8 (Bibliothèque & Faciale) | 4 | ~13h |
| **Total** | **53** | **~119h** |

---

> **Multi-école** : le middleware filtre automatiquement par `ecole_id` sur chaque requête. Chaque école a ses propres utilisateurs, classes, élèves, cours et paramètres. L'admin peut créer une nouvelle école via seed ou interface (v2).

---

## Fonctionnalités repoussées en v3

- US-005 : Réinitialisation mot de passe
- US-010 : Import CSV élèves
- US-026 : Scan QR Code par webcam
- US-032 : Rapport de présence par période
- US-033 : Modifier statut présence existant
- US-034 à US-038 : Notes et moyennes (partiellement dans portail parent)
- US-039 à US-041 : Bulletins PDF
- US-042 à US-047 : Paiements et reçus
- US-049 à US-051 : Rapports avancés
- US-052 à US-056 : Administration (sauvegardes, audit, rôles)
- Application mobile Android/iOS (React Native)
- Tableau de bord IA
