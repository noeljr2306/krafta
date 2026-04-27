import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import { Clock, BadgeCheck, AlertTriangle } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/booking/booking-actions";
import { ProfileSetupForm } from "@/components/professional/profile-setup-form";
import Image from "next/image";

export default async function ProfessionalDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id as string;

  const technician = await prisma.technician.findUnique({
    where: { userId },
    include: { user: true },
  });

  // No profile yet — show setup form
  if (!technician) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-slate-50">
            Set up your professional profile
          </h1>
          <p className="mt-2 mb-8 text-sm text-slate-400">
            Complete your profile to start receiving job leads.
          </p>
          <ProfileSetupForm />
        </div>
      </div>
    );
  }

  const [leads, schedule, completed] = await prisma.$transaction([
    prisma.booking.findMany({
      where: { technicianId: technician.id, status: BookingStatus.PENDING },
      include: { customer: true },
      orderBy: { requestedAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        technicianId: technician.id,
        status: { in: [BookingStatus.ACCEPTED, BookingStatus.PAID] },
      },
      include: { customer: true },
      orderBy: { scheduledFor: "asc" },
    }),
    prisma.booking.findMany({
      where: { technicianId: technician.id, status: BookingStatus.COMPLETED },
      select: { priceQuoted: true },
    }),
  ]);

  const totalEarnings = completed.reduce((sum, b) => sum + (b.priceQuoted || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Verification Status Banner */}
        {!technician.isVerified && technician.applicationStatus === "PENDING" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-5 py-4">
            <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-300">Verification Pending</p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                Your ID is being reviewed by our admin team. You can set up your profile now, but you&apos;ll only appear to customers once verified. This usually takes under 24 hours.
              </p>
            </div>
          </div>
        )}

        {technician.applicationStatus === "REJECTED" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-5 py-4">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-300">Verification Rejected</p>
              <p className="text-xs text-rose-400/80 mt-0.5">
                Your verification was not approved. Please contact support with a valid government ID to reapply.
              </p>
            </div>
          </div>
        )}

        {technician.isVerified && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4">
            <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-bold text-emerald-300">
              Your profile is verified and visible to customers ✓
            </p>
          </div>
        )}

        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Professional dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Overview
            </h1>
          </div>
          <div className="rounded-lg bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              Total Earnings
            </p>
            <p className="text-lg font-bold text-emerald-300">
              ₦{totalEarnings.toLocaleString()}
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            {/* Incoming Leads */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Incoming Leads
                </h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {leads.length}
                </span>
              </div>

              <div className="space-y-3">
                {leads.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                    <p className="text-sm text-slate-500">No new leads at the moment.</p>
                  </div>
                ) : (
                  leads.map((booking) => (
                    <article
                      key={booking.id}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:bg-amber-500/10"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-50">
                              {booking.customer.name ?? "Customer"}
                            </p>
                            <span className="text-xs text-slate-500">• {booking.address}</span>
                          </div>
                          <p className="text-sm text-slate-300">{booking.description}</p>
                          <p className="text-xs text-slate-500">
                            Requested {new Date(booking.requestedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <BookingActions
                            bookingId={booking.id}
                            status={booking.status}
                            currentPrice={booking.priceQuoted}
                            currentScheduledFor={booking.scheduledFor}
                          />
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* My Schedule */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <h2 className="text-sm font-semibold text-slate-100">My Schedule</h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {schedule.length}
                </span>
              </div>

              <div className="space-y-3">
                {schedule.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                    <p className="text-sm text-slate-500">Your schedule is clear.</p>
                  </div>
                ) : (
                  schedule.map((booking) => (
                    <article
                      key={booking.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-50">
                              {booking.customer.name ?? "Customer"}
                            </p>
                            {booking.priceQuoted && (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                                ₦{booking.priceQuoted.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300">{booking.description}</p>
                          <div className="flex items-center gap-2 text-xs text-sky-400">
                            <span>
                              📅{" "}
                              {booking.scheduledFor
                                ? new Date(booking.scheduledFor).toLocaleString()
                                : "TBD"}
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className="text-slate-500">{booking.address}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <BookingActions
                            bookingId={booking.id}
                            status={booking.status}
                            currentPrice={booking.priceQuoted}
                            currentScheduledFor={booking.scheduledFor}
                          />
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Profile Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                    {technician.user.image ? (
                      <Image
                        src={technician.user.image}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {technician.user.name}
                    </p>
                    <p className="text-xs text-slate-500">{technician.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded bg-slate-950 p-2">
                    <p className="text-lg font-bold text-slate-200">
                      {technician.averageRating.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-500">Rating</p>
                  </div>
                  <div className="rounded bg-slate-950 p-2">
                    <p className="text-lg font-bold text-slate-200">
                      {technician.reviewCount}
                    </p>
                    <p className="text-[10px] text-slate-500">Reviews</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Verification</span>
                    <span
                      className={
                        technician.isVerified
                          ? "text-emerald-400"
                          : technician.applicationStatus === "REJECTED"
                          ? "text-rose-400"
                          : "text-amber-400"
                      }
                    >
                      {technician.isVerified
                        ? "✓ Verified"
                        : technician.applicationStatus === "REJECTED"
                        ? "Rejected"
                        : "Pending Review"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Location</span>
                    <span className="text-slate-300">{technician.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
