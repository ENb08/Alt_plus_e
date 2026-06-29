# Product Backlog — Gestion Scolaire QR Code

**Priorités** : 🔴 Must | 🟡 Should | 🟢 Could

---

## Epic Authentification & Rôles

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-001 | Création du compte administrateur principal (seed) | 🔴 Must | 1j | — |
| US-002 | Connexion | 🔴 Must | 3j | US-001 |
| US-003 | Déconnexion | 🔴 Must | 1j | US-002 |
| US-004 | Interface adaptée au rôle (dashboard différent par profil) | 🔴 Must | 3j | US-002 |
| US-005 | Réinitialisation mot de passe | 🟡 Should | 2j | US-002 |

---

## Epic Élèves

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-006 | Ajouter un élève (inscription) | 🔴 Must | 3j | US-011 |
| US-007 | Modifier un élève | 🔴 Must | 1j | US-006 |
| US-008 | Supprimer un élève | 🔴 Must | 1j | US-006 |
| US-009 | Rechercher un élève | 🔴 Must | 2j | US-006 |
| US-010 | Importer liste d'élèves (CSV) | 🟢 Could | 2j | US-006 |
| US-011 | Fiche détail élève (avec photo, QR code) | 🔴 Must | 2j | US-006 |

---

## Epic Classes & Cours

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-012 | Créer une classe | 🔴 Must | 2j | — |
| US-013 | Modifier une classe | 🔴 Must | 1j | US-012 |
| US-014 | Supprimer une classe | 🔴 Must | 1j | US-012 |
| US-015 | Créer un cours | 🔴 Must | 2j | US-012 |
| US-016 | Modifier un cours | 🔴 Must | 1j | US-015 |
| US-017 | Supprimer un cours | 🔴 Must | 1j | US-015 |
| US-018 | Affecter un enseignant à un cours | 🔴 Must | 2j | US-015, US-021 |
| US-019 | Affecter un élève à une classe | 🔴 Must | 2j | US-006, US-012 |

---

## Epic Enseignants

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-020 | Ajouter un enseignant | 🔴 Must | 2j | US-002 |
| US-021 | Modifier un enseignant | 🔴 Must | 1j | US-020 |
| US-022 | Supprimer un enseignant | 🔴 Must | 1j | US-020 |
| US-023 | Liste des enseignants | 🔴 Must | 1j | US-020 |

---

## Epic QR Code & Cartes

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-024 | Générer un QR Code pour un élève | 🔴 Must | 3j | US-006 |
| US-025 | Imprimer une carte d'identification | 🔴 Must | 2j | US-024 |
| US-026 | Scanner un QR Code (identification) | 🟡 Should | 5j | US-024 |

---

## Epic Présence (Saisie Manuelle)

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-027 | Créer une séance de cours | 🔴 Must | 2j | US-015 |
| US-028 | Enregistrer présence (saisie manuelle depuis une liste) | 🔴 Must | 3j | US-006, US-027 |
| US-029 | Marquer un retard | 🔴 Must | 1j | US-028 |
| US-030 | Marquer une absence | 🔴 Must | 1j | US-028 |
| US-031 | Consulter l'historique des présences | 🟡 Should | 2j | US-028 |
| US-032 | Rapport de présence par période | 🟡 Should | 3j | US-031 |
| US-033 | Modifier un statut de présence | 🟡 Should | 1j | US-028 |

---

## Epic Notes

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-034 | Encoder les notes (grille par cours) | 🔴 Must | 3j | US-006, US-015 |
| US-035 | Modifier une note | 🔴 Must | 1j | US-034 |
| US-036 | Supprimer une note | 🔴 Must | 1j | US-034 |
| US-037 | Calcul automatique des moyennes | 🔴 Must | 3j | US-034 |
| US-038 | Classement des élèves par cours | 🟡 Should | 2j | US-037 |

---

## Epic Bulletins

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-039 | Générer un bulletin PDF | 🔴 Must | 5j | US-037 |
| US-040 | Consulter un bulletin en ligne | 🟡 Should | 2j | US-039 |
| US-041 | Impression groupée des bulletins (par classe) | 🟢 Could | 3j | US-039 |

---

## Epic Paiements

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-042 | Configurer les frais scolaires par classe | 🔴 Must | 2j | US-012 |
| US-043 | Enregistrer un paiement | 🔴 Must | 3j | US-006, US-042 |
| US-044 | Générer un reçu PDF | 🔴 Must | 3j | US-043 |
| US-045 | Consulter le solde d'un élève | 🔴 Must | 2j | US-043 |
| US-046 | Historique des paiements | 🟡 Should | 2j | US-043 |
| US-047 | Relance des impayés | 🟢 Could | 2j | US-045 |

---

## Epic Rapports & Statistiques

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-048 | Tableau de bord (cartes statistiques) | 🟡 Should | 5j | US-004 |
| US-049 | Rapport financier (encaissements, impayés) | 🟡 Should | 3j | US-043 |
| US-050 | Rapport de présence (taux par classe) | 🟡 Should | 3j | US-028 |
| US-051 | Rapport académique (moyennes, réussite) | 🟡 Should | 3j | US-037 |

---

## Epic Administration

| ID | Libellé | Priorité | Estimation | Dépendances |
|----|---------|----------|------------|-------------|
| US-052 | Gestion des utilisateurs (CRUD) | 🔴 Must | 3j | US-001 |
| US-053 | Gestion des rôles et permissions | 🔴 Must | 2j | US-052 |
| US-054 | Paramétrage du système (année scolaire, etc.) | 🟡 Should | 2j | — |
| US-055 | Sauvegarde automatique des données | 🟡 Should | 3j | — |
| US-056 | Journalisation des activités (audit log) | 🟢 Could | 2j | US-052 |

---

## Synthèse des Charges

| Epic | Total US | Must | Should | Could | Estimation totale |
|------|----------|------|--------|-------|-------------------|
| Authentification & Rôles | 5 | 4 | 1 | 0 | 10j |
| Élèves | 6 | 5 | 0 | 1 | 11j |
| Classes & Cours | 8 | 8 | 0 | 0 | 12j |
| Enseignants | 4 | 4 | 0 | 0 | 5j |
| QR Code & Cartes | 3 | 2 | 1 | 0 | 10j |
| Présence | 7 | 4 | 3 | 0 | 13j |
| Notes | 5 | 4 | 1 | 0 | 10j |
| Bulletins | 3 | 1 | 1 | 1 | 10j |
| Paiements | 6 | 4 | 1 | 1 | 14j |
| Rapports | 4 | 0 | 4 | 0 | 14j |
| Administration | 5 | 2 | 2 | 1 | 12j |
| **Total** | **56** | **38** | **14** | **4** | **~121j** |
