"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const featuredPost = {
  id: 1,
  title: "Revolutionary Advances in Robotic-Assisted Minimally Invasive Surgery",
  excerpt:
    "Exploring how the latest generation of surgical robots is transforming patient outcomes and enabling procedures previously thought impossible through minimally invasive approaches.",
  author: "Dr. Sarah Mitchell",
  date: "December 1, 2025",
  readTime: "8 min read",
  category: "Innovation",
  image: "/placeholder.svg?height=500&width=1000",
}

export function FeaturedPost() {
  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/blog/${featuredPost.id}`}
          className="group block relative bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 items-center">
            {/* Image */}
            <div className="relative h-48 sm:h-64 lg:h-96">
              <Image
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent lg:hidden" />
            </div>

            {/* Content */}
            <div className="relative p-5 md:p-8 lg:p-12">
              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                <Badge className="bg-secondary text-white text-xs">Featured</Badge>
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  {featuredPost.category}
                </Badge>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-secondary transition-colors line-clamp-3">
                {featuredPost.title}
              </h2>

              <p className="text-white/70 leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-white/60 mb-4 md:mb-6">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="truncate">{featuredPost.author}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {featuredPost.readTime}
                </div>
              </div>

              <span className="inline-flex items-center text-white font-medium group-hover:text-secondary transition-colors text-sm md:text-base">
                Read Article
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
