"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ShieldAlert, KeyRound } from "lucide-react";

export function AuthLoginForm() {
  return (
    <Suspense
      fallback={<div className="text-slate-500 text-center">Loading...</div>}
    >
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const registered = params.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState(""); // New state for secret code
  const [isAdminMode, setIsAdminMode] = useState(false); // Toggle state

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const successMessage = registered
    ? "Account created successfully! Please sign in."
    : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // If Admin Mode is on, we use the adminCode as the password
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password: isAdminMode ? adminCode : password,
      callbackUrl: isAdminMode ? "/admin" : callbackUrl, // Redirect admins to dashboard
    });

    if (res?.error) {
      setError(
        isAdminMode
          ? "Invalid Admin Credentials."
          : "Invalid email or password.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {isAdminMode ? "Admin Access" : "Welcome Back"}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdminMode
              ? "Enter your secure master code"
              : "Sign in to manage your KRAFTA bookings"}
          </p>
        </div>
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-emerald-500" />
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@krafta.com"
              />
            </div>
          </div>

          {/* Conditional Input: Password or Admin Code */}
          {!isAdminMode ? (
            <div className="space-y-2 animate-in fade-in slide-in-from-right-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
              <label className="text-sm font-bold text-rose-600 ml-1">
                Secret Admin Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                <input
                  className="w-full rounded-xl border-2 border-rose-100 bg-rose-50/30 pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-rose-500 focus:bg-white"
                  type="password"
                  required
                  autoFocus
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter Code"
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-[11px] font-bold text-rose-600 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`relative flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-black text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${
            isAdminMode
              ? "bg-slate-900 shadow-slate-200 hover:bg-slate-800"
              : "bg-sky-500 shadow-sky-500/30 hover:bg-sky-400"
          }`}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAdminMode ? (
            "Authorized Login"
          ) : (
            "Sign In to KRAFTA"
          )}
        </button>

        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-slate-500">
            New to KRAFTA?{" "}
            <Link
              href="/auth/signup"
              className="font-bold text-sky-600 hover:text-sky-500"
            >
              Create an account
            </Link>
          </p>

          {/* THE SECRET TRIGGER */}
          <button
            type="button"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-400 transition-colors"
          >
            {isAdminMode ? "Return to Customer Login" : "Staff Portal"}
          </button>
        </div>
      </form>
    </div>
  );
}
