-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATEUR', 'DIRECTEUR', 'ENSEIGNANT', 'COMPTABLE', 'ELEVE', 'PARENT', 'CONCEPTEUR');

-- CreateEnum
CREATE TYPE "StatutPresence" AS ENUM ('PRESENT', 'RETARD', 'ABSENT');

-- CreateTable
CREATE TABLE "ecole" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ecole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve" (
    "id" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "postnom" TEXT,
    "sexe" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT,
    "telephone_parent" TEXT,
    "photo_url" TEXT,
    "classe_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "eleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enseignant" (
    "id" TEXT NOT NULL,
    "specialite" TEXT,
    "est_titulaire" BOOLEAN NOT NULL DEFAULT false,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "enseignant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve_parent" (
    "id" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "eleve_parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annee_scolaire" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "annee_scolaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classe" (
    "id" TEXT NOT NULL,
    "nom_classe" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "annee_scolaire_id" TEXT NOT NULL,
    "titulaire_id" TEXT,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cours" (
    "id" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "coefficient" INTEGER NOT NULL,
    "classe_id" TEXT NOT NULL,
    "enseignant_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seance" (
    "id" TEXT NOT NULL,
    "cours_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "heure_fin" TIMESTAMP(3) NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "seance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carte_qr" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "carte_qr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presence" (
    "id" TEXT NOT NULL,
    "seance_id" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure_arrivee" TIMESTAMP(3),
    "statut" "StatutPresence" NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "cours_id" TEXT NOT NULL,
    "cote" DOUBLE PRECISION NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulletin" (
    "id" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "date_generation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "bulletin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulletin_ligne" (
    "id" TEXT NOT NULL,
    "bulletin_id" TEXT NOT NULL,
    "cours_id" TEXT NOT NULL,
    "cote" DOUBLE PRECISION NOT NULL,
    "coefficient" INTEGER NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "bulletin_ligne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frais_scolaire" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "classe_id" TEXT NOT NULL,
    "annee_scolaire_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "frais_scolaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiement" (
    "id" TEXT NOT NULL,
    "eleve_id" TEXT NOT NULL,
    "frais_scolaire_id" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "reference" TEXT,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recu" (
    "id" TEXT NOT NULL,
    "paiement_id" TEXT NOT NULL,
    "numero_recu" TEXT NOT NULL,
    "date_generation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "recu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecon" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "objectifs" TEXT,
    "materiel" TEXT,
    "deroulement" TEXT,
    "evaluation" TEXT,
    "cours_id" TEXT NOT NULL,
    "enseignant_id" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "lecon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecon_fichier" (
    "id" TEXT NOT NULL,
    "legon_id" TEXT NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "url_fichier" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "lecon_fichier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ecole_slug_key" ON "ecole"("slug");

-- CreateIndex
CREATE INDEX "utilisateur_ecole_id_idx" ON "utilisateur"("ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_ecole_id_key" ON "utilisateur"("email", "ecole_id");

-- CreateIndex
CREATE INDEX "eleve_classe_id_idx" ON "eleve"("classe_id");

-- CreateIndex
CREATE INDEX "eleve_ecole_id_idx" ON "eleve"("ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_matricule_ecole_id_key" ON "eleve"("matricule", "ecole_id");

-- CreateIndex
CREATE INDEX "enseignant_ecole_id_idx" ON "enseignant"("ecole_id");

-- CreateIndex
CREATE INDEX "parent_ecole_id_idx" ON "parent"("ecole_id");

-- CreateIndex
CREATE INDEX "eleve_parent_eleve_id_idx" ON "eleve_parent"("eleve_id");

-- CreateIndex
CREATE INDEX "eleve_parent_parent_id_idx" ON "eleve_parent"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_parent_eleve_id_parent_id_key" ON "eleve_parent"("eleve_id", "parent_id");

-- CreateIndex
CREATE INDEX "annee_scolaire_ecole_id_idx" ON "annee_scolaire"("ecole_id");

-- CreateIndex
CREATE INDEX "classe_annee_scolaire_id_idx" ON "classe"("annee_scolaire_id");

-- CreateIndex
CREATE INDEX "classe_titulaire_id_idx" ON "classe"("titulaire_id");

-- CreateIndex
CREATE INDEX "classe_ecole_id_idx" ON "classe"("ecole_id");

-- CreateIndex
CREATE INDEX "cours_classe_id_idx" ON "cours"("classe_id");

-- CreateIndex
CREATE INDEX "cours_enseignant_id_idx" ON "cours"("enseignant_id");

-- CreateIndex
CREATE INDEX "cours_ecole_id_idx" ON "cours"("ecole_id");

-- CreateIndex
CREATE INDEX "seance_cours_id_idx" ON "seance"("cours_id");

-- CreateIndex
CREATE INDEX "seance_ecole_id_idx" ON "seance"("ecole_id");

-- CreateIndex
CREATE INDEX "carte_qr_eleve_id_idx" ON "carte_qr"("eleve_id");

-- CreateIndex
CREATE INDEX "carte_qr_ecole_id_idx" ON "carte_qr"("ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "carte_qr_code_ecole_id_key" ON "carte_qr"("code", "ecole_id");

-- CreateIndex
CREATE INDEX "presence_seance_id_idx" ON "presence"("seance_id");

-- CreateIndex
CREATE INDEX "presence_eleve_id_idx" ON "presence"("eleve_id");

-- CreateIndex
CREATE INDEX "presence_ecole_id_idx" ON "presence"("ecole_id");

-- CreateIndex
CREATE INDEX "note_eleve_id_idx" ON "note"("eleve_id");

-- CreateIndex
CREATE INDEX "note_cours_id_idx" ON "note"("cours_id");

-- CreateIndex
CREATE INDEX "note_ecole_id_idx" ON "note"("ecole_id");

-- CreateIndex
CREATE INDEX "bulletin_eleve_id_idx" ON "bulletin"("eleve_id");

-- CreateIndex
CREATE INDEX "bulletin_ecole_id_idx" ON "bulletin"("ecole_id");

-- CreateIndex
CREATE INDEX "bulletin_ligne_bulletin_id_idx" ON "bulletin_ligne"("bulletin_id");

-- CreateIndex
CREATE INDEX "bulletin_ligne_cours_id_idx" ON "bulletin_ligne"("cours_id");

-- CreateIndex
CREATE INDEX "bulletin_ligne_ecole_id_idx" ON "bulletin_ligne"("ecole_id");

-- CreateIndex
CREATE INDEX "frais_scolaire_classe_id_idx" ON "frais_scolaire"("classe_id");

-- CreateIndex
CREATE INDEX "frais_scolaire_ecole_id_idx" ON "frais_scolaire"("ecole_id");

-- CreateIndex
CREATE INDEX "paiement_eleve_id_idx" ON "paiement"("eleve_id");

-- CreateIndex
CREATE INDEX "paiement_frais_scolaire_id_idx" ON "paiement"("frais_scolaire_id");

-- CreateIndex
CREATE INDEX "paiement_ecole_id_idx" ON "paiement"("ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "recu_paiement_id_key" ON "recu"("paiement_id");

-- CreateIndex
CREATE INDEX "recu_paiement_id_idx" ON "recu"("paiement_id");

-- CreateIndex
CREATE INDEX "recu_ecole_id_idx" ON "recu"("ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "recu_numero_recu_ecole_id_key" ON "recu"("numero_recu", "ecole_id");

-- CreateIndex
CREATE INDEX "lecon_cours_id_idx" ON "lecon"("cours_id");

-- CreateIndex
CREATE INDEX "lecon_enseignant_id_idx" ON "lecon"("enseignant_id");

-- CreateIndex
CREATE INDEX "lecon_ecole_id_idx" ON "lecon"("ecole_id");

-- CreateIndex
CREATE INDEX "lecon_fichier_legon_id_idx" ON "lecon_fichier"("legon_id");

-- CreateIndex
CREATE INDEX "lecon_fichier_ecole_id_idx" ON "lecon_fichier"("ecole_id");

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_id_fkey" FOREIGN KEY ("id") REFERENCES "utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enseignant" ADD CONSTRAINT "enseignant_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enseignant" ADD CONSTRAINT "enseignant_id_fkey" FOREIGN KEY ("id") REFERENCES "utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_id_fkey" FOREIGN KEY ("id") REFERENCES "utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_parent" ADD CONSTRAINT "eleve_parent_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_parent" ADD CONSTRAINT "eleve_parent_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annee_scolaire" ADD CONSTRAINT "annee_scolaire_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classe" ADD CONSTRAINT "classe_annee_scolaire_id_fkey" FOREIGN KEY ("annee_scolaire_id") REFERENCES "annee_scolaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classe" ADD CONSTRAINT "classe_titulaire_id_fkey" FOREIGN KEY ("titulaire_id") REFERENCES "enseignant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classe" ADD CONSTRAINT "classe_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_enseignant_id_fkey" FOREIGN KEY ("enseignant_id") REFERENCES "enseignant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seance" ADD CONSTRAINT "seance_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seance" ADD CONSTRAINT "seance_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carte_qr" ADD CONSTRAINT "carte_qr_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carte_qr" ADD CONSTRAINT "carte_qr_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presence" ADD CONSTRAINT "presence_seance_id_fkey" FOREIGN KEY ("seance_id") REFERENCES "seance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presence" ADD CONSTRAINT "presence_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presence" ADD CONSTRAINT "presence_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin" ADD CONSTRAINT "bulletin_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin" ADD CONSTRAINT "bulletin_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin_ligne" ADD CONSTRAINT "bulletin_ligne_bulletin_id_fkey" FOREIGN KEY ("bulletin_id") REFERENCES "bulletin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin_ligne" ADD CONSTRAINT "bulletin_ligne_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin_ligne" ADD CONSTRAINT "bulletin_ligne_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais_scolaire" ADD CONSTRAINT "frais_scolaire_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais_scolaire" ADD CONSTRAINT "frais_scolaire_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_frais_scolaire_id_fkey" FOREIGN KEY ("frais_scolaire_id") REFERENCES "frais_scolaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recu" ADD CONSTRAINT "recu_paiement_id_fkey" FOREIGN KEY ("paiement_id") REFERENCES "paiement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recu" ADD CONSTRAINT "recu_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecon" ADD CONSTRAINT "lecon_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecon" ADD CONSTRAINT "lecon_enseignant_id_fkey" FOREIGN KEY ("enseignant_id") REFERENCES "enseignant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecon" ADD CONSTRAINT "lecon_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecon_fichier" ADD CONSTRAINT "lecon_fichier_legon_id_fkey" FOREIGN KEY ("legon_id") REFERENCES "lecon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecon_fichier" ADD CONSTRAINT "lecon_fichier_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
