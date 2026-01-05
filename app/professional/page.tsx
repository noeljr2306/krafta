import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/booking/booking-actions";

import { ProfileSetupForm } from "@/components/professional/profile-setup-form";

export default async function ProfessionalDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id as string;

  const technician = await prisma.technician.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });

  if (!technician) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-slate-50">
            Set up your professional profile
          </h1>
          <p className="mt-2 mb-8 text-sm text-slate-400">
            Your account is marked as a professional. Please complete your profile to start receiving job leads.
          </p>
          <ProfileSetupForm />
        </div>
      </div>
    );
  }

  // Fetch dashboard data
  const [leads, schedule, completed] = await prisma.$transaction([
    prisma.booking.findMany({
      where: { technicianId: technician.id, status: BookingStatus.PENDING },
      include: { customer: true },
      orderBy: { requestedAt: 'desc' }
    }),
    prisma.booking.findMany({
      where: { technicianId: technician.id, status: { in: [BookingStatus.ACCEPTED, BookingStatus.PAID] } },
      include: { customer: true },
      orderBy: { scheduledFor: 'asc' }
    }),
    prisma.booking.findMany({
      where: { technicianId: technician.id, status: BookingStatus.COMPLETED },
      select: { priceQuoted: true }
    })
  ]);

  const totalEarnings = completed.reduce((sum, b) => sum + (b.priceQuoted || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
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
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Total Earnings</p>
            <p className="text-lg font-bold text-emerald-300">₦{totalEarnings.toLocaleString()}</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            {/* Incoming Leads */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  Incoming Leads
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {leads.length}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {leads.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                    <p className="text-sm text-slate-500">No new leads at the moment.</p>
                  </div>
                )}
                {leads.map((booking) => (
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
                ))}
              </div>
            </section>

            {/* My Schedule */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                  My Schedule
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {schedule.length}
                  </span>
                </h2>
              </div>

              <div className="space-y-3">
                {schedule.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                    <p className="text-sm text-slate-500">Your schedule is clear.</p>
                  </div>
                )}
                {schedule.map((booking) => (
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
                          <span>📅 {booking.scheduledFor ? new Date(booking.scheduledFor).toLocaleString() : "TBD"}</span>
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
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
               <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Profile Status</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                     {technician.user.image ? <img src={technician.user.image} alt="" className="rounded-full" /> : "👤"}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-200">{technician.user.name}</p>
                     <p className="text-xs text-slate-500">{technician.title}</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded bg-slate-950 p-2">
                      <p className="text-lg font-bold text-slate-200">{technician.averageRating.toFixed(1)}</p>
                      <p className="text-[10px] text-slate-500">Rating</p>
                    </div>
                    <div className="rounded bg-slate-950 p-2">
                      <p className="text-lg font-bold text-slate-200">{technician.reviewCount}</p>
                      <p className="text-[10px] text-slate-500">Reviews</p>
                    </div>
                 </div>

                 <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      <span className={technician.isVerified ? "text-emerald-400" : "text-amber-400"}>
                        {technician.isVerified ? "Verified" : "Pending"}
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
