/* Simple credential login form wired to NextAuth */

"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function AuthLoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const registered = params.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    registered ? "Account created successfully! Please sign in." : null
  );

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
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">Welcome to KRAFTA</h1>
        <p className="text-sm text-slate-400">
          Sign in with your email and password. Demo accounts are seeded.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
      </div>
      {successMessage && (
        <p className="text-sm font-medium text-emerald-400" role="alert">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium text-rose-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-sky-400 hover:text-sky-300">
          Sign up
        </Link>
      </p>
      <p className="text-xs text-slate-500">
        Demo accounts: <span className="font-mono">admin@krafta.local</span>,{" "}
        <span className="font-mono">maria@krafta.local</span>,{" "}
        <span className="font-mono">customer@krafta.local</span>
      </p>
    </form>
  );
}


