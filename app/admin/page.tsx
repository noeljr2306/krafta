import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Users, HardHat, Ticket, IdCard, AlertTriangle } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { ApproveRejectButtons } from "@/components/admin/approve-reject-buttons";
import { DisputeResolutionButtons } from "@/components/admin/dispute-resolution-buttons";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/auth/login");

  const [stats, pendingTechnicians, disputes, recentBookings, recentUsers, recentTransactions] =
    await Promise.all([
      prisma.$transaction([
        prisma.user.count(),
        prisma.technician.count(),
        prisma.booking.count(),
      ]),
      prisma.technician.findMany({
        where: { applicationStatus: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.findMany({
        where: { status: "DISPUTED" as any },
        include: {
          customer: true,
          technician: { include: { user: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.booking.findMany({
        include: { customer: true, technician: { include: { user: true } } },
        orderBy: { requestedAt: "desc" },
        take: 6,
      }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.booking.findMany({
        where: {
          status: { in: ["PAID", "COMPLETED"] as any },
          priceQuoted: { not: null },
        },
        include: { customer: true, technician: { include: { user: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

  const [totalUsers, totalTechnicians, totalBookings] = stats;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 py-12">

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                System Administrator
              </p>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Overview</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 p-2 pr-6 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
              {session.user.name?.[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{session.user.name}</p>
              <p className="text-[10px] font-medium text-slate-400">Master Access</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <StatCard label="Total Users" value={totalUsers} icon={<Users className="h-5 w-5" />} description="Active accounts" />
          <StatCard label="Professionals" value={totalTechnicians} icon={<HardHat className="h-5 w-5" />} description="Verified & Pending" />
          <StatCard label="Total Jobs" value={totalBookings} icon={<Ticket className="h-5 w-5" />} description="Platform volume" />
          <StatCard label="Disputes" value={disputes.length} icon={<AlertTriangle className="h-5 w-5" />} description="Needs resolution" highlight={disputes.length > 0} />
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">

            {disputes.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Active Disputes
                </h2>
                <div className="space-y-3">
                  {disputes.map((booking) => (
                    <div key={booking.id} className="rounded-3xl border border-rose-100 bg-rose-50/50 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {booking.customer.name}
                            <span className="mx-2 text-slate-300">vs</span>
                            {booking.technician.user.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            ₦{booking.priceQuoted?.toLocaleString()} · {new Date(booking.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black uppercase text-rose-600">
                          Disputed
                        </span>
                      </div>
                      {(booking as any).disputeReason && (
                        <div className="rounded-xl bg-white border border-rose-100 p-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Customer says:</p>
                          <p className="text-xs text-slate-600 italic">&quot;{(booking as any).disputeReason}&quot;</p>
                        </div>
                      )}
                      <DisputeResolutionButtons bookingId={booking.id} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-900">Recent Booking Flow</h2>
              <div className="grid gap-4">
                {recentBookings.map((booking) => (
                  <article key={booking.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                        booking.status === ("DISPUTED" as any) ? "bg-rose-50 text-rose-600" :
                        booking.status === "PAID" ? "bg-indigo-50 text-indigo-600" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {new Date(booking.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {booking.customer.name}
                      <span className="mx-2 text-slate-300">→</span>
                      {booking.technician.user.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{booking.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-900">Revenue Stream</h2>
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-700">{tx.customer.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">
                          ₦{tx.priceQuoted?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-sky-600">
                Verification Queue
                {pendingTechnicians.length > 0 && (
                  <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] text-sky-600">
                    {pendingTechnicians.length}
                  </span>
                )}
              </h2>
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm divide-y divide-slate-50">
                {pendingTechnicians.length === 0 ? (
                  <p className="p-6 text-xs text-slate-400 text-center">No pending verifications ✓</p>
                ) : (
                  pendingTechnicians.map((tech) => (
                    <div key={tech.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-sm">
                            {tech.user.name?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{tech.user.name}</p>
                            <p className="text-[10px] text-slate-400">{tech.user.email}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600 border border-amber-100">
                          PENDING
                        </span>
                      </div>
                      {tech.idDocument ? (
                        <div className="rounded-xl border border-slate-100 overflow-hidden">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5">
                            <IdCard className="h-3 w-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Submitted Government ID
                            </span>
                          </div>
                          <img src={tech.idDocument} alt="Government ID" className="w-full h-28 object-cover" />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center">
                          <p className="text-[10px] text-slate-400">No ID document uploaded</p>
                        </div>
                      )}
                      <ApproveRejectButtons technicianId={tech.id} />
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-900">User Control</h2>
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                {recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b border-slate-50 p-4 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.name || "User"}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${
                        user.role === "ADMIN" ? "text-rose-400" :
                        user.role === "PROFESSIONAL" ? "text-sky-400" : "text-slate-400"
                      }`}>{user.role}</span>
                    </div>
                    <DeleteUserButton userId={user.id} />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, description, highlight }: {
  label: string; value: number; icon: React.ReactNode; description: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-[2.5rem] border p-8 shadow-sm transition-all hover:shadow-md ${
      highlight ? "border-rose-100 bg-rose-50" : "border-slate-100 bg-white"
    }`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${
        highlight ? "bg-rose-500 text-white shadow-rose-200" : "bg-slate-900 text-white shadow-slate-200"
      }`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 text-4xl font-black tracking-tighter ${highlight ? "text-rose-600" : "text-slate-900"}`}>
        {value}
      </p>
      <p className="mt-2 text-[10px] font-bold text-slate-400">{description}</p>
    </div>
  );
}