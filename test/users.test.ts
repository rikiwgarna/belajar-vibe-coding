import { describe, expect, it, mock } from "bun:test";
import { usersRoutes } from "../src/routes/users-routes";
import { DuplicateEmailError, usersService } from "../src/services/users-services";

describe("User Registration & API Tests", () => {
  describe("Password Hashing (Bcrypt)", () => {
    it("should correctly hash password with bcrypt and verify it", async () => {
      const password = "rahasia";
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      expect(hashedPassword).toBeString();
      expect(hashedPassword.startsWith("$2")).toBeTrue();

      const isMatch = await Bun.password.verify(password, hashedPassword);
      expect(isMatch).toBeTrue();

      const isWrongMatch = await Bun.password.verify("passwordsalah", hashedPassword);
      expect(isWrongMatch).toBeFalse();
    });
  });

  describe("API Request Validation", () => {
    it("should reject request with missing fields (HTTP 422)", async () => {
      const response = await usersRoutes.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Riki" }),
        })
      );

      expect(response.status).toBe(422);
    });

    it("should reject request with empty body (HTTP 422)", async () => {
      const response = await usersRoutes.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe("API Endpoint Responses (POST /api/users)", () => {
    it("should return { data: 'OK' } with status 200 on successful registration", async () => {
      const original = usersService.registerUser;
      usersService.registerUser = mock(async () => ({ success: true }));

      const response = await usersRoutes.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Riki",
            email: "riki@localhost",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ data: "OK" });

      usersService.registerUser = original;
    });

    it("should return { error: 'Email sudah terdaftar' } with status 400 when email is duplicate", async () => {
      const original = usersService.registerUser;
      usersService.registerUser = mock(async () => {
        throw new DuplicateEmailError("Email sudah terdaftar");
      });

      const response = await usersRoutes.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Riki",
            email: "riki@localhost",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Email sudah terdaftar" });

      usersService.registerUser = original;
    });
  });
});
