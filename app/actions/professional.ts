"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface ProfessionalProfileData {
  title: string;
  bio: string;
  skills: string;
  categories: string[];
  city: string;
  area: string;
  baseRate?: number;
  hourlyRate?: number;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createProfessionalProfile(
  data: ProfessionalProfileData
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    const existing = await prisma.technician.findUnique({
      where: { userId },
    });

    if (existing) {
      return { success: false, error: "Profile already exists" };
    }

    // ✅ Normalize skills (string → string)
    const normalizedSkills = data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(",");

    // ✅ Normalize categories (string[] → string)
    const normalizedCategories = data.categories
      .map((c) => c.trim())
      .filter(Boolean)
      .join(",");

    await prisma.technician.create({
      data: {
        userId,
        title: data.title,
        bio: data.bio,
        skills: normalizedSkills,
        categories: normalizedCategories, 
        city: data.city,
        area: data.area,
        baseRate: data.baseRate,
        hourlyRate: data.hourlyRate,
        isVerified: false,
      },
    });

    revalidatePath("/professional");

    return { success: true };
  } catch (error) {
    console.error("Create profile error:", error);
    return { success: false, error: "Failed to create profile" };
  }
}
