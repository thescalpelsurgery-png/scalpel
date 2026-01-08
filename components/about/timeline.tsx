"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Calendar, Award, Globe, Monitor, Users, Lightbulb } from "lucide-react"

const milestones = [
  {
    year: "2015",
    title: "Foundation",
    description:
      "Scalpel was founded by a group of visionary surgeons with a mission to revolutionize surgical education.",
    icon: Lightbulb,
    color: "from-primary to-primary/70",
  },
  {
    year: "2017",
    title: "First Conference",
    description: "Hosted our inaugural annual conference with 500+ attendees from 20 countries.",
    icon: Calendar,
    color: "from-secondary to-secondary/70",
  },
  {
    year: "2019",
    title: "Global Expansion",
    description: "Expanded to 50+ partner institutions worldwide, establishing regional training centers.",
    icon: Globe,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    year: "2021",
    title: "Digital Platform",
    description: "Launched our comprehensive online learning platform with virtual surgical simulations.",
    icon: Monitor,
    color: "from-amber-500 to-amber-600",
  },
  {
    year: "2023",
    title: "5000 Members",
    description: "Reached a milestone of 5000+ active members across all surgical specialties.",
    icon: Users,
    color: "from-rose-500 to-rose-600",
  },
  {
    year: "2025",
    title: "Innovation Hub",
    description: "Opening state-of-the-art surgical innovation and training center.",
    icon: Award,
    color: "from-sky-500 to-sky-600",
  },
]

export function Timeline() {
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
            Our Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
            A Decade of Excellence
          </h2>
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed px-2">
            From humble beginnings to a global community, our journey has been defined by continuous growth and
            unwavering commitment to surgical education.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary/50 rounded-full" />

            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isLeft = index % 2 === 0

              return (
                <div
                  key={milestone.year}
                  className={cn("relative flex items-center mb-12 last:mb-0", isVisible && "animate-fade-in-up")}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Left Content */}
                  <div className={cn("w-5/12", isLeft ? "text-right pr-12" : "")}>
                    {isLeft && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
                        <div className="flex items-center justify-end gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-slate-900">{milestone.title}</h3>
                          <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{milestone.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Icon */}
                  <div className="w-2/12 flex justify-center relative z-10">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg ring-4 ring-white",
                        milestone.color,
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className={cn("w-5/12", !isLeft ? "text-left pl-12" : "")}>
                    {!isLeft && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          <h3 className="text-xl font-semibold text-slate-900">{milestone.title}</h3>
                        </div>
                        <p className="text-slate-600 text-sm">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile/Tablet Timeline */}
          <div className="lg:hidden relative">
            {/* Left Line */}
            <div className="absolute left-6 sm:left-8 top-0 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary/50 rounded-full" />

            {milestones.map((milestone, index) => {
              const Icon = milestone.icon

              return (
                <div
                  key={milestone.year}
                  className={cn("relative flex gap-4 sm:gap-6 mb-8 last:mb-0", isVisible && "animate-fade-in-up")}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        "w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg ring-4 ring-slate-50",
                        milestone.color,
                      )}
                    >
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="text-lg sm:text-2xl font-bold text-primary">{milestone.year}</span>
                      <h3 className="text-base sm:text-xl font-semibold text-slate-900">{milestone.title}</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm">{milestone.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
