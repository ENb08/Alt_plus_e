import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { authRoutes } from "./src/routes/auth.ts";

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "7d",
    })
  )
  .use(authRoutes)
  .get("/api/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🚀 API lancée sur http://localhost:${app.server?.port}`);
