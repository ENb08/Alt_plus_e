import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";

export const classeRoutes = new Elysia({ prefix: "/api/classes" })
  .use(authMiddleware)

  .get("/", async ({ user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const classes = await prisma.cLASSE.findMany({
      where: { ecole_id: user.ecole_id },
      select: {
        id: true,
        nom_classe: true,
        section: true,
        niveau: true,
        annee_scolaire_id: true,
        titulaire_id: true,
        titulaire: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
          },
        },
        _count: { select: { eleves: true } },
      },
      orderBy: { nom_classe: "asc" },
    });
    return { classes };
  })

  .get("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const classe = await prisma.cLASSE.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
      select: {
        id: true,
        nom_classe: true,
        section: true,
        niveau: true,
        annee_scolaire_id: true,
        titulaire_id: true,
        titulaire: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
          },
        },
        _count: { select: { eleves: true } },
      },
    });
    if (!classe) {
      set.status = 404;
      return { erreur: "Classe introuvable" };
    }
    return { classe };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { nom_classe, section, niveau, annee_scolaire_id, titulaire_id } = body;

      const validSections = ["Maternelle", "Primaire", "Secondaire"];
      if (!validSections.includes(section)) {
        set.status = 400;
        return { erreur: "Section invalide. Choisir: Maternelle, Primaire, Secondaire" };
      }

      let anneeId = annee_scolaire_id;
      if (!anneeId) {
        const active = await prisma.aNNEE_SCOLAIRE.findFirst({
          where: { ecole_id: user.ecole_id, active: true },
        });
        if (active) {
          anneeId = active.id;
        } else {
          const year = new Date().getFullYear();
          const created = await prisma.aNNEE_SCOLAIRE.create({
            data: {
              libelle: `${year}-${year + 1}`,
              date_debut: new Date(`${year}-09-01`),
              date_fin: new Date(`${year + 1}-07-31`),
              active: true,
              ecole_id: user.ecole_id,
            },
          });
          anneeId = created.id;
        }
      }

      if (titulaire_id) {
        const enseignant = await prisma.eNSEIGNANT.findFirst({
          where: { id: titulaire_id, ecole_id: user.ecole_id },
        });
        if (!enseignant) {
          set.status = 400;
          return { erreur: "Enseignant titulaire introuvable" };
        }
      }

      const classe = await prisma.cLASSE.create({
        data: {
          nom_classe,
          section,
          niveau,
          annee_scolaire_id: anneeId,
          titulaire_id: titulaire_id || null,
          ecole_id: user.ecole_id,
        },
        select: {
          id: true,
          nom_classe: true,
          section: true,
          niveau: true,
          annee_scolaire_id: true,
          titulaire_id: true,
        },
      });

      set.status = 201;
      return { classe };
    },
    {
      body: t.Object({
        nom_classe: t.String({ minLength: 1 }),
        section: t.String(),
        niveau: t.String({ minLength: 1 }),
        annee_scolaire_id: t.Optional(t.String()),
        titulaire_id: t.Optional(t.String()),
      }),
    }
  )

  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const existing = await prisma.cLASSE.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Classe introuvable" };
      }

      const data: any = {};
      if (body.nom_classe !== undefined) data.nom_classe = body.nom_classe;
      if (body.section !== undefined) {
        const validSections = ["Maternelle", "Primaire", "Secondaire"];
        if (!validSections.includes(body.section)) {
          set.status = 400;
          return { erreur: "Section invalide" };
        }
        data.section = body.section;
      }
      if (body.niveau !== undefined) data.niveau = body.niveau;
      if (body.titulaire_id !== undefined) {
        if (body.titulaire_id) {
          const enseignant = await prisma.eNSEIGNANT.findFirst({
            where: { id: body.titulaire_id, ecole_id: user.ecole_id },
          });
          if (!enseignant) {
            set.status = 400;
            return { erreur: "Enseignant titulaire introuvable" };
          }
        }
        data.titulaire_id = body.titulaire_id || null;
      }

      const classe = await prisma.cLASSE.update({
        where: { id: params.id },
        data,
        select: {
          id: true,
          nom_classe: true,
          section: true,
          niveau: true,
          annee_scolaire_id: true,
          titulaire_id: true,
        },
      });

      return { classe };
    },
    {
      body: t.Object({
        nom_classe: t.Optional(t.String({ minLength: 1 })),
        section: t.Optional(t.String()),
        niveau: t.Optional(t.String({ minLength: 1 })),
        titulaire_id: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.cLASSE.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Classe introuvable" };
    }

    const eleveCount = await prisma.eLEVE.count({
      where: { classe_id: params.id },
    });
    if (eleveCount > 0) {
      set.status = 400;
      return { erreur: `Impossible de supprimer: ${eleveCount} élève(s) encore dans cette classe` };
    }

    await prisma.cLASSE.delete({ where: { id: params.id } });
    return { message: "Classe supprimée" };
  })

  .get("/enseignants/list", async ({ user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const enseignants = await prisma.eNSEIGNANT.findMany({
      where: { ecole_id: user.ecole_id },
      select: {
        id: true,
        specialite: true,
        est_titulaire: true,
        utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
      },
      orderBy: { utilisateur: { nom: "asc" } },
    });
    return { enseignants };
  });
