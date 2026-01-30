"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Search } from "lucide-react";
import { useState } from "react";

export function Nav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Image
            src="/logo.png"
            alt="KRAFTA logo"
            width={140}
            height={40}
            className="w-auto h-8 md:h-10"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!session ? (
            <>
              <div className="flex items-center gap-6">
                <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-sky-500 transition-colors">
                  How it works
                </a>
                <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-sky-500 transition-colors">
                  Services
                </a>
              </div>

              <div className="h-4 w-px bg-slate-200 mx-2" />

              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-sky-500 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/signup?role=professional"
                  className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:scale-105 transition-all active:scale-95"
                >
                  Join as Pro
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-6">
                {role === "CUSTOMER" && (
                  <>
                    <Link
                      href="/customer"
                      className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                        isActive("/customer") && !pathname.includes("technicians") ? "text-sky-500" : "text-slate-600 hover:text-sky-500"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/customer/technicians"
                      className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                        isActive("/customer/technicians") ? "text-sky-500" : "text-slate-600 hover:text-sky-500"
                      }`}
                    >
                      <Search className="h-4 w-4" />
                      Find Pros
                    </Link>
                  </>
                )}

                {role === "PROFESSIONAL" && (
                  <Link
                    href="/professional"
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                      isActive("/professional") ? "text-sky-500" : "text-slate-600 hover:text-sky-500"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Pro Dashboard
                  </Link>
                )}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-2" />

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {(session.user as any)?.name?.split(' ')[0] || "User"}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                    {role}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          {!session ? (
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700">How it works</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700">Services</a>
              <hr className="border-slate-100" />
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700">Sign in</Link>
              <Link
                href="/auth/signup?role=professional"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-xl bg-sky-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-500/20"
              >
                Join as Pro
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                  {(session.user as any)?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{(session.user as any)?.name}</p>
                  <p className="text-xs text-slate-500 lowercase">{role}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}