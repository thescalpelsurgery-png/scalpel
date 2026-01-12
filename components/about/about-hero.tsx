"use client"

import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-secondary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
              About Us
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-balance px-2">
              SCALPEL: Bridging the Gap in Surgical Training
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto text-center px-2">
              Student-led and surgeon-supervised. We provide the hands-on, simulation-based training necessary to bridge the divide between medical school and the operating room.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mt-8 md:mt-12 relative">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
              <Image
                src="/surgeons-team-collaborating-in-modern-medical-faci.jpg"
                alt="Surgical Team Collaboration"
                width={1200}
                height={500}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
