import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";

export const leconRoutes = new Elysia({ prefix: "/api/legons" })
  .use(authMiddleware)

  .get("/", async ({ query, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const where: any = { ecole_id: user.ecole_id };
    if (user.role === "ENSEIGNANT") {
      where.enseignant_id = user.id;
    }
    if (query.cours_id) where.cours_id = query.cours_id;

    const legons = await prisma.lEGON.findMany({
      where,
      select: {
        id: true,
        titre: true,
        objectifs: true,
        date_creation: true,
        cours: { select: { id: true, intitule: true, coefficient: true } },
        enseignant: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true } },
          },
        },
        _count: { select: { fichiers: true } },
      },
      orderBy: { date_creation: "desc" },
    });
    return { legons };
  }, {
    query: t.Object({ cours_id: t.Optional(t.String()) }),
  })

  .get("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const lecon = await prisma.lEGON.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
      select: {
        id: true,
        titre: true,
        objectifs: true,
        materiel: true,
        deroulement: true,
        evaluation: true,
        date_creation: true,
        cours: { select: { id: true, intitule: true, coefficient: true } },
        enseignant: {
          select: {
            id: true,
            utilisateur: { select: { id: true, nom: true, prenom: true } },
          },
        },
        fichiers: {
          select: { id: true, nom_fichier: true, url_fichier: true, type: true },
          orderBy: { nom_fichier: "asc" },
        },
      },
    });
    if (!lecon) {
      set.status = 404;
      return { erreur: "Leçon introuvable" };
    }
    return { lecon };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { titre, objectifs, materiel, deroulement, evaluation, cours_id } = body;

      const cours = await prisma.cOURS.findFirst({
        where: { id: cours_id, ecole_id: user.ecole_id },
      });
      if (!cours) {
        set.status = 404;
        return { erreur: "Cours introuvable" };
      }

      let enseignant_id = user.id;
      if (user.role !== "ENSEIGNANT" && body.enseignant_id) {
        const ens = await prisma.eNSEIGNANT.findFirst({
          where: { id: body.enseignant_id, ecole_id: user.ecole_id },
        });
        if (!ens) {
          set.status = 400;
          return { erreur: "Enseignant introuvable" };
        }
        enseignant_id = body.enseignant_id;
      }

      const lecon = await prisma.lEGON.create({
        data: {
          titre,
          objectifs: objectifs || null,
          materiel: materiel || null,
          deroulement: deroulement || null,
          evaluation: evaluation || null,
          cours_id,
          enseignant_id,
          ecole_id: user.ecole_id,
        },
        select: {
          id: true,
          titre: true,
          objectifs: true,
          materiel: true,
          deroulement: true,
          evaluation: true,
          date_creation: true,
          cours: { select: { id: true, intitule: true } },
          enseignant: { select: { id: true, utilisateur: { select: { nom: true, prenom: true } } } },
        },
      });

      set.status = 201;
      return { lecon };
    },
    {
      body: t.Object({
        titre: t.String({ minLength: 1 }),
        objectifs: t.Optional(t.String()),
        materiel: t.Optional(t.String()),
        deroulement: t.Optional(t.String()),
        evaluation: t.Optional(t.String()),
        cours_id: t.String(),
        enseignant_id: t.Optional(t.String()),
      }),
    }
  )

  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const existing = await prisma.lEGON.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Leçon introuvable" };
      }

      if (user.role === "ENSEIGNANT" && existing.enseignant_id !== user.id) {
        set.status = 403;
        return { erreur: "Vous ne pouvez modifier que vos propres leçons" };
      }

      const data: any = {};
      if (body.titre !== undefined) data.titre = body.titre;
      if (body.objectifs !== undefined) data.objectifs = body.objectifs || null;
      if (body.materiel !== undefined) data.materiel = body.materiel || null;
      if (body.deroulement !== undefined) data.deroulement = body.deroulement || null;
      if (body.evaluation !== undefined) data.evaluation = body.evaluation || null;

      const lecon = await prisma.lEGON.update({
        where: { id: params.id },
        data,
        select: {
          id: true,
          titre: true,
          objectifs: true,
          materiel: true,
          deroulement: true,
          evaluation: true,
          date_creation: true,
        },
      });

      return { lecon };
    },
    {
      body: t.Object({
        titre: t.Optional(t.String({ minLength: 1 })),
        objectifs: t.Optional(t.String()),
        materiel: t.Optional(t.String()),
        deroulement: t.Optional(t.String()),
        evaluation: t.Optional(t.String()),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.lEGON.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Leçon introuvable" };
    }

    if (user.role === "ENSEIGNANT" && existing.enseignant_id !== user.id) {
      set.status = 403;
      return { erreur: "Vous ne pouvez supprimer que vos propres leçons" };
    }

    await prisma.lEGON.delete({ where: { id: params.id } });
    return { message: "Leçon supprimée" };
  })

  .post(
    "/:id/fichiers",
    async ({ params, body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const lecon = await prisma.lEGON.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!lecon) {
        set.status = 404;
        return { erreur: "Leçon introuvable" };
      }

      const { nom_fichier, url_fichier, type } = body;

      const fichier = await prisma.lEGON_FICHIER.create({
        data: {
          nom_fichier,
          url_fichier,
          type: type || "other",
          lecon_id: params.id,
          ecole_id: user.ecole_id,
        },
        select: { id: true, nom_fichier: true, url_fichier: true, type: true },
      });

      set.status = 201;
      return { fichier };
    },
    {
      body: t.Object({
        nom_fichier: t.String({ minLength: 1 }),
        url_fichier: t.String(),
        type: t.Optional(t.String()),
      }),
    }
  )

  .delete("/:id/fichiers/:fichierId", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const fichier = await prisma.lEGON_FICHIER.findFirst({
      where: { id: params.fichierId, lecon_id: params.id, ecole_id: user.ecole_id },
    });
    if (!fichier) {
      set.status = 404;
      return { erreur: "Fichier introuvable" };
    }

    await prisma.lEGON_FICHIER.delete({ where: { id: params.fichierId } });
    return { message: "Fichier supprimé" };
  });
