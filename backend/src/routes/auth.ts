import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { hashPassword, verifyPassword } from "../lib/password.ts";

const RESERVED_SLUGS = new Set([
  "api", "admin", "www", "app", "login", "register", "auth",
  "demo", "test", "dev", "staging", "mail", "docs", "help",
  "support", "status", "blog", "about", "contact",
]);

function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .post(
    "/login",
    async ({ body, headers, set, jwt }) => {
      const { email, mot_de_passe, ecole_slug } = body;

      const host = headers["host"] || "";
      const requestedSlug = (ecole_slug || host.split(".")[0] || "")
        .trim()
        .toLowerCase();

      let ecole = requestedSlug
        ? await prisma.eCOLE.findUnique({ where: { slug: requestedSlug } })
        : null;

      if (!ecole && requestedSlug !== "default") {
        ecole = await prisma.eCOLE.findUnique({ where: { slug: "default" } });
      }

      let utilisateur = ecole
        ? await prisma.uTILISATEUR.findUnique({
            where: {
              email_ecole_id: { email, ecole_id: ecole.id },
            },
          })
        : null;

      if (!utilisateur) {
        utilisateur = await prisma.uTILISATEUR.findFirst({
          where: { email, actif: true },
          include: { ecole: true },
        });

        if (utilisateur?.ecole) {
          ecole = utilisateur.ecole;
        }
      }

      if (!ecole) {
        set.status = 401;
        return { erreur: "École non trouvée" };
      }

      if (!utilisateur || !utilisateur.actif) {
        set.status = 401;
        return { erreur: "Identifiants invalides" };
      }

      const valide = await verifyPassword(
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

  .post(
    "/register-ecole",
    async ({ body, set, jwt }) => {
      const { nom_ecole, slug, email_admin, mot_de_passe_admin, nom_admin } = body;

      const slugFinal = slug || sanitizeSlug(nom_ecole);
      if (!slugFinal || slugFinal.length < 3) {
        set.status = 400;
        return { erreur: "Le slug doit contenir au moins 3 caractères" };
      }
      if (slugFinal.length > 50) {
        set.status = 400;
        return { erreur: "Le slug est trop long (max 50 caractères)" };
      }
      if (!/^[a-z0-9-]+$/.test(slugFinal)) {
        set.status = 400;
        return { erreur: "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets" };
      }
      if (RESERVED_SLUGS.has(slugFinal)) {
        set.status = 400;
        return { erreur: "Ce slug est réservé" };
      }

      const slugExists = await prisma.eCOLE.findUnique({ where: { slug: slugFinal } });
      if (slugExists) {
        set.status = 409;
        return { erreur: "Ce slug est déjà utilisé par une autre école" };
      }

      const emailExists = await prisma.uTILISATEUR.findFirst({
        where: { email: email_admin },
      });
      if (emailExists) {
        set.status = 409;
        return { erreur: "Cet email est déjà utilisé" };
      }

      const hashed = await hashPassword(mot_de_passe_admin);

      const ecole = await prisma.eCOLE.create({
        data: {
          nom: nom_ecole,
          slug: slugFinal,
          actif: true,
          utilisateurs: {
            create: {
              nom: nom_admin || "Administrateur",
              email: email_admin,
              mot_de_passe: hashed,
              role: "ADMINISTRATEUR",
              actif: true,
            },
          },
        },
        include: { utilisateurs: { take: 1 } },
      });

      const admin = ecole.utilisateurs[0];

      const token = await jwt.sign({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        ecole_id: ecole.id,
        ecole_slug: ecole.slug,
      });

      return {
        token,
        utilisateur: {
          id: admin.id,
          nom: admin.nom,
          email: admin.email,
          role: admin.role,
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
        nom_ecole: t.String({ minLength: 2 }),
        slug: t.Optional(t.String()),
        email_admin: t.String({ format: "email" }),
        mot_de_passe_admin: t.String({ minLength: 6 }),
        nom_admin: t.Optional(t.String()),
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
