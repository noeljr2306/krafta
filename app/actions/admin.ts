"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Verify a technician (admin action)
 */
export async function verifyTechnician(
  technicianId: string,
  verified: boolean
): Promise<AdminActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.technician.update({
      where: { id: technicianId },
      data: { isVerified: verified },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Verify technician error:", error);
    return { success: false, error: "Failed to update verification status" };
  }
}

/**
 * Delete a user (admin action)
 */
export async function deleteUser(userId: string): Promise<AdminActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Prevent deleting self
    if (session.user.id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

