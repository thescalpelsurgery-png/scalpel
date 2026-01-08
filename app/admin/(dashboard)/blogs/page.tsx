import { createClient } from "@/lib/supabase/server"
import { BlogsHeader } from "@/components/admin/blogs/blogs-header"
import { BlogsTable } from "@/components/admin/blogs/blogs-table"
import { BlogFormDialog } from "@/components/admin/blogs/blog-form-dialog"
import type { Blog } from "@/lib/types"

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string; action?: string; edit?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("blogs").select("*").order("created_at", { ascending: false })

  if (params.status === "published") {
    query = query.eq("is_published", true)
  } else if (params.status === "draft") {
    query = query.eq("is_published", false)
  }

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%`)
  }

  const { data: blogs } = await query

  // Get counts
  const { data: allBlogs } = await supabase.from("blogs").select("is_published, category")
  const counts = {
    all: allBlogs?.length || 0,
    published: allBlogs?.filter((b) => b.is_published).length || 0,
    draft: allBlogs?.filter((b) => !b.is_published).length || 0,
  }

  // Get unique categories
  const categories = [...new Set(allBlogs?.map((b) => b.category) || [])]

  // Get blog to edit if specified
  let editBlog: Blog | null = null
  if (params.edit) {
    const { data } = await supabase.from("blogs").select("*").eq("id", params.edit).single()
    editBlog = data as Blog
  }

  return (
    <div className="space-y-6">
      <BlogsHeader counts={counts} categories={categories} currentStatus={params.status || "all"} />
      <BlogsTable blogs={(blogs as Blog[]) || []} />
      <BlogFormDialog open={params.action === "new" || !!params.edit} blog={editBlog} />
    </div>
  )
}
