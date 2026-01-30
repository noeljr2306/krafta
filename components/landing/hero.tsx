import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16 pb-20 lg:pt-28 lg:pb-28">
      <div className="hidden lg:block absolute left-[5%] top-[10%] w-87.5 animate-float opacity-80 pointer-events-none">
        <Image
          src="/hero-1.png"
          width={350}
          height={350}
          alt="Technician Illustration Left"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="hidden lg:block absolute right-[5%] top-[45%] w-95 animate-float-delayed opacity-80 pointer-events-none">
        <Image
          width={350}
          height={350}
          src="/hero-2.png"
          alt="Technician Illustration Right"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-800 sm:text-6xl lg:text-7xl">
            Expert Home Services <br />
            <span className="text-sky-500">at Your Door</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
            Connect with vetted local electricians, plumbers, and specialists in
            minutes. Transparent pricing, trusted reviews, and guaranteed
            satisfaction.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-400 hover:scale-105 active:scale-95"
            >
              Find a Professional
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup?role=professional"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/50 px-8 py-4 text-sm font-bold text-slate-700 backdrop-blur-md transition-all hover:border-sky-500 hover:text-sky-500"
            >
              Join as a Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
