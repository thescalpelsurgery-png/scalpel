"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"

const highlights = [
  "Access to 200+ educational resources",
  "Exclusive member events and workshops",
  "CME credit opportunities",
  "Global networking community",
]

export function MembershipHero() {
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-secondary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
              Membership
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-balance">
              Elevate Your Surgical Career
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 md:mb-8">
              Join thousands of surgeons and healthcare professionals who are advancing their skills and expanding their
              network through Scalpel membership.
            </p>

            {/* Highlights - improved mobile layout */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2 text-white/90 text-xs md:text-sm"
                >
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                  <span className="whitespace-nowrap">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/professional-surgeons-networking-at-medical-event.jpg"
                alt="Surgeons Networking"
                width={600}
                height={400}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
