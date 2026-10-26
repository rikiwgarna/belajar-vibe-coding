import { Elysia, t } from "elysia";
import { DuplicateEmailError, usersService } from "../services/users-services";

export const usersRoutes = new Elysia()
  .post(
    "/api/users",
    async ({ body, set }) => {
      try {
        await usersService.registerUser(body);
        set.status = 200;
        return { data: "OK" };
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          set.status = 400;
          return { error: error.message };
        }
        set.status = 500;
        return {
          error: error instanceof Error ? error.message : "Internal Server Error",
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  );

