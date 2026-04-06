import { steps } from "@/constants/index";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            How it <span className="text-sky-500">works</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-lg">
            Getting your to-do list done has never been easier. We handle the
            vetting so you can focus on the results.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Enhanced Connector Line (Desktop Only) */}
          <div className="absolute top-[120px] left-[10%] right-[10%] hidden h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent md:block" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-2 border border-transparent hover:border-slate-100"
            >
              {/* Step Number Background */}
              <span className="absolute top-6 right-10 text-7xl font-black text-slate-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                0{index + 1}
              </span>

              {/* Icon Container */}
              <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-50 transition-all duration-500 group-hover:bg-sky-600 group-hover:rotate-[10deg] group-hover:scale-110">
                <step.icon className="h-10 w-10 text-sky-600 transition-colors duration-500 group-hover:text-white" />

                {/* Small indicator dot */}
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white border-4 border-sky-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Text Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* Mobile Step Badge */}
              <div className="mt-6 md:hidden inline-flex items-center justify-center px-4 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-widest">
                Step 0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
