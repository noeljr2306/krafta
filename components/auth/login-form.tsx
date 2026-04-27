"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export function AuthLoginForm() {
  return (
    <Suspense fallback={<div className="text-slate-500 text-center py-10">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") setJustRegistered(true);
    const authError = searchParams.get("error");
    if (authError === "CredentialsSignin") {
      setError("Incorrect email or password. Please check your details and try again.");
    } else if (authError) {
      setError("An error occurred. Please try again.");
    }
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password. Please check your details and try again.");
      setLoading(false);
      return;
    }

    if (result?.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") router.push("/admin");
      else if (role === "PROFESSIONAL") router.push("/professional");
      else router.push("/customer");

      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Sign in to your <span className="text-sky-500 font-semibold">KRAFTA</span> account
          </p>
        </div>

        {justRegistered && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <p className="text-xs font-medium text-emerald-700">
              Account created! Sign in to get started.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-rose-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:bg-white focus:ring-4 ${
                  error
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/10"
                }`}
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:bg-white focus:ring-4 ${
                  error
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/10"
                }`}
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-sky-600 hover:text-sky-500">
            Create one free
          </Link>
        </p>
      </form>
    </div>
  );
}
