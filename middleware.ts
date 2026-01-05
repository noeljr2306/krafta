import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: any }) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth?.token?.role ?? "") as string;

    // Admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

    // Professional routes
    if (pathname.startsWith("/professional") && role !== "PROFESSIONAL") {
      return new Response("Forbidden", { status: 403 });
    }

    // Customer routes
    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return new Response("Forbidden", { status: 403 });
    }

    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/customer/:path*", "/professional/:path*", "/admin/:path*"],
};


