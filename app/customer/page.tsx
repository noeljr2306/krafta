import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "@/components/review/review-form";
import { PaymentButton } from "@/components/booking/payment-button";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id as string;

  // Fetching data in a single transaction for efficiency
  const [requests, activeJobs, history] = await prisma.$transaction([
    prisma.booking.findMany({
      where: { customerId: userId, status: BookingStatus.PENDING },
      include: { technician: { include: { user: true } } },
      orderBy: { requestedAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { customerId: userId, status: { in: [BookingStatus.ACCEPTED, BookingStatus.PAID] } },
      include: { technician: { include: { user: true } } },
      orderBy: { scheduledFor: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        customerId: userId,
        status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.REJECTED] },
      },
      include: {
        technician: { include: { user: true } },
        review: true,
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
  ]);

  // REMOVED: return { upcoming, past }; (This was blocking the JSX render)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Customer dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Your bookings
            </h1>
          </div>
          <Link
            href="/customer/technicians"
            className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-400"
          >
            Browse Technicians
          </Link>
        </header>

        {/* My Requests Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              My Requests
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {requests.length === 0 && (
              <p className="text-xs text-slate-500">
                No pending requests.
              </p>
            )}
            {requests.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400">
                  {booking.status}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-50">
                  {booking.technician.user.name} · {booking.technician.title}
                </p>
                <p className="mt-1 line-clamp-2 text-slate-400">
                  {booking.description}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  Requested: {new Date(booking.requestedAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Active Jobs Section */}
        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Active Jobs
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {activeJobs.length === 0 && (
              <p className="text-xs text-slate-500">
                No active jobs.
              </p>
            )}
            {activeJobs.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-sky-900/30 bg-sky-900/10 p-4 text-xs text-slate-200"
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${booking.status === 'PAID' ? 'text-emerald-400' : 'text-sky-400'}`}>
                  {booking.status}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-50">
                  {booking.technician.user.name} · {booking.technician.title}
                </p>
                <p className="mt-1 line-clamp-2 text-slate-400">
                  {booking.description}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  Scheduled:{" "}
                  {booking.scheduledFor
                    ? new Date(booking.scheduledFor).toLocaleString()
                    : "To be confirmed"}
                </p>
                {booking.priceQuoted && booking.status === 'ACCEPTED' && (
                  <PaymentButton bookingId={booking.id} price={booking.priceQuoted} />
                )}
                {booking.status === 'PAID' && (
                  <div className="mt-3 rounded bg-emerald-500/10 px-3 py-2 text-center text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
                    Paid ₦{booking.priceQuoted?.toLocaleString()} — Waiting for completion
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Payment History / Past Jobs */}
        <section className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Payment History & Past Jobs
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {history.length === 0 && (
              <p className="text-xs text-slate-500">No history yet.</p>
            )}
            {history.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200"
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${booking.status === 'COMPLETED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {booking.status}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-50">
                  {booking.technician.user.name} · {booking.technician.title}
                </p>
                <p className="mt-1 text-slate-400">{booking.description}</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  Completed:{" "}
                  {booking.completedAt
                    ? new Date(booking.completedAt).toLocaleString()
                    : "—"}
                </p>

                {booking.priceQuoted && booking.status === 'COMPLETED' && (
                  <p className="mt-1 text-[11px] font-medium text-slate-300">
                    Paid: ₦{booking.priceQuoted.toLocaleString()}
                  </p>
                )}

                {/* Logic for showing Review Form or submitted Review */}
                {booking.status === 'COMPLETED' && (!booking.review ? (
                  <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                    <ReviewForm
                      bookingId={booking.id}
                      technicianId={booking.technicianId}
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-xs font-medium text-emerald-300">
                      Review submitted
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < booking.review!.rating
                              ? "text-yellow-400"
                              : "text-slate-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
