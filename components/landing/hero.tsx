import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Subtle Badge */}
          <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-600 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>The new standard for home maintenance</span>
          </div>

          {/* Main Typography */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Expert Home Services <br />
            <span className="bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
              Simplified for You
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-slate-500 leading-relaxed">
            From leaky pipes to complex electrical wiring, connect with vetted
            professionals who get the job done right.
            <span className="hidden md:inline">
              {" "}
              Fast, reliable, and guaranteed.
            </span>
          </p>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link
              href="/auth/signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-10 py-4.5 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/auth/signup?role=professional"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4.5 text-base font-semibold text-slate-600 hover:text-sky-600 transition-colors"
            >
              Become a Partner Pro
            </Link>
          </div>

         
        </div>
      </div>
    </section>
  );
}
