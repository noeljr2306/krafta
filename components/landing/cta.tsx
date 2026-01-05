import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-sky-600 px-6 py-16 text-center shadow-2xl sm:px-16">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sky-100">
              Join thousands of satisfied customers and skilled professionals on KRAFTA today.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-sky-600 shadow-sm transition-colors hover:bg-sky-50"
              >
                Sign Up Now
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-sky-400 bg-sky-700/50 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-sky-700"
              >
                Log In
              </Link>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-sky-500 mix-blend-multiply opacity-50 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-sky-400 mix-blend-multiply opacity-50 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
