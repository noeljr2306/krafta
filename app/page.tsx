import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Services } from "@/components/landing/services";
import { CTA } from "@/components/landing/cta";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <CTA />
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-16">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter text-slate-900"
            >
              <Image
                src="/logo.png"
                width={200}
                height={200}
                alt="Krafta Logo"
              />
            </Link>

            <p className="text-sm text-slate-400">
              &copy; {currentYear} KRAFTA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
