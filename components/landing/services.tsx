import { Zap, Droplets, Wrench, Thermometer, Truck, Home } from "lucide-react";

const services = [
  { icon: Zap, name: "Electrical", count: "120+ Pros" },
  { icon: Droplets, name: "Plumbing", count: "85+ Pros" },
  { icon: Thermometer, name: "HVAC & AC", count: "64+ Pros" },
  { icon: Wrench, name: "General Repair", count: "200+ Pros" },
  { icon: Home, name: "Cleaning", count: "150+ Pros" },
  { icon: Truck, name: "Moving", count: "45+ Pros" },
];

export function Services() {
  return (
    <section id="services" className="py-24 border-y border-slate-900/50 bg-slate-900/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50">
              Popular Services
            </h2>
            <p className="mt-2 text-slate-400">
              Expert help for every part of your home.
            </p>
          </div>
         
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {services.map((service) => (
            <div
              key={service.name}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-sky-500/50 hover:bg-slate-800"
            >
              <service.icon className="mb-3 h-8 w-8 text-slate-400 group-hover:text-sky-500 transition-colors" />
              <div className="font-semibold text-slate-200">{service.name}</div>
              <div className="text-xs text-slate-500">{service.count}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <a href="/services" className="text-sm font-medium text-sky-500 hover:text-sky-400">
            View all services →
          </a>
        </div>
      </div>
    </section>
  );
}
