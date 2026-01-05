import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { VerifyTechnicianButton } from "@/components/admin/verify-technician-button";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/auth/login");
  }

  const [stats, technicians, recentBookings, recentUsers, recentTransactions] = await Promise.all([
    prisma.$transaction([
      prisma.user.count(),
      prisma.technician.count(),
      prisma.booking.count(),
    ]),
    prisma.technician.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.booking.findMany({
      include: {
        customer: true,
        technician: { include: { user: true } },
      },
      orderBy: { requestedAt: "desc" },
      take: 6,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.booking.findMany({
      where: { 
        status: { in: [BookingStatus.PAID, BookingStatus.COMPLETED] },
        priceQuoted: { not: null }
      },
      include: {
        customer: true,
        technician: { include: { user: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const [totalUsers, totalTechnicians, totalBookings] = stats;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Platform overview
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Monitor users, technicians, and booking activity across KRAFTA.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Total users
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {totalUsers}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Includes customers, technicians, and admins.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Active technicians
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {totalTechnicians}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Technicians with a published profile.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              All bookings
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {totalBookings}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Total jobs created on the platform.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Recent bookings
            </h2>
            <div className="space-y-3">
              {recentBookings.length === 0 && (
                <p className="text-xs text-slate-500">
                  No bookings yet. Once customers start booking technicians, they will
                  appear here.
                </p>
              )}
              {recentBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {booking.status}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(booking.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-50">
                    {booking.customer.name ?? "Customer"} →{" "}
                    {booking.technician.user.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-slate-400">
                    {booking.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Technicians (verification view)
            </h2>
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200">
              {technicians.length === 0 && (
                <p className="text-xs text-slate-500">
                  No technicians found. Seed data will populate example technicians for
                  review.
                </p>
              )}
              {technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-start justify-between gap-3 border-b border-slate-800/60 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-50">
                      {tech.user.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tech.title} • {tech.city}, {tech.area}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Rating {tech.averageRating.toFixed(1)} ({tech.reviewCount} reviews)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        tech.isVerified
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {tech.isVerified ? "Verified" : "Pending"}
                    </span>
                    <VerifyTechnicianButton
                      technicianId={tech.id}
                      isVerified={tech.isVerified}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold text-slate-100">
            User Management
          </h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-400">
                <thead className="bg-slate-950/50 uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {user.name || "Unnamed"}
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-300"
                              : user.role === "PROFESSIONAL"
                              ? "bg-blue-500/10 text-blue-300"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeleteUserButton userId={user.id} />
                      </td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Recent Transactions
          </h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-400">
                <thead className="bg-slate-950/50 uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Professional</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        {new Date(tx.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {tx.customer.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {tx.technician.user.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-400">
                        ₦{tx.priceQuoted?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


