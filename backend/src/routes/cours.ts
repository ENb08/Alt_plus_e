import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";

export const coursRoutes = new Elysia({ prefix: "/api/cours" })
  .use(authMiddleware)

  .get("/", async ({ user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const where: any = { ecole_id: user.ecole_id };
    if (user.role === "ENSEIGNANT") {
      where.enseignant_id = user.id;
    }

    const cours = await prisma.cOURS.findMany({
      where,
      select: {
        id: true,
        intitule: true,
        coefficient: true,
        classe: { select: { id: true, nom_classe: true, section: true, niveau: true } },
        enseignant: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
          },
        },
        _count: { select: { seances: true, notes: true, legons: true } },
      },
      orderBy: { intitule: "asc" },
    });
    return { cours };
  })

  .get("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const cours = await prisma.cOURS.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
      select: {
        id: true,
        intitule: true,
        coefficient: true,
        classe: { select: { id: true, nom_classe: true, section: true, niveau: true } },
        enseignant: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
          },
        },
        _count: { select: { seances: true, notes: true, legons: true } },
      },
    });
    if (!cours) {
      set.status = 404;
      return { erreur: "Cours introuvable" };
    }
    return { cours };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { intitule, coefficient, classe_id, enseignant_id } = body;

      const classe = await prisma.cLASSE.findFirst({
        where: { id: classe_id, ecole_id: user.ecole_id },
      });
      if (!classe) {
        set.status = 404;
        return { erreur: "Classe introuvable" };
      }

      if (enseignant_id) {
        const ens = await prisma.eNSEIGNANT.findFirst({
          where: { id: enseignant_id, ecole_id: user.ecole_id },
        });
        if (!ens) {
          set.status = 400;
          return { erreur: "Enseignant introuvable" };
        }
      }

      const cours = await prisma.cOURS.create({
        data: {
          intitule,
          coefficient: coefficient || 1,
          classe_id,
          enseignant_id: enseignant_id || null,
          ecole_id: user.ecole_id,
        },
        select: {
          id: true,
          intitule: true,
          coefficient: true,
          classe: { select: { id: true, nom_classe: true } },
          enseignant: { select: { id: true, utilisateur: { select: { id: true, nom: true, prenom: true } } } },
        },
      });

      set.status = 201;
      return { cours };
    },
    {
      body: t.Object({
        intitule: t.String({ minLength: 1 }),
        coefficient: t.Optional(t.Number()),
        classe_id: t.String(),
        enseignant_id: t.Optional(t.String()),
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

      const existing = await prisma.cOURS.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Cours introuvable" };
      }

      const data: any = {};
      if (body.intitule !== undefined) data.intitule = body.intitule;
      if (body.coefficient !== undefined) data.coefficient = body.coefficient;
      if (body.classe_id !== undefined) {
        const classe = await prisma.cLASSE.findFirst({
          where: { id: body.classe_id, ecole_id: user.ecole_id },
        });
        if (!classe) {
          set.status = 404;
          return { erreur: "Classe introuvable" };
        }
        data.classe_id = body.classe_id;
      }
      if (body.enseignant_id !== undefined) {
        if (body.enseignant_id) {
          const ens = await prisma.eNSEIGNANT.findFirst({
            where: { id: body.enseignant_id, ecole_id: user.ecole_id },
          });
          if (!ens) {
            set.status = 400;
            return { erreur: "Enseignant introuvable" };
          }
        }
        data.enseignant_id = body.enseignant_id || null;
      }

      const cours = await prisma.cOURS.update({
        where: { id: params.id },
        data,
        select: {
          id: true,
          intitule: true,
          coefficient: true,
          classe: { select: { id: true, nom_classe: true } },
          enseignant: { select: { id: true, utilisateur: { select: { id: true, nom: true, prenom: true } } } },
        },
      });

      return { cours };
    },
    {
      body: t.Object({
        intitule: t.Optional(t.String({ minLength: 1 })),
        coefficient: t.Optional(t.Number()),
        classe_id: t.Optional(t.String()),
        enseignant_id: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.cOURS.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Cours introuvable" };
    }

    await prisma.cOURS.delete({ where: { id: params.id } });
    return { message: "Cours supprimé" };
  })

  .get("/classes/list", async ({ user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const classes = await prisma.cLASSE.findMany({
      where: { ecole_id: user.ecole_id },
      select: { id: true, nom_classe: true, section: true, niveau: true },
      orderBy: { nom_classe: "asc" },
    });
    return { classes };
  });
