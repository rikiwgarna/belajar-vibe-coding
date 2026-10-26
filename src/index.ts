import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    message: "Hello from ElysiaJS + Bun + Drizzle + MySQL!",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
    uptime: process.uptime(),
  }))
  .get("/users", async ({ set }) => {
    try {
      const allUsers = await db.select().from(users);
      return {
        data: allUsers,
      };
    } catch (error) {
      set.status = 500;
      return {
        error: "Database error or connection not established",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .listen(port);

console.log(`🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;

