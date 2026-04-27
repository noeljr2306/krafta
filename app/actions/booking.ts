"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface BookingActionResult {
  success: boolean;
  error?: string;
}

export async function createBooking(
  technicianId: string,
  description: string,
  address: string,
  scheduledFor?: Date
): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const technician = await prisma.technician.findUnique({ where: { id: technicianId } });
    if (!technician) return { success: false, error: "Technician not found" };

    await prisma.booking.create({
      data: {
        customerId: userId,
        technicianId,
        description,
        address,
        scheduledFor: scheduledFor || null,
        status: "PENDING" as any,
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

export async function acceptBooking(
  bookingId: string,
  priceQuoted?: number,
  scheduledFor?: Date
): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }
    if (booking.status !== "PENDING" as any) {
      return { success: false, error: "Booking is not pending" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "ACCEPTED" as any,
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

export async function rejectBooking(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }
    if (booking.status !== "PENDING" as any) {
      return { success: false, error: "Booking cannot be rejected" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REJECTED" as any },
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
 * Customer locks funds in escrow — 48hr auto-release deadline
 */
export async function payWithEscrow(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }
    if (booking.status !== "ACCEPTED" as any) {
      return { success: false, error: "Booking must be accepted before payment" };
    }
    if (!booking.priceQuoted) {
      return { success: false, error: "Price not set by professional" };
    }

    const escrowDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID" as any,
        paymentMethod: "ESCROW" as any,
        escrowStatus: "HELD",
        escrowDeadline,
      },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Escrow payment error:", error);
    return { success: false, error: "Failed to lock funds in escrow" };
  }
}

/**
 * Customer chooses to pay cash on arrival
 */
export async function payWithCash(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized or booking not found" };
    }
    if (booking.status !== "ACCEPTED" as any) {
      return { success: false, error: "Booking must be accepted first" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CASH_PENDING" as any,
        paymentMethod: "CASH" as any,
        escrowStatus: "NONE",
      },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Cash payment error:", error);
    return { success: false, error: "Failed to set payment method" };
  }
}

/**
 * Professional confirms they received cash
 */
export async function confirmCashReceived(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { technician: true },
    });

    if (!booking || booking.technician.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (booking.status !== "CASH_PENDING" as any) {
      return { success: false, error: "Booking is not in cash pending state" };
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { cashConfirmedByPro: true } as any,
    });

    if ((updated as any).cashConfirmedByCustomer) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" as any, completedAt: new Date() },
      });
    }

    revalidatePath("/professional");
    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Confirm cash received error:", error);
    return { success: false, error: "Failed to confirm cash" };
  }
}

/**
 * Customer confirms they paid cash
 */
export async function confirmCashPaid(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (booking.status !== "CASH_PENDING" as any) {
      return { success: false, error: "Booking is not in cash pending state" };
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { cashConfirmedByCustomer: true } as any,
    });

    if ((updated as any).cashConfirmedByPro) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" as any, completedAt: new Date() },
      });
    }

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Confirm cash paid error:", error);
    return { success: false, error: "Failed to confirm payment" };
  }
}

/**
 * Customer releases escrow funds to professional
 */
export async function releaseFunds(bookingId: string): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (booking.status !== "PAID" as any) {
      return { success: false, error: "Booking must be in escrow to release funds" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED" as any,
        completedAt: new Date(),
        escrowStatus: "RELEASED",
      },
    });

    revalidatePath("/customer");
    revalidatePath("/professional");
    return { success: true };
  } catch (error) {
    console.error("Release funds error:", error);
    return { success: false, error: "Failed to release funds" };
  }
}

/**
 * Customer raises a dispute on an escrow booking
 */
export async function raiseDispute(
  bookingId: string,
  reason: string
): Promise<BookingActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = (session.user as any).id as string;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.customerId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (booking.status !== "PAID" as any) {
      return { success: false, error: "Can only dispute escrow payments" };
    }
    if (!reason.trim()) {
      return { success: false, error: "Please provide a reason for the dispute" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "DISPUTED" as any,
        escrowStatus: "DISPUTED",
        disputeReason: reason,
      } as any,
    });

    revalidatePath("/customer");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Raise dispute error:", error);
    return { success: false, error: "Failed to raise dispute" };
  }
}

// Legacy aliases
export const payBooking = payWithEscrow;
export const completeBooking = releaseFunds;