import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Services } from "@/components/landing/services";
import { CTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-sky-500/30">
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <CTA />
      </main>
      
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} KRAFTA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
