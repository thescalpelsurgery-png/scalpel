"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const partners = [
  { name: "Johns Hopkins Medicine", logo: "/johns-hopkins-medicine-hospital-logo.jpg" },
  { name: "Mayo Clinic", logo: "/mayo-clinic-medical-center-logo.jpg" },
  { name: "Cleveland Clinic", logo: "/cleveland-clinic-hospital-logo.jpg" },
  { name: "Stanford Health", logo: "/stanford-health-care-medical-logo.jpg" },
  { name: "Mass General", logo: "/placeholder.svg?height=80&width=200" },
  { name: "UCLA Health", logo: "/placeholder.svg?height=80&width=200" },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={cn(
                "flex items-center justify-center p-4 md:p-6 bg-white rounded-lg md:rounded-xl hover:shadow-lg transition-shadow",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={150}
                height={60}
                className="max-h-8 md:max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
