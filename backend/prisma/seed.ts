import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.eCOLE.findFirst({ where: { slug: "default" } });
  if (existing) {
    console.log("Seed déjà existant, skipping.");
    return;
  }

  const ecole = await prisma.eCOLE.create({
    data: {
      nom: "École par défaut",
      slug: "default",
      adresse: "Adresse de l'école",
      telephone: "+243000000000",
      email: "contact@ecole.demo",
      actif: true,
    },
  });
  console.log("École créée :", ecole.nom);

  const password = await Bun.password.hash("admin123");
  const admin = await prisma.uTILISATEUR.create({
    data: {
      nom: "Administrateur",
      email: "admin@ecole.demo",
      mot_de_passe: password,
      role: "ADMINISTRATEUR",
      actif: true,
      ecole_id: ecole.id,
    },
  });
  console.log("Admin créé :", admin.email, "/ mot de passe : admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
