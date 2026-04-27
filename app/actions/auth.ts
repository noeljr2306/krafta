"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface SignupResult {
  success: boolean;
  error?: string;
}

export async function signup(
  email: string,
  password: string,
  name: string,
  role: Role = Role.CUSTOMER,
  idDocument?: string,
): Promise<SignupResult> {
  try {
    if (!email || !password || !name) {
      return { success: false, error: "All fields are required" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }
    if (role === Role.PROFESSIONAL && !idDocument) {
      return { success: false, error: "Government ID upload is required for professionals" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, hashedPassword, role },
    });

    if (role === Role.PROFESSIONAL) {
      await prisma.technician.create({
        data: {
          userId: user.id,
          title: "New Professional",
          bio: "",
          skills: "",
          categories: "",
          city: "",
          area: "",
          isVerified: false,
          applicationStatus: "PENDING",
          idDocument: idDocument ?? null,
        },
      });
    }

    revalidatePath("/auth/login");
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Email already in use." };
    }
    return { success: false, error: "Failed to create account. Please try again." };
  }
}
