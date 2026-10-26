import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type NewUser } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class DuplicateEmailError extends Error {
  constructor(message: string = "Email sudah terdaftar") {
    super(message);
    this.name = "DuplicateEmailError";
  }
}

export async function registerUser(input: RegisterUserInput) {
  // Check if email already registered
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new DuplicateEmailError("Email sudah terdaftar");
  }

  // Hash password using bcrypt via Bun.password
  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  const newUser: NewUser = {
    name: input.name,
    email: input.email,
    password: hashedPassword,
  };

  await db.insert(users).values(newUser);

  return { success: true };
}

export const usersService = {
  registerUser,
};


