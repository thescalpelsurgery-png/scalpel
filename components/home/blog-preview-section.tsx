import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export async function BlogPreviewSection() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4">
              Latest Insights
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-balance">From Our Blog</h2>
          </div>
          <Link href="/blog" className="w-full sm:w-auto">
            <Button variant="outline" className="group bg-transparent w-full sm:w-auto">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {blogs.map((blog, index) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={blog.image_url || "/placeholder.svg?height=300&width=500"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <Badge className="bg-primary text-white text-xs font-semibold">{blog.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <h3 className="text-base md:text-xl font-semibold text-slate-900 mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-slate-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">{blog.author}</span>
                  </div>
                  {blog.read_time && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.read_time}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
