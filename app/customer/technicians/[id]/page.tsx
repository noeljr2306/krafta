import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-slate-50">Technician not found</h1>
          <Link href="/customer/technicians" className="mt-4 text-sm text-sky-400">
            Back to technicians
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/customer/technicians"
          className="mb-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300"
        >
          ← Back to technicians
        </Link>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-50">
                    {technician.user.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">{technician.title}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        technician.isVerified
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {technician.isVerified ? "✓ Verified" : "Pending verification"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ⭐ {technician.averageRating.toFixed(1)} ({technician.reviewCount}{" "}
                      reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-300">{technician.bio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {technician.skills.split(',').map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4 text-xs">
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="mt-1 font-medium text-slate-200">
                    {technician.city}, {technician.area}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Starting Rate</p>
                  <p className="mt-1 font-medium text-slate-200">
                    ₦{technician.baseRate ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-100">Recent Reviews</h2>
              {technician.reviews.length === 0 ? (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {technician.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-200">
                          {review.customer.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <span>★</span>
                          <span>{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{review.comment}</p>
                      <p className="mt-2 text-[10px] text-slate-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form Sidebar */}
          <div className="relative">
            <div className="sticky top-6">
              <BookingForm technicianId={technician.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

