"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Student",
    price: "$99",
    period: "/year",
    description: "For medical students and residents beginning their surgical journey.",
    features: [
      "Access to online learning library",
      "Student-focused webinars",
      "Career development resources",
      "Newsletter subscription",
      "Community forum access",
    ],
    cta: "Start Learning",
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "/year",
    description: "For practicing surgeons seeking continuous professional development.",
    features: [
      "Everything in Student, plus:",
      "Unlimited CME credit courses",
      "Priority event registration",
      "Exclusive member workshops",
      "Research publication access",
      "Networking events",
      "Certificate programs",
    ],
    cta: "Become a Member",
    popular: true,
  },
  {
    name: "Institution",
    price: "$1,999",
    period: "/year",
    description: "For hospitals and medical institutions training surgical teams.",
    features: [
      "Everything in Professional, plus:",
      "Up to 25 team members",
      "Custom training programs",
      "On-site workshop options",
      "Analytics dashboard",
      "Dedicated account manager",
      "Group certification programs",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingPlans() {
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Choose Your Membership Plan</h2>
          <p className="text-slate-600 text-lg">
            Select the plan that best fits your career stage and professional development goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "relative bg-white rounded-2xl p-8 transition-all duration-500",
                plan.popular
                  ? "border-2 border-primary shadow-xl scale-105 z-10"
                  : "border border-slate-200 shadow-sm hover:shadow-lg",
                isVisible && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-slate-600 text-sm mt-3">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900",
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
