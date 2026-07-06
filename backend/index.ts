import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { authRoutes } from "./src/routes/auth.ts";
import { prisma } from "./src/lib/prisma.ts";

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

  const password = await Bun.password.hash("admin123");
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

await autoSeed();

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { erreur: error.message };
    }
    console.error(`[${code}]`, error);
    set.status = 500;
    return { erreur: "Erreur interne du serveur" };
  })
  .use(
    cors({
      origin: ["http://localhost:3000"],
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
  .get("/api/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🚀 API lancée sur http://localhost:${app.server?.port}`);
