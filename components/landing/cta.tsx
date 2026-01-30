import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-sky-500 px-6 py-20 text-center shadow-2xl shadow-sky-200 sm:px-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-800/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-sky-100/90 leading-relaxed">
              Join thousands of satisfied customers and skilled professionals on{" "}
              <span className="font-bold text-white">KRAFTA</span> today. Your
              home deserves the best care.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-sky-600 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-sky-50 active:scale-95 sm:w-auto"
              >
                Sign Up Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/auth/login"
                className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-sky-400/50 bg-sky-700/30 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-sky-700 hover:border-sky-400 active:scale-95 sm:w-auto"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
