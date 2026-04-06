"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface SignupResult {
  success: boolean;
  error?: string;
}

/**
 * Server action to register a new user
 */
export async function signup(
  email: string,
  password: string,
  name: string,
  role: Role = Role.CUSTOMER,
): Promise<SignupResult> {
  try {
    // Validate inputs
    if (!email || !password || !name) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role,
      },
    });

    revalidatePath("/auth/login");
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    let errorMsg = "Failed to create account. Please try again.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        errorMsg = "Email already in use.";
      }
    }
    return { success: false, error: errorMsg };
  }
}
