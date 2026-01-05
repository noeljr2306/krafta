import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const technicians = await prisma.technician.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return NextResponse.json(
    technicians.map((t) => ({
      id: t.id,
      name: t.user.name,
      title: t.title,
      city: t.city,
      area: t.area,
      averageRating: t.averageRating,
      reviewCount: t.reviewCount,
      isVerified: t.isVerified,
      categories: t.categories.split(','),
      skills: t.skills.split(','),
      baseRate: t.baseRate,
      hourlyRate: t.hourlyRate,
    })),
  );
}


