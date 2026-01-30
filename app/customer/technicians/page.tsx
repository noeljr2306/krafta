import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  ArrowLeft,
  Briefcase,
} from "lucide-react";

export default async function CustomerTechniciansPage() {
  const technicians = await prisma.technician.findMany({
    include: { user: true },
    orderBy: { isVerified: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link
              href="/customer"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Nearby Professionals
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Verified experts in your area. Sort by distance or rating to find
              the perfect fit for your home needs.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 shadow-sm">
            <MapPin className="h-4 w-4 text-sky-500" />
            <span className="text-xs font-bold text-slate-600">Lagos, NG</span>
          </div>
        </header>

        {/* Directory Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {technicians.length === 0 ? (
            <div className="col-span-full rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No pros found
              </h3>
              <p className="text-sm text-slate-500">
                Seed your database to see local technicians here.
              </p>
            </div>
          ) : (
            technicians.map((tech) => (
              <article
                key={tech.id}
                className="group flex flex-col justify-between rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg">
                        {tech.user.name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {tech.user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {tech.city}, {tech.area}
                        </div>
                      </div>
                    </div>

                    {tech.isVerified && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600 ring-1 ring-emerald-500/20">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-sky-500" />
                    <span className="text-sm font-bold text-slate-700">
                      {tech.title}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {tech.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tech.skills
                      .split(",")
                      .slice(0, 3)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between border-t border-slate-50 pt-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-slate-900">
                        {tech.averageRating.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        ({tech.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600">
                      ₦{tech.baseRate?.toLocaleString()} base • ₦
                      {tech.hourlyRate?.toLocaleString()}/hr
                    </p>
                  </div>

                  <Link
                    href={`/customer/technicians/${tech.id}`}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-sky-500 hover:shadow-sky-500/20 active:scale-95"
                  >
                    View Profile
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
