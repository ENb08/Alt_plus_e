import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { hashPassword } from "../lib/password.ts";

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .use(authMiddleware)

  .get("/", async ({ user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "CONCEPTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }
    const utilisateurs = await prisma.uTILISATEUR.findMany({
      where: { ecole_id: user.ecole_id, actif: true },
      select: { id: true, nom: true, email: true, role: true, date_creation: true, actif: true },
      orderBy: { date_creation: "desc" },
    });
    return { utilisateurs };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "CONCEPTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { nom, email, mot_de_passe, role } = body;

      const emailExists = await prisma.uTILISATEUR.findFirst({
        where: { email, ecole_id: user.ecole_id },
      });
      if (emailExists) {
        set.status = 409;
        return { erreur: "Cet email est déjà utilisé dans cette école" };
      }

      const validRoles = ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT", "COMPTABLE", "ELEVE", "PARENT"];
      if (!validRoles.includes(role)) {
        set.status = 400;
        return { erreur: "Rôle invalide" };
      }

      const hashed = await hashPassword(mot_de_passe);

      const utilisateur = await prisma.uTILISATEUR.create({
        data: {
          nom,
          email,
          mot_de_passe: hashed,
          role: role as any,
          actif: true,
          ecole_id: user.ecole_id,
        },
        select: { id: true, nom: true, email: true, role: true, date_creation: true },
      });

      set.status = 201;
      return { utilisateur };
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 2 }),
        email: t.String({ format: "email" }),
        mot_de_passe: t.String({ minLength: 6 }),
        role: t.String(),
      }),
    }
  )

  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "CONCEPTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const existing = await prisma.uTILISATEUR.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Utilisateur introuvable" };
      }

      const data: any = {};
      if (body.nom !== undefined) data.nom = body.nom;
      if (body.email !== undefined) {
        const dup = await prisma.uTILISATEUR.findFirst({
          where: { email: body.email, ecole_id: user.ecole_id, id: { not: params.id } },
        });
        if (dup) {
          set.status = 409;
          return { erreur: "Cet email est déjà utilisé" };
        }
        data.email = body.email;
      }
      if (body.role !== undefined) {
        const validRoles = ["ADMINISTRATEUR", "DIRECTEUR", "ENSEIGNANT", "COMPTABLE", "ELEVE", "PARENT"];
        if (!validRoles.includes(body.role)) {
          set.status = 400;
          return { erreur: "Rôle invalide" };
        }
        data.role = body.role;
      }
      if (body.mot_de_passe !== undefined) {
        data.mot_de_passe = await hashPassword(body.mot_de_passe);
      }
      if (body.actif !== undefined) {
        data.actif = body.actif;
        data.version_session = { increment: 1 };
      }

      const utilisateur = await prisma.uTILISATEUR.update({
        where: { id: params.id },
        data,
        select: { id: true, nom: true, email: true, role: true, actif: true },
      });

      return { utilisateur };
    },
    {
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 2 })),
        email: t.Optional(t.String({ format: "email" })),
        mot_de_passe: t.Optional(t.String({ minLength: 6 })),
        role: t.Optional(t.String()),
        actif: t.Optional(t.Boolean()),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "CONCEPTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.uTILISATEUR.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Utilisateur introuvable" };
    }

    if (existing.id === user.id) {
      set.status = 400;
      return { erreur: "Vous ne pouvez pas vous supprimer vous-même" };
    }

    await prisma.uTILISATEUR.update({
      where: { id: params.id },
      data: { actif: false, version_session: { increment: 1 } },
    });

    return { message: "Utilisateur désactivé" };
  });
