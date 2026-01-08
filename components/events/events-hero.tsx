"use client"

import Image from "next/image"

export function EventsHero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <span className="inline-block text-secondary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
                Our Events
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-balance">
                Workshops, Conferences & Masterclasses
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join us for hands-on training sessions, expert-led conferences, and specialized masterclasses designed
                to advance your surgical skills and knowledge.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/medical-conference-with-surgeons-attending-present.jpg"
                  alt="Medical Conference"
                  width={600}
                  height={400}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
