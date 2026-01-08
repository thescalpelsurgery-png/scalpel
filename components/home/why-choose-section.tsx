"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { GraduationCap, Users, Award, BookOpen, Stethoscope, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: GraduationCap,
    title: "Expert-Led Education",
    description: "Learn from world-renowned surgeons and medical professionals through comprehensive courses.",
    color: "from-primary to-primary/70",
    image: "/medical-professor-teaching-surgical-techniques-in-.jpg",
  },
  {
    icon: Users,
    title: "Collaborative Community",
    description:
      "Connect with peers, share knowledge, and collaborate on research across specialties and institutions.",
    color: "from-secondary to-secondary/70",
    image: "/group-of-surgeons-collaborating-in-discussion-meet.jpg",
  },
  {
    icon: Award,
    title: "Accredited Programs",
    description: "Earn CME credits and certifications recognized by major medical boards and institutions worldwide.",
    color: "from-emerald-500 to-emerald-600",
    image: "/medical-certificate-diploma-with-stethoscope-on-de.jpg",
  },
  {
    icon: BookOpen,
    title: "Evidence-Based Learning",
    description: "Access the latest research, case studies, and surgical techniques backed by scientific evidence.",
    color: "from-amber-500 to-amber-600",
    image: "/medical-research-journals-and-scientific-publicati.jpg",
  },
  {
    icon: Stethoscope,
    title: "Hands-On Training",
    description: "Participate in simulation labs, cadaver workshops, and live surgical demonstrations.",
    color: "from-rose-500 to-rose-600",
    image: "/surgeon-practicing-on-surgical-simulator-training-.jpg",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Join a worldwide community of surgical professionals sharing best practices and innovations.",
    color: "from-sky-500 to-sky-600",
    image: "/world-map-with-connected-medical-icons-global-netw.jpg",
  },
]

export function WhyChooseSection() {
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
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Why Choose Us
          </span>
          <h2 className="sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 text-balance px-2 text-xl">
            Why Choose Scalpel for Your Professional Development
          </h2>
          <p className="text-slate-600 md:text-lg leading-relaxed px-2 text-sm text-center">
            We provide a comprehensive platform that combines cutting-edge education, collaborative networking, and
            professional recognition to advance your surgical career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-32 md:h-40 overflow-hidden">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Icon overlay */}
                <div
                  className={cn(
                    "absolute bottom-3 left-3 md:bottom-4 md:left-4 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    feature.color,
                  )}
                >
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 bg-card">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base text-left">{feature.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
