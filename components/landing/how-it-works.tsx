import { Search, Calendar, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Search & Match",
    description: "Tell us what you need. We'll match you with verified professionals in your area instantly.",
  },
  {
    icon: Calendar,
    title: "2. Book & Schedule",
    description: "Choose a time that works for you. Review profiles, ratings, and transparent pricing upfront.",
  },
  {
    icon: ShieldCheck,
    title: "3. Get it Done",
    description: "Your pro arrives and completes the job. Pay securely through the platform only when satisfied.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            How KRAFTA Works
          </h2>
          <p className="mt-4 text-slate-400">
            Getting your to-do list done has never been easier.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <step.icon className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
