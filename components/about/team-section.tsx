"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Linkedin, Mail, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"

const teamMembers = [
  {
    name: "Dr. Muhammad Iltaf",
    role: "President",
    image: "/iltaf.jpg",
    bio: "Visionary leader driving surgical excellence and training innovation.",
    linkedin: "#",
    email: "Dr.iltafsafi99@gmail.com",
    orcid: "https://orcid.org/0000-0003-4985-603X",

  },
  {
    name: "Dr. Shahab Afridi",
    role: "Director",
    image: "/shahab.jpg",
    bio: "Leading expert in surgical simulation and professional development.",
    linkedin: "https://www.linkedin.com/in/shahabafridi915",
    email: "shahab.afridi915@gmail.com",
    orcid: "https://orcid.org/0009-0005-1217-7625",

  },
  {
    name: "Sarmad Nazir",
    role: "Finance & Strategy Executive",
    image: "/sarmad.png",
    bio: "Managing strategy and growth for a national network of surgical excellence.",
    linkedin: "https://www.linkedin.com/in/sarmadnazir",
    email: "sarmadnazir49@gmail.com",
    orcid: "https://orcid.org/0009-0005-3250-7417",

  },
  {
    name: "Hira Shehzad",
    role: "Media & PR Executive",
    image: "/girl.png",
    bio: "Expert in media relations and public awareness for surgical education.",
    linkedin: "https://www.linkedin.com/in/hirashehzad",
    email: "xhira.shahzadx@gmail.com",
    orcid: "https://orcid.org/0009-0000-5570-3094",

  },
]

export function TeamSection() {
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
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
            Our Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
            Meet the Team Behind Scalpel
          </h2>
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed px-2">
            Our leadership team brings together decades of surgical expertise, educational innovation, and a shared
            passion for advancing the field.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={cn("group text-center", isVisible && "animate-fade-in-up")}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-6 rounded-full overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
              </div>

              {/* Info */}
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-900 mb-0.5 md:mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-medium text-xs md:text-sm mb-1 md:mb-3 px-1">{member.role}</p>
              <p className="text-slate-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 px-1 hidden sm:block">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-2 md:gap-3">
                {member.linkedin && member.linkedin !== "#" && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                )}
                {member.orcid && member.orcid !== "#" && (
                  <a
                    href={member.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <ScrollText className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
