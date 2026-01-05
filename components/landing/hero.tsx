import Link from "next/link";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm text-slate-400 backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Verified Technicians Available Now
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
            Find the perfect pro for your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              home projects
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Connect with vetted local electricians, plumbers, and specialists in minutes. 
            Transparent pricing, trusted reviews, and guaranteed satisfaction.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-sky-400 hover:scale-105 active:scale-95"
            >
              Find a Professional
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup?role=professional"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-8 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800"
            >
              Join as a Pro
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">Insured Work</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-sm">4.8/5 Average Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background gradient effects */}
      <div className="absolute -top-24 -z-10 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
    </section>
  );
}
