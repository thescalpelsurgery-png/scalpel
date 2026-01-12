"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const partners = [
  { name: "Ayub Teaching Hospital (ATH)", logo: "/ath.jpeg" },
  { name: "College of Physicians and Surgeons Pakistan (CPSP)", logo: "/cps.png" },
  { name: "Pakistan Obesity and Metabolic Surgery Society (POMSS)", logo: "/poms.png" },
  { name: "⁠Women Medical College (WMC), Abbottabad", logo: "/wmc.jpg" },
  { name: "⁠Pakistan Urogynecologists Association (PUGA)", logo: "/puga.png" },
  { name: "Biomedical Research and Innovation Network (BRAIN)", logo: "/brain.png" },
]

export function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-slate-50">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Our Partners
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
            Trusted by Leading Institutions
          </h2>
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed px-2">
            We collaborate with world-renowned medical institutions to deliver the highest quality surgical education
            programs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 items-center">
          {partners.map((partner, index) => (
            <div
              key={partner.logo}
              className={cn(
                "flex items-center justify-center p-2 md:p-3 bg-white rounded-lg md:rounded-xl hover:shadow-lg transition-shadow",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={150}
                className="max-h-22 md:max-h-22 w-auto object-cover opacity-100 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
