import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Check for Vercel's secret header to prevent random people from hitting this
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // A simple query to wake up the DB
    await db.user.count();
    return NextResponse.json({ ok: true, message: "DB is awake" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to ping DB" },
      { status: 500 },
    );
  }
}
