"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Search, Target, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
    {
        icon: Search,
        title: "Unconscious Incompetence",
        description: "Identifying the skill gap.",
        details: "The first step in any learning journey is recognizing what you don't yet know.",
        color: "bg-blue-500",
    },
    {
        icon: Target,
        title: "Conscious Incompetence",
        description: "Supervised practice.",
        details: "Building technique through deliberate, focused effort under the guidance of experts.",
        color: "bg-indigo-500",
    },
    {
        icon: Brain,
        title: "Conscious Competence",
        description: "Reliability and accuracy.",
        details: "Performing the skill accurately and consistently with conscious focus.",
        color: "bg-secondary",
    },
    {
        icon: Award,
        title: "Unconscious Competence",
        description: "Mastery and instinct.",
        details: "Where surgical technique becomes second nature, allowing focus on the patient and procedure.",
        color: "bg-primary",
    },
]

export function EducationalApproach() {
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
        <section ref={sectionRef} className="w-full py-16 md:py-24 bg-slate-900 text-white overflow-hidden">
            <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block text-secondary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
                        Educational Approach
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                        The SCALPEL Method
                    </h2>
                    <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                        We utilize the Psychological Hierarchy of Competence to ensure a student&apos;s skills move from conscious effort to instinctive reaction.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 via-primary/50 to-primary/20 -translate-y-12 z-0" />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className={cn(
                                "relative z-10 bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 group",
                                isVisible && "animate-fade-in-up"
                            )}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className={cn(
                                "w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                                step.color
                            )}>
                                <step.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                            <p className="text-secondary font-medium text-sm mb-4">{step.description}</p>
                            <p className="text-white/60 text-sm leading-relaxed">{step.details}</p>

                            <div className="absolute top-6 right-6 text-4xl md:text-5xl font-bold text-white/5 select-none pointer-events-none">
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
