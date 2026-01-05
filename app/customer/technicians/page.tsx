import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CustomerTechniciansPage() {
  const technicians = await prisma.technician.findMany({
    include: { user: true },
    orderBy: { isVerified: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Customer • Browse
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Nearby technicians
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              This is a mocked geolocation view. In production we would use the
              customer&apos;s location to sort technicians by distance.
            </p>
          </div>
          <Link
            href="/customer"
            className="text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {technicians.length === 0 && (
            <p className="text-xs text-slate-500">
              No technicians found yet. Seed data will populate demo technicians
              to explore this screen.
            </p>
          )}
          {technicians.map((tech) => (
            <article
              key={tech.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-200"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {tech.user.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tech.title} • {tech.city}, {tech.area}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      tech.isVerified
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-200"
                    }`}
                  >
                    {tech.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300 line-clamp-3">
                  {tech.bio}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tech.skills.split(',').slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  <p>
                    Rating {tech.averageRating.toFixed(1)} ({tech.reviewCount} reviews)
                  </p>
                  <p>
                    From ₦{tech.baseRate ?? 0} • ₦{tech.hourlyRate ?? 0}/hr
                  </p>
                </div>
                <Link
                  href={`/customer/technicians/${tech.id}`}
                  className="rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow shadow-sky-500/40 hover:bg-sky-400"
                >
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}


