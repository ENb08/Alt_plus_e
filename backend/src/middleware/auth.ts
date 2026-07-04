import { Elysia } from "elysia";

export type AuthPayload = {
  id: string;
  email: string;
  role: string;
  ecole_id: string;
  ecole_slug: string;
};

declare module "elysia" {
  interface ElysiaRequestMeta {
    user?: AuthPayload;
  }
}

export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ jwt, headers, set }): Promise<{ user: AuthPayload }> => {
    const auth = headers["authorization"];
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Token manquant");
    }

    const token = auth.slice(7);
    const payload = await jwt.verify(token);

    if (!payload || !payload.id) {
      set.status = 401;
      throw new Error("Token invalide");
    }

    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as string,
        ecole_id: payload.ecole_id as string,
        ecole_slug: payload.ecole_slug as string,
      },
    };
  });
