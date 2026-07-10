import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { hashPassword } from "../lib/password.ts";

export const enseignantRoutes = new Elysia({ prefix: "/api/enseignants" })
  .use(authMiddleware)

  .get("/", async ({ user, set }) => {
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
        utilisateur: { select: { id: true, nom: true, prenom: true, email: true, actif: true } },
        _count: { select: { cours: true, classes: true, legons: true } },
      },
      orderBy: { utilisateur: { nom: "asc" } },
    });
    return { enseignants };
  })

  .get("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const enseignant = await prisma.eNSEIGNANT.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
      select: {
        id: true,
        specialite: true,
        est_titulaire: true,
        utilisateur: { select: { id: true, nom: true, prenom: true, email: true, actif: true } },
        _count: { select: { cours: true, classes: true, legons: true } },
      },
    });
    if (!enseignant) {
      set.status = 404;
      return { erreur: "Enseignant introuvable" };
    }
    return { enseignant };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { nom, prenom, email, mot_de_passe, specialite, est_titulaire } = body;

      const emailExists = await prisma.uTILISATEUR.findFirst({
        where: { email, ecole_id: user.ecole_id },
      });
      if (emailExists) {
        set.status = 409;
        return { erreur: "Cet email est déjà utilisé dans cette école" };
      }

      const hashed = await hashPassword(mot_de_passe);

      const created = await prisma.uTILISATEUR.create({
        data: {
          nom,
          prenom: prenom || null,
          email,
          mot_de_passe: hashed,
          role: "ENSEIGNANT",
          actif: true,
          ecole_id: user.ecole_id,
          enseignant: {
            create: {
              specialite: specialite || null,
              est_titulaire: est_titulaire || false,
              ecole_id: user.ecole_id,
            },
          },
        },
        select: { id: true },
      });

      const enseignant = await prisma.eNSEIGNANT.findUnique({
        where: { id: created.id },
        select: {
          id: true,
          specialite: true,
          est_titulaire: true,
          utilisateur: { select: { id: true, nom: true, prenom: true, email: true, actif: true } },
        },
      });

      set.status = 201;
      return { enseignant };
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 2 }),
        prenom: t.Optional(t.String()),
        email: t.String({ format: "email" }),
        mot_de_passe: t.String({ minLength: 6 }),
        specialite: t.Optional(t.String()),
        est_titulaire: t.Optional(t.Boolean()),
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

      const existing = await prisma.eNSEIGNANT.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Enseignant introuvable" };
      }

      const dataUser: any = {};
      const dataEnseignant: any = {};

      if (body.nom !== undefined) dataUser.nom = body.nom;
      if (body.prenom !== undefined) dataUser.prenom = body.prenom || null;
      if (body.email !== undefined) {
        const dup = await prisma.uTILISATEUR.findFirst({
          where: { email: body.email, ecole_id: user.ecole_id, id: { not: params.id } },
        });
        if (dup) {
          set.status = 409;
          return { erreur: "Cet email est déjà utilisé" };
        }
        dataUser.email = body.email;
      }
      if (body.mot_de_passe !== undefined) {
        dataUser.mot_de_passe = await hashPassword(body.mot_de_passe);
      }
      if (body.specialite !== undefined) dataEnseignant.specialite = body.specialite || null;
      if (body.est_titulaire !== undefined) dataEnseignant.est_titulaire = body.est_titulaire;

      if (Object.keys(dataUser).length > 0) {
        await prisma.uTILISATEUR.update({ where: { id: params.id }, data: dataUser });
      }
      if (Object.keys(dataEnseignant).length > 0) {
        await prisma.eNSEIGNANT.update({ where: { id: params.id }, data: dataEnseignant });
      }

      const enseignant = await prisma.eNSEIGNANT.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          specialite: true,
          est_titulaire: true,
          utilisateur: { select: { id: true, nom: true, prenom: true, email: true, actif: true } },
        },
      });

      return { enseignant };
    },
    {
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 2 })),
        prenom: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
        mot_de_passe: t.Optional(t.String({ minLength: 6 })),
        specialite: t.Optional(t.String()),
        est_titulaire: t.Optional(t.Boolean()),
        actif: t.Optional(t.Boolean()),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.eNSEIGNANT.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Enseignant introuvable" };
    }

    await prisma.uTILISATEUR.update({
      where: { id: params.id },
      data: { actif: false, version_session: { increment: 1 } },
    });

    return { message: "Enseignant désactivé" };
  });
