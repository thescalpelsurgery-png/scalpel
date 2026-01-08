"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpen, Award, Users, Calendar, Video, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const benefits = [
  {
    icon: BookOpen,
    title: "Extensive Learning Library",
    description: "Access 200+ courses, case studies, and surgical technique videos from world-renowned experts.",
  },
  {
    icon: Award,
    title: "CME Accreditation",
    description: "Earn continuing medical education credits through our accredited programs and courses.",
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Connect with 5000+ surgeons worldwide, share knowledge, and collaborate on research.",
  },
  {
    icon: Calendar,
    title: "Exclusive Events",
    description: "Priority access and discounts to workshops, conferences, and hands-on training sessions.",
  },
  {
    icon: Video,
    title: "Live Webinars",
    description: "Participate in monthly live sessions with leading surgeons and industry experts.",
  },
  {
    icon: Globe,
    title: "Research Access",
    description: "Full access to our research database, case studies, and publication archives.",
  },
]

export function MemberBenefits() {
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Member Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-slate-600 text-sm md:text-lg px-2">
            Our membership gives you access to a comprehensive suite of resources designed to support your continuous
            professional development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={cn(
                "group bg-white rounded-lg md:rounded-xl p-5 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <benefit.icon className="w-5 h-5 md:w-7 md:h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
