import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { hashPassword } from "../lib/password.ts";

const ELEVE_SELECT = {
  id: true,
  matricule: true,
  postnom: true,
  sexe: true,
  date_naissance: true,
  adresse: true,
  telephone_parent: true,
  photo_url: true,
  nationalite: true,
  allergies_medicales: true,
  ecole_provenance: true,
  utilisateur: { select: { id: true, nom: true, prenom: true, email: true, actif: true } },
  classe: { select: { id: true, nom_classe: true, section: true, niveau: true } },
} as const;

export const eleveRoutes = new Elysia({ prefix: "/api/eleves" })
  .use(authMiddleware)

  .get("/", async ({ query, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const { q } = query;
    const where: any = { ecole_id: user.ecole_id };

    if (q) {
      where.OR = [
        { matricule: { contains: q, mode: "insensitive" } },
        { postnom: { contains: q, mode: "insensitive" } },
        { nationalite: { contains: q, mode: "insensitive" } },
        { ecole_provenance: { contains: q, mode: "insensitive" } },
        { utilisateur: { nom: { contains: q, mode: "insensitive" } } },
        { utilisateur: { prenom: { contains: q, mode: "insensitive" } } },
        { utilisateur: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const eleves = await prisma.eLEVE.findMany({
      where,
      select: ELEVE_SELECT,
      orderBy: { utilisateur: { nom: "asc" } },
    });

    return { eleves };
  }, {
    query: t.Object({ q: t.Optional(t.String()) }),
  })

  .get("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR" && user.role !== "ENSEIGNANT") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const eleve = await prisma.eLEVE.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
      select: ELEVE_SELECT,
    });

    if (!eleve) {
      set.status = 404;
      return { erreur: "Élève introuvable" };
    }

    return { eleve };
  })

  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
        set.status = 403;
        return { erreur: "Accès refusé" };
      }

      const { nom, prenom, email, mot_de_passe, postnom, sexe, date_naissance, adresse, telephone_parent, classe_id, nationalite, allergies_medicales, ecole_provenance, photo_url } = body;

      const emailExists = await prisma.uTILISATEUR.findFirst({
        where: { email, ecole_id: user.ecole_id },
      });
      if (emailExists) {
        set.status = 409;
        return { erreur: "Cet email est déjà utilisé dans cette école" };
      }

      const classe = await prisma.cLASSE.findFirst({
        where: { id: classe_id, ecole_id: user.ecole_id },
      });
      if (!classe) {
        set.status = 404;
        return { erreur: "Classe introuvable" };
      }

      const count = await prisma.eLEVE.count({ where: { ecole_id: user.ecole_id } });
      const year = new Date().getFullYear();
      const matricule = `MAT-${year}-${String(count + 1).padStart(4, "0")}`;

      const hashed = await hashPassword(mot_de_passe);

      const created = await prisma.uTILISATEUR.create({
        data: {
          nom,
          prenom: prenom || null,
          email,
          mot_de_passe: hashed,
          role: "ELEVE",
          actif: true,
          ecole_id: user.ecole_id,
          eleve: {
            create: {
              matricule,
              postnom: postnom || null,
              sexe,
              date_naissance: new Date(date_naissance),
              adresse: adresse || null,
              telephone_parent: telephone_parent || null,
              photo_url: photo_url || null,
              nationalite: nationalite || null,
              allergies_medicales: allergies_medicales || null,
              ecole_provenance: ecole_provenance || null,
              classe_id,
              ecole_id: user.ecole_id,
            },
          },
        },
        select: { id: true },
      });

      const eleve = await prisma.eLEVE.findUnique({
        where: { id: created.id },
        select: ELEVE_SELECT,
      });

      set.status = 201;
      return { eleve };
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 2 }),
        prenom: t.Optional(t.String()),
        email: t.String({ format: "email" }),
        mot_de_passe: t.String({ minLength: 6 }),
        postnom: t.Optional(t.String()),
        sexe: t.String({ pattern: "^(M|F)$" }),
        date_naissance: t.String({ format: "date" }),
        adresse: t.Optional(t.String()),
        telephone_parent: t.Optional(t.String()),
        photo_url: t.Optional(t.String()),
        nationalite: t.Optional(t.String()),
        allergies_medicales: t.Optional(t.String()),
        ecole_provenance: t.Optional(t.String()),
        classe_id: t.String(),
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

      const existing = await prisma.eLEVE.findFirst({
        where: { id: params.id, ecole_id: user.ecole_id },
      });
      if (!existing) {
        set.status = 404;
        return { erreur: "Élève introuvable" };
      }

      const dataEleve: any = {};
      const dataUser: any = {};

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
      if (body.postnom !== undefined) dataEleve.postnom = body.postnom || null;
      if (body.sexe !== undefined) dataEleve.sexe = body.sexe;
      if (body.date_naissance !== undefined) dataEleve.date_naissance = new Date(body.date_naissance);
      if (body.adresse !== undefined) dataEleve.adresse = body.adresse || null;
      if (body.telephone_parent !== undefined) dataEleve.telephone_parent = body.telephone_parent || null;
      if (body.photo_url !== undefined) dataEleve.photo_url = body.photo_url || null;
      if (body.nationalite !== undefined) dataEleve.nationalite = body.nationalite || null;
      if (body.allergies_medicales !== undefined) dataEleve.allergies_medicales = body.allergies_medicales || null;
      if (body.ecole_provenance !== undefined) dataEleve.ecole_provenance = body.ecole_provenance || null;
      if (body.classe_id !== undefined) {
        const classe = await prisma.cLASSE.findFirst({
          where: { id: body.classe_id, ecole_id: user.ecole_id },
        });
        if (!classe) {
          set.status = 404;
          return { erreur: "Classe introuvable" };
        }
        dataEleve.classe_id = body.classe_id;
      }
      if (body.actif !== undefined) {
        dataUser.actif = body.actif;
        dataUser.version_session = { increment: 1 };
      }

      if (Object.keys(dataUser).length > 0) {
        await prisma.uTILISATEUR.update({ where: { id: params.id }, data: dataUser });
      }
      if (Object.keys(dataEleve).length > 0) {
        await prisma.eLEVE.update({ where: { id: params.id }, data: dataEleve });
      }

      const eleve = await prisma.eLEVE.findUnique({
        where: { id: params.id },
        select: ELEVE_SELECT,
      });

      return { eleve };
    },
    {
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 2 })),
        prenom: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
        mot_de_passe: t.Optional(t.String({ minLength: 6 })),
        postnom: t.Optional(t.String()),
        sexe: t.Optional(t.String({ pattern: "^(M|F)$" })),
        date_naissance: t.Optional(t.String({ format: "date" })),
        adresse: t.Optional(t.String()),
        telephone_parent: t.Optional(t.String()),
        photo_url: t.Optional(t.String()),
        nationalite: t.Optional(t.String()),
        allergies_medicales: t.Optional(t.String()),
        ecole_provenance: t.Optional(t.String()),
        classe_id: t.Optional(t.String()),
        actif: t.Optional(t.Boolean()),
      }),
    }
  )

  .delete("/:id", async ({ params, user, set }) => {
    if (user.role !== "ADMINISTRATEUR" && user.role !== "DIRECTEUR") {
      set.status = 403;
      return { erreur: "Accès refusé" };
    }

    const existing = await prisma.eLEVE.findFirst({
      where: { id: params.id, ecole_id: user.ecole_id },
    });
    if (!existing) {
      set.status = 404;
      return { erreur: "Élève introuvable" };
    }

    await prisma.uTILISATEUR.update({
      where: { id: params.id },
      data: { actif: false, version_session: { increment: 1 } },
    });

    return { message: "Élève désactivé" };
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
