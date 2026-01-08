import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogHero } from "@/components/blog/blog-hero"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Blog | Scalpel",
  description: "Stay updated with the latest news, research, and insights in the surgical world.",
}

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  // Map blogs to the format expected by BlogGrid
  const posts = (blogs || []).map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    author: blog.author,
    date: blog.published_at || blog.created_at,
    read_time: blog.read_time,
    category: blog.category,
    image: blog.image_url,
  }))

  return (
    <>
      <BlogHero />
      <section className="w-full py-8 sm:py-12 md:py-16 bg-slate-50">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  )
}
