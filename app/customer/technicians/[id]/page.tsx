import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  ShieldCheck,
  ArrowLeft,
  Award,
  Clock,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/booking-form";

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const technician = await prisma.technician.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!technician) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Technician not found
          </h1>
          <Link
            href="/customer/technicians"
            className="mt-4 inline-block text-sky-500 font-bold"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/customer/technicians"
          className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back to technicians
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content: Profile Info */}
          <div className="space-y-8">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 rounded-[2rem] bg-sky-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-200">
                    {technician.user.name?.[0]}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                      {technician.user.name}
                    </h1>
                    <p className="text-lg font-bold text-sky-600">
                      {technician.title}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {technician.isVerified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600 ring-1 ring-emerald-500/20">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified Pro
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-900">
                          {technician.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          ({technician.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3">
                  About
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  {technician.bio}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {technician.skills.split(",").map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2 text-xs font-bold text-slate-600"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Service Area
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {technician.city}, {technician.area}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4 border border-sky-100">
                  <div className="flex items-center gap-2 text-sky-400 mb-1">
                    <Award className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">
                      Starting At
                    </span>
                  </div>
                  <p className="font-bold text-sky-900">
                    ₦{technician.baseRate?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Recent Feedback
                </h2>
                <div className="h-px flex-1 bg-slate-100 mx-6" />
              </div>

              {technician.reviews.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-10 border border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-400">
                    No reviews yet. Be the first to hire{" "}
                    {technician.user.name?.split(" ")[0]}!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {technician.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            {review.customer.name?.[0]}
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            {review.customer.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-black text-yellow-700">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 italic">
                        &quot;{review.comment}&quot;
                      </p>
                      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" },
                        )}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="relative">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200 overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-sky-400 mb-6">
                    <Clock className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Available Now
                    </span>
                  </div>
                  <BookingForm technicianId={technician.id} />
                </div>
                {/* Visual decoration */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Krafta Guarantee
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Your payments are held in escrow until the job is done.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
