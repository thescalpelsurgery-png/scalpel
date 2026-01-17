"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string | number
  slug: string
  title: string
  excerpt: string | null
  author: { name: string } | string | null
  date: string
  read_time: string | null
  category: string | null
  image: string | null
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
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
    <div ref={sectionRef} className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Latest Articles
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Stay updated with the latest in surgical innovation and clinical research.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className={cn(
              "group relative flex flex-col bg-white rounded-none overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2",
              isVisible && "animate-fade-in-up",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {post.category && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white/95 backdrop-blur-md text-primary font-bold px-3 py-1 shadow-lg border-0">
                    {post.category}
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 md:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                {post.read_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.read_time}
                  </span>
                )}
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h3>

              <p className="text-slate-600 text-base mb-6 line-clamp-3 leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                    {typeof post.author === 'object' && post.author ? post.author.name : post.author || "Unknown"}
                  </span>
                </div>

                <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>


    </div>
  )
}
