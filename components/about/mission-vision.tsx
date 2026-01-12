"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Target, Eye, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To move beyond the textbook. We provide a safe, supervised environment where students master technical precision through real surgical skills and hands-on practice.",
    color: "from-primary to-primary/70",
    image: "/surgeons-in-operating-room-performing-surgery.jpg",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To standardize surgical simulation across Pakistan, creating a national network where the next generation of surgeons is defined by merit, mentorship, and mastery.",
    color: "from-secondary to-secondary/70",
    image: "/futuristic-medical-technology-hologram-surgery.jpg",
  },
  {
    icon: Heart,
    title: "Our Motto",
    description:
      "Practice. Precision. Progress. We believe in evidence-based practice, continuous learning, and putting patient safety first.",
    color: "from-accent to-accent/70",
    image: "/medical-team-caring-for-patient-hospital.jpg",
  },
]

export function MissionVision() {
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
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "relative bg-slate-50 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-slate-100",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-32 md:h-40 overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
              </div>

              <div className="p-5 md:p-8 -mt-8 relative">
                <div
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 md:mb-6 shadow-lg",
                    item.color,
                  )}
                >
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4">{item.title}</h3>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
