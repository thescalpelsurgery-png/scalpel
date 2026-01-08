"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const stats = [
  { value: 5000, suffix: "+", label: "Active Members", description: "Surgeons and healthcare professionals" },
  { value: 200, suffix: "+", label: "Workshops Conducted", description: "Hands-on training sessions" },
  { value: 50, suffix: "+", label: "Partner Institutions", description: "Worldwide collaborations" },
  { value: 95, suffix: "%", label: "Satisfaction Rate", description: "From our participants" },
]

function AnimatedCounter({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, isVisible])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/surgeons-team-in-operating-room-performing-surgery.jpg"
          alt="Surgical Team"
          fill
          className="object-cover opacity-10"
        />
      </div>

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

      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-secondary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Our Impact
          </span>
          <h2 className="sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 text-balance px-2 text-xl">
            Making a Difference in Surgical Education
          </h2>
          <p className="text-white/70 md:text-lg leading-relaxed px-2 text-sm text-center">
            Our numbers speak for themselves. Join thousands of surgeons who have advanced their careers through our
            programs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center p-4 md:p-8 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </div>
              <div className="text-sm md:text-lg font-semibold text-white mb-0.5 md:mb-1">{stat.label}</div>
              <div className="text-white/60 text-xs md:text-sm hidden sm:block">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
