import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .post(
    "/login",
    async ({ body, headers, set, jwt }) => {
      const { email, mot_de_passe, ecole_slug } = body;

      const host = headers["host"] || "";
      const subdomain = ecole_slug ?? host.split(".")[0];

      const ecole = await prisma.eCOLE.findUnique({
        where: { slug: subdomain },
      });

      if (!ecole) {
        set.status = 401;
        return { erreur: "École non trouvée" };
      }

      const utilisateur = await prisma.uTILISATEUR.findUnique({
        where: {
          email_ecole_id: { email, ecole_id: ecole.id },
        },
      });

      if (!utilisateur || !utilisateur.actif) {
        set.status = 401;
        return { erreur: "Identifiants invalides" };
      }

      const valide = await Bun.password.verify(
        mot_de_passe,
        utilisateur.mot_de_passe
      );

      if (!valide) {
        set.status = 401;
        return { erreur: "Identifiants invalides" };
      }

      const token = await jwt.sign({
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        ecole_id: ecole.id,
        ecole_slug: ecole.slug,
      });

      return {
        token,
        utilisateur: {
          id: utilisateur.id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
        },
        ecole: {
          id: ecole.id,
          nom: ecole.nom,
          slug: ecole.slug,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        mot_de_passe: t.String({ minLength: 1 }),
        ecole_slug: t.Optional(t.String()),
      }),
    }
  )

  .post("/logout", () => {
    return { message: "Déconnexion réussie" };
  })

  .get("/me", async ({ jwt, headers, set }) => {
    const auth = headers["authorization"];
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401;
      return { erreur: "Token manquant" };
    }

    const payload = await jwt.verify(auth.slice(7));
    if (!payload || !payload.id) {
      set.status = 401;
      return { erreur: "Token invalide" };
    }

    const utilisateur = await prisma.uTILISATEUR.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        ecole_id: true,
        ecole: { select: { id: true, nom: true, slug: true } },
      },
    });

    if (!utilisateur) {
      set.status = 401;
      return { erreur: "Utilisateur introuvable" };
    }

    return { utilisateur };
  });
