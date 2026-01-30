import {steps} from "@/constants/index";
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Getting your to-do list done has never been easier. We handle the
            vetting so you can focus on the results.
          </p>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          <div className="absolute top-1/4 left-0 hidden w-full border-t-2 border-dashed border-sky-100 md:block" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                Step 0{index + 1}
              </div>

              <div className="relative mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50 transition-colors group-hover:bg-sky-500">
                <step.icon className="h-10 w-10 text-sky-500 transition-colors duration-700 ease-in-out group-hover:text-white" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {step.title}
              </h3>

              <p className="text-slate-500 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
