import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";
import { Clock, CheckCircle2, History, Search, Star } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "@/components/review/review-form";
import { PaymentButton } from "@/components/booking/payment-button";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const [requests, activeJobs, history] = await prisma.$transaction([
    prisma.booking.findMany({
      where: { customerId: userId, status: BookingStatus.PENDING },
      include: { technician: { include: { user: true } } },
      orderBy: { requestedAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        customerId: userId,
        status: { in: [BookingStatus.ACCEPTED, BookingStatus.PAID] },
      },
      include: { technician: { include: { user: true } } },
      orderBy: { scheduledFor: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        customerId: userId,
        status: {
          in: [
            BookingStatus.COMPLETED,
            BookingStatus.CANCELLED,
            BookingStatus.REJECTED,
          ],
        },
      },
      include: {
        technician: { include: { user: true } },
        review: true,
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Dashboard Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {session.user.name?.split(" ")[0]}
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your service requests and bookings
            </p>
          </div>
          <Link
            href="/customer/technicians"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-sky-500/20 hover:bg-sky-400 transition-all hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
            Find a Professional
          </Link>
        </header>

        <div className="grid gap-10">
          {/* Section: Pending Requests */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="h-5 w-5" />
              <h2 className="font-bold tracking-tight">Pending Requests</h2>
            </div>
            {requests.length === 0 ? (
              <div className="rounded-[2rem] border-2 border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-400">
                  No pending requests at the moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {requests.map((booking) => (
                  <article
                    key={booking.id}
                    className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      {booking.status}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {booking.technician.user.name}
                    </h3>
                    <p className="text-sm font-medium text-sky-600">
                      {booking.technician.title}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {booking.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>
                        Requested{" "}
                        {new Date(booking.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Section: Active Jobs */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sky-600">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="font-bold tracking-tight">Active Jobs</h2>
            </div>
            {activeJobs.length === 0 ? (
              <div className="rounded-[2rem] border-2 border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-400">
                  No active service jobs currently.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeJobs.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[2rem] border border-sky-100 bg-sky-50/30 p-6 shadow-sm ring-1 ring-sky-500/5"
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {booking.technician?.user?.name ?? "Technician Unavailable"}
                    </h3>
                    <p className="text-sm font-medium text-sky-600">
                      {booking.technician?.title?? "_"}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-sky-500" />
                      Scheduled:{" "}
                      {booking.scheduledFor
                        ? new Date(booking.scheduledFor).toLocaleString(
                            "en-US",
                            { dateStyle: "medium", timeStyle: "short" },
                          )
                        : "Awaiting confirm"}
                    </div>

                    <div className="mt-6">
                      {booking.priceQuoted && booking.status === "ACCEPTED" && (
                        <PaymentButton
                          bookingId={booking.id}
                          price={booking.priceQuoted}
                        />
                      )}
                      {booking.status === "PAID" && (
                        <div className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-200">
                          Securely Paid · ₦
                          {booking.priceQuoted?.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Section: History */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600">
              <History className="h-5 w-5" />
              <h2 className="font-bold tracking-tight text-slate-800">
                Past Bookings
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {history.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm opacity-90 transition-opacity hover:opacity-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        booking.status === "COMPLETED"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.priceQuoted && (
                      <span className="text-xs font-bold text-slate-900">
                        ₦{booking.priceQuoted.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900">
                    {booking.technician.user.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Finished on{" "}
                    {booking.completedAt
                      ? new Date(booking.completedAt).toLocaleDateString()
                      : "—"}
                  </p>

                  {booking.status === "COMPLETED" && booking.technicianId &&
                    (!booking.review ? (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <ReviewForm
                          bookingId={booking.id}
                          technicianId={booking.technicianId}
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-slate-50 p-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < booking.review!.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`}
                          />
                        ))}
                        <span className="text-[10px] font-bold text-slate-500 ml-1">
                          Review Sent
                        </span>
                      </div>
                    ))}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
