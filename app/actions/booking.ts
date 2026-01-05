"use server";

import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface BookingActionResult {
  success: boolean;
  error?: string;
}

/**
 * Create a new booking request
 */
export async function createBooking(
  technicianId: string,
  description: string,
  address: string,
  scheduledFor?: Date
): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    // Verify technician exists
    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      return { success: false, error: "Technician not found" };
    }

    // Create booking
    await prisma.booking.create({
      data: {
        customerId: userId,
        technicianId,
        description,
        address,
        scheduledFor: scheduledFor || null,
        status: BookingStatus.PENDING,
      },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Create booking error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

/**
 * Accept a booking (technician action)
 */
export async function acceptBooking(
  bookingId: string,
  priceQuoted?: number,
  scheduledFor?: Date
): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    // Verify technician owns this booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }

    if (booking.status !== BookingStatus.PENDING) {
      return { success: false, error: "Booking is not pending" };
    }

    // Update booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.ACCEPTED,
        priceQuoted: priceQuoted || booking.priceQuoted,
        scheduledFor: scheduledFor || booking.scheduledFor,
      },
    });

    revalidatePath("/professional");
    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Accept booking error:", error);
    return { success: false, error: "Failed to accept booking" };
  }
}

/**
 * Reject a booking (technician action)
 */
export async function rejectBooking(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }

    if (booking.status !== BookingStatus.PENDING) {
      return { success: false, error: "Booking cannot be rejected" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.REJECTED },
    });

    revalidatePath("/professional");
    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Reject booking error:", error);
    return { success: false, error: "Failed to reject booking" };
  }
}

/**
 * Complete a booking (technician action)
 */
export async function completeBooking(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }

    if (booking.status !== BookingStatus.PAID) {
      return { success: false, error: "Booking must be paid first" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    revalidatePath("/professional");
    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Complete booking error:", error);
    return { success: false, error: "Failed to complete booking" };
  }
}

/**
 * Pay for a booking (customer action)
 */
export async function payBooking(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      return { success: false, error: "Booking must be accepted before payment" };
    }

    if (!booking.priceQuoted) {
      return { success: false, error: "Price not set by professional" };
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.PAID },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Pay booking error:", error);
    return { success: false, error: "Failed to process payment" };
  }
}

