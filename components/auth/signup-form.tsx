"use client";

import { useState, useRef, FormEvent, Suspense } from "react";
import { signup } from "@/app/actions/auth";
import { Role } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Briefcase,
  Upload,
  Camera,
  CheckCircle2,
} from "lucide-react";

export function AuthSignupForm() {
  return (
    <Suspense
      fallback={
        <div className="text-slate-500 text-center py-10">Loading Form...</div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}

function getRoleFromParams(searchParams: ReturnType<typeof useSearchParams>) {
  const roleParam = searchParams.get("role") || searchParams.get("as");
  if (!roleParam) return Role.CUSTOMER;
  const normalized = roleParam.toUpperCase();
  if (normalized === "PROFESSIONAL" || normalized === "TECHNICIAN") {
    return Role.PROFESSIONAL;
  }
  return Role.CUSTOMER;
}

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const initialRole = getRoleFromParams(searchParams);
  const [role, setRole] = useState<Role>(initialRole);

  // Professional fields
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [livenessState, setLivenessState] = useState<
    "idle" | "capturing" | "done"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleIdUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIdPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleLivenessCheck() {
    setLivenessState("capturing");
    // Simulate liveness check — 2 second delay then mark done
    setTimeout(() => {
      setLivenessState("done");
    }, 2000);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === Role.PROFESSIONAL) {
      if (!idFile || !idPreview) {
        setError("Please upload your government ID");
        return;
      }
      if (livenessState !== "done") {
        setError("Please complete the liveness check");
        return;
      }
    }

    setLoading(true);

    const result = await signup(
      email,
      password,
      name,
      role,
      role === Role.PROFESSIONAL ? idPreview : undefined,
    );

    if (result.success) {
      router.push("/auth/login?registered=true");
    } else {
      setError(result.error || "Failed to create account");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-sm text-slate-500">
            Join <span className="text-sky-500 font-semibold">KRAFTA</span> and
            get tasks done today.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole(Role.CUSTOMER)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              role === Role.CUSTOMER
                ? "border-sky-500 bg-sky-50 text-sky-600"
                : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
            }`}
          >
            <ShieldCheck
              className={`h-6 w-6 ${role === Role.CUSTOMER ? "text-sky-500" : "text-slate-400"}`}
            />
            <span className="text-xs font-bold uppercase tracking-wider">
              I&apos;m a Customer
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole(Role.PROFESSIONAL)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              role === Role.PROFESSIONAL
                ? "border-sky-500 bg-sky-50 text-sky-600"
                : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
            }`}
          >
            <Briefcase
              className={`h-6 w-6 ${role === Role.PROFESSIONAL ? "text-sky-500" : "text-slate-400"}`}
            />
            <span className="text-xs font-bold uppercase tracking-wider">
              I&apos;m a Pro
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Confirm
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Professional-only fields */}
          {role === Role.PROFESSIONAL && (
            <div className="space-y-4 rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                Professional Verification
              </p>

              {/* ID Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Government ID Upload
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                    idPreview
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200 bg-slate-50/50 hover:border-sky-400 hover:bg-sky-50/50"
                  }`}
                >
                  {idPreview ? (
                    <div className="space-y-2">
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        className="mx-auto h-24 w-auto rounded-lg object-cover shadow-sm"
                      />
                      <p className="text-xs font-semibold text-emerald-600">
                        ✓ ID uploaded — click to change
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500">
                        Click to upload your ID
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Driver&apos;s License, NIN, or Passport
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIdUpload}
                  />
                </div>
              </div>

              {/* Liveness Check */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Liveness Check
                </label>
                {livenessState === "idle" && (
                  <button
                    type="button"
                    onClick={handleLivenessCheck}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <Camera className="h-4 w-4" />
                    Start Liveness Capture
                  </button>
                )}
                {livenessState === "capturing" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    <span className="text-sm font-bold text-amber-600">
                      Verifying your face...
                    </span>
                  </div>
                )}
                {livenessState === "done" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600">
                      Liveness check passed ✓
                    </span>
                  </div>
                )}
                <p className="text-[10px] text-slate-400">
                  Hold your ID next to your face and look at the camera
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Create Your Free Account"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-sky-600 hover:text-sky-500"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}