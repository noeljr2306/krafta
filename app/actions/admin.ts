"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface AdminActionResult {
  success: boolean;
  error?: string;
}

export async function verifyTechnician(
  technicianId: string,
  action: "approve" | "reject"
): Promise<AdminActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.technician.update({
      where: { id: technicianId },
      data: {
        isVerified: action === "approve",
        applicationStatus: action === "approve" ? "APPROVED" : "REJECTED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/customer/technicians");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Verify technician error:", error);
    return { success: false, error: "Failed to update verification status" };
  }
}

export async function deleteUser(userId: string): Promise<AdminActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    if (session.user.id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function resolveDispute(
  bookingId: string,
  resolution: "release" | "refund"
): Promise<AdminActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: resolution === "release" ? "COMPLETED" : "CANCELLED",
        escrowStatus: resolution === "release" ? "RELEASED" : "REFUNDED",
        completedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Resolve dispute error:", error);
    return { success: false, error: "Failed to resolve dispute" };
  }
}
