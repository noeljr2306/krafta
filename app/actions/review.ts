"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface ReviewResult {
  success: boolean;
  error?: string;
}

/**
 * Submit a review for a completed booking
 */
export async function submitReview(
  bookingId: string,
  rating: number,
  comment: string
): Promise<ReviewResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id as string;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    // Verify booking exists, is completed, and belongs to customer
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true, technician: true },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.customerId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (booking.status !== "COMPLETED") {
      return { success: false, error: "Can only review completed bookings" };
    }

    if (booking.review) {
      return { success: false, error: "Review already submitted" };
    }

    // Create review
    await prisma.review.create({
      data: {
        bookingId,
        customerId: userId,
        technicianId: booking.technicianId,
        rating,
        comment,
      },
    });

    // Update technician rating stats
    const reviews = await prisma.review.findMany({
      where: { technicianId: booking.technicianId },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.technician.update({
      where: { id: booking.technicianId },
      data: {
        averageRating,
        reviewCount: reviews.length,
      },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    revalidatePath("/customer/technicians");
    return { success: true };
  } catch (error) {
    console.error("Submit review error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

