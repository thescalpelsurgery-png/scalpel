"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { width, height } = hero.getBoundingClientRect()
      const x = (clientX / width - 0.5) * 20
      const y = (clientY / height - 0.5) * 20

      hero.style.setProperty("--mouse-x", `${x}px`)
      hero.style.setProperty("--mouse-y", `${y}px`)
    }

    hero.addEventListener("mousemove", handleMouseMove)
    return () => hero.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900">
      <section
        ref={heroRef}
        className="relative w-full max-w-[1440px] overflow-hidden py-12 md:py-16 lg:py-20"
        style={{ ["--mouse-x" as string]: "0px", ["--mouse-y" as string]: "0px" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-primary/20 blur-3xl animate-pulse"
            style={{
              top: "10%",
              left: "10%",
              transform: "translate(calc(var(--mouse-x) * -1), calc(var(--mouse-y) * -1))",
            }}
          />
          <div
            className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-secondary/20 blur-3xl animate-pulse delay-1000"
            style={{
              bottom: "10%",
              right: "10%",
              transform: "translate(var(--mouse-x), var(--mouse-y))",
            }}
          />
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 bg-secondary text-secondary opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="space-y-6 md:space-y-8 animate-fade-in-up text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 text-white/80 text-xs md:text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Empowering Surgeons Worldwide
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
                Master Advanced{" "}
                <span className="bg-clip-text bg-gradient-to-r from-secondary to-primary text-card-foreground opacity-65">
                  Surgical Techniques
                </span>{" "}
                Through Expert-Led Education
              </h1>

              <p className="text-white/70 max-w-xl leading-relaxed mx-auto lg:mx-0 text-sm md:text-base">
                Join a comprehensive academic platform where interdisciplinary collaboration meets continuous
                professional development. Elevate your surgical expertise with evidence-based programs.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
                <Link href="/become-member" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="hover:bg-primary/90 text-white px-6 md:px-8 group w-full sm:w-auto bg-secondary"
                  >
                    Become a Member
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-6 md:px-8 bg-transparent w-full sm:w-auto"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Watch Overview
                </Button>
              </div>
            </div>

            <div className="relative mt-4 lg:mt-0">
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none aspect-square">
                {/* Floating Cards - Hidden on mobile, visible on tablet+ */}
                <div className="absolute top-4 right-0 md:top-10 md:right-0 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 animate-float z-20 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-sm md:text-base">95%</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm md:text-base">Success Rate</div>
                      <div className="text-white/60 text-xs md:text-sm">In surgical outcomes</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-16 left-0 md:bottom-20 md:left-0 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 animate-float-delayed z-20 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-white text-lg md:text-xl">✓</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm md:text-base">Certified</div>
                      <div className="text-white/60 text-xs md:text-sm">CME accredited</div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/surgical-team-performing-advanced-surgery-in-moder.jpg"
                    alt="Advanced Surgical Environment"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>

                {/* Decorative Ring - Hidden on very small screens */}
                <div className="absolute -inset-3 md:-inset-4 border-2 border-white/10 rounded-2xl md:rounded-3xl -z-0 hidden sm:block" />
                <div className="absolute -inset-6 md:-inset-8 border border-white/5 rounded-2xl md:rounded-3xl -z-0 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </section>
    </div>
  )
}
