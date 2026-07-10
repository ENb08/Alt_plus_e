import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { authRoutes } from "./src/routes/auth.ts";
import { userRoutes } from "./src/routes/users.ts";
import { eleveRoutes } from "./src/routes/eleves.ts";
import { classeRoutes } from "./src/routes/classes.ts";
import { enseignantRoutes } from "./src/routes/enseignants.ts";
import { coursRoutes } from "./src/routes/cours.ts";
import { leconRoutes } from "./src/routes/legons.ts";
import { prisma } from "./src/lib/prisma.ts";
import { hashPassword } from "./src/lib/password.ts";

async function autoSeed() {
  const existing = await prisma.eCOLE.findFirst({ where: { slug: "default" } });
  if (existing) return;

  console.log("🌱 Aucune école trouvée — création automatique...");

  const ecole = await prisma.eCOLE.create({
    data: {
      nom: "École par défaut",
      slug: "default",
      actif: true,
    },
  });

  const password = await hashPassword("admin123");
  await prisma.uTILISATEUR.create({
    data: {
      nom: "Administrateur",
      email: "admin@ecole.demo",
      mot_de_passe: password,
      role: "ADMINISTRATEUR",
      actif: true,
      ecole_id: ecole.id,
    },
  });

  console.log(`✓ Admin créé : admin@ecole.demo / admin123 (école: ${ecole.slug})`);
}

try {
  await autoSeed();
} catch (e) {
  console.error("⚠ Auto-seed échoué (base déjà initialisée ou erreur de connexion) :", e);
}

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { erreur: error.message };
    }
    if (code === "PARSE") {
      set.status = 400;
      return { erreur: "Corps de requête invalide" };
    }
    console.error(`[${code}]`, error instanceof Error ? error.message : error);
    if (set.status === 200) set.status = 500;
    return { erreur: error instanceof Error ? error.message : "Erreur interne du serveur" };
  })
  .use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://alt-plus-e.onrender.com",
        "https://alt-plus-ecole.onrender.com",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "altq-dev-secret-change-in-production",
      exp: "7d",
    })
  )
  .use(authRoutes)
  .use(userRoutes)
  .use(eleveRoutes)
  .use(classeRoutes)
  .use(enseignantRoutes)
  .use(coursRoutes)
  .use(leconRoutes)
  .get("/api/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🚀 API lancée sur http://localhost:${app.server?.port}`);
