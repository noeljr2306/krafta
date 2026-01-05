"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Nav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/40">
            K
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-50">KRAFTA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!session ? (
            <>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-slate-50 transition-colors">
                How it works
              </a>
              <a href="#services" className="text-sm font-medium text-slate-300 hover:text-slate-50 transition-colors">
                Services
              </a>
              <div className="h-4 w-px bg-slate-800 mx-2" />
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-300 hover:text-slate-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/login?as=technician"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition-all hover:scale-105"
              >
                Join as Pro
              </Link>
            </>
          ) : (
            <>
              {role === "CUSTOMER" && (
                <>
                  <Link
                    href="/customer"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/customer") && !isActive("/customer/technicians")
                        ? "text-sky-400"
                        : "text-slate-300 hover:text-slate-50"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/customer/technicians"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/customer/technicians")
                        ? "text-sky-400"
                        : "text-slate-300 hover:text-slate-50"
                    }`}
                  >
                    Browse Technicians
                  </Link>
                </>
              )}

              {role === "PROFESSIONAL" && (
                <Link
                  href="/professional"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/professional")
                      ? "text-sky-400"
                      : "text-slate-300 hover:text-slate-50"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "text-sky-400"
                      : "text-slate-300 hover:text-slate-50"
                  }`}
                >
                  Admin
                </Link>
              )}

              <div className="h-4 w-px bg-slate-800 mx-2" />

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 hidden lg:inline-block">
                  {(session.user as any)?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-slate-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-6 space-y-4">
          {!session ? (
            <>
              <a href="#how-it-works" className="block text-sm font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>
                How it works
              </a>
              <a href="#services" className="block text-sm font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>
                Services
              </a>
              <div className="h-px w-full bg-slate-800 my-4" />
              <Link
                href="/auth/login"
                className="block text-sm font-medium text-slate-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/auth/login?as=technician"
                className="block w-full rounded-lg bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-slate-950"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join as Pro
              </Link>
            </>
          ) : (
            <>
              <div className="mb-4 pb-4 border-b border-slate-800">
                <p className="text-sm font-medium text-slate-200">
                  {(session.user as any)?.name || session.user?.email}
                </p>
                <p className="text-xs text-slate-500 mt-1">{role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
