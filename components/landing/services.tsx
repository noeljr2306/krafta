import React from "react";
import Image from "next/image";
import { essentials } from "@/constants/index";

export function Services() {
  const doubledEssentials = [...essentials, ...essentials];

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      {/* Header: Centered & Minimal */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 uppercase">
          Home Care <span className="text-sky-500">Essentials</span>
        </h2>
        <p className="mt-4 text-slate-500 text-lg font-medium">
          Professional solutions tailored for your daily maintenance.
        </p>
      </div>

      {/* Scrolling Track */}
      <div className="relative">
        {/* Soft Edge Fades for Smooth Transitions */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll whitespace-nowrap py-4 hover:[animation-play-state:paused]">
          {doubledEssentials.map((item, index) => (
            <div
              key={index}
              className="mx-4 group shrink-0"
            >
              {/* Card Container */}
              <div 
                className="h-[420px] w-[300px] rounded-[2.5rem] p-4 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3"
                style={{ backgroundColor: item.color }}
              >
                {/* Image Wrapper: Slightly smaller than the card to show the bg color as a frame */}
                <div className="relative h-[85%] w-full overflow-hidden rounded-[2rem] shadow-inner bg-white/20">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Text Label: Simple & Bold */}
                <div className="h-[15%] flex items-center justify-center px-2">
                  <span className="text-white text-lg font-bold tracking-wide truncate">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}