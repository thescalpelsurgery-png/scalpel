"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Scalpel membership has been invaluable for my professional development. The workshops and networking opportunities have helped me stay at the forefront of surgical innovation.",
    author: "Dr. Amanda Foster",
    role: "General Surgeon, Mayo Clinic",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The CME programs offered through Scalpel are comprehensive and clinically relevant. I've earned all my required credits while actually learning techniques I use in practice.",
    author: "Dr. Robert Kim",
    role: "Cardiothoracic Surgeon",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "As a resident, the student membership has given me access to resources I couldn't afford otherwise. The case study library alone is worth the investment.",
    author: "Dr. Lisa Martinez",
    role: "Surgical Resident",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function Testimonials() {
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
            What Our Members Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "relative bg-slate-50 rounded-xl md:rounded-2xl p-6 md:p-8",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/20 mb-3 md:mb-4" />

              <p className="text-slate-700 leading-relaxed mb-4 md:mb-6 italic text-sm md:text-base">
                {'"'}
                {testimonial.quote}
                {'"'}
              </p>

              <div className="flex items-center gap-3 md:gap-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-sm md:text-base">{testimonial.author}</div>
                  <div className="text-xs md:text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
