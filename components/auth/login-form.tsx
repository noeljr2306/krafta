"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";

export function AuthLoginForm() {
  return (
    <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (registered) {
      setSuccessMessage("Account created successfully! Please sign in.");
    }
  }, [registered]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to manage your KRAFTA bookings
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
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
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-medium text-sky-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-top-1">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="relative flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Sign In to KRAFTA"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          New to KRAFTA?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-sky-600 hover:text-sky-500"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
