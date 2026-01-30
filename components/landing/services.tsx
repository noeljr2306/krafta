import React from "react";
import Image from "next/image";
import { essentials } from "@/constants/index";

export function Services() {
  const doubledEssentials = [...essentials, ...essentials];

  return (
    <section id="services" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-6xl font-bold tracking-tight text-zinc-800">
          Home care essentials
        </h2>
        <p className="mt-2 text-medium text-slate-500">
          Tailored solutions for your daily maintenance needs.
        </p>
      </div>
      <div className="relative flex">
        <div className="flex animate-scroll whitespace-nowrap">
          {doubledEssentials.map((item, index) => (
            <div
              key={index}
              className="mx-4 h-105 w-80 shrink-0 flex flex-col overflow-hidden rounded-2xl shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: item.color }}
            >
              <div className="relative flex-1 p-4">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                  className="h-full w-full rounded-2xl object-cover"
                  priority={index < 3}
                />
              </div>

              <div className="p-5">
                <p className="text-lg font-bold text-white whitespace-normal leading-tight font-sans">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
