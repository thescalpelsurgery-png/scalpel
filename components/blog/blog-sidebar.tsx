"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, TrendingUp, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Innovation", count: 24 },
  { name: "Technology", count: 18 },
  { name: "Patient Care", count: 15 },
  { name: "Education", count: 12 },
  { name: "Research", count: 21 },
  { name: "Leadership", count: 8 },
]

const popularPosts = [
  {
    id: 1,
    title: "Revolutionary Advances in Robotic-Assisted Surgery",
    date: "Dec 1, 2025",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "Understanding AI in Surgical Planning",
    date: "Nov 28, 2025",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    title: "Best Practices for Post-Operative Care",
    date: "Nov 25, 2025",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const tags = [
  "Robotic Surgery",
  "Minimally Invasive",
  "AI",
  "Patient Safety",
  "Training",
  "Research",
  "Innovation",
  "CME",
  "Best Practices",
]

export function BlogSidebar() {
  const [email, setEmail] = useState("")

  return (
    <aside className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Search */}
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Search Articles</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search..." className="pl-10 h-10 text-sm" />
        </div>
      </div>

      {/* Categories - Horizontal scroll on mobile */}
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Tag className="w-4 h-4 text-primary" />
          Categories
        </h3>
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:hidden scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/blog/category/${category.name.toLowerCase()}`}
              className="flex-shrink-0 text-xs bg-slate-100 hover:bg-primary hover:text-white px-3 py-2 rounded-full transition-colors"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
        {/* Desktop: List */}
        <ul className="hidden lg:block space-y-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/blog/category/${category.name.toLowerCase()}`}
                className="flex items-center justify-between text-slate-600 hover:text-primary transition-colors text-sm"
              >
                <span>{category.name}</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <TrendingUp className="w-4 h-4 text-primary" />
          Popular Articles
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {popularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="flex gap-3 group">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={60}
                height={60}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <span className="text-[10px] sm:text-xs text-slate-500">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`}
              className="text-[10px] sm:text-xs bg-slate-100 hover:bg-primary hover:text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 sm:p-5 lg:p-6 text-white">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">Subscribe to Newsletter</h3>
        <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
          Get the latest articles delivered to your inbox.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEmail("")
          }}
          className="space-y-2 sm:space-y-3"
        >
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-10 text-sm"
          />
          <Button className="w-full bg-white text-primary hover:bg-white/90 h-10 text-sm">Subscribe</Button>
        </form>
      </div>
    </aside>
  )
}
