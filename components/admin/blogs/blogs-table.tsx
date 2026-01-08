"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Blog } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Star, StarOff, Loader2, ExternalLink } from "lucide-react"

interface BlogsTableProps {
  blogs: Blog[]
}

export function BlogsTable({ blogs }: BlogsTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const togglePublished = async (id: string, isPublished: boolean) => {
    setIsLoading(id)
    const supabase = createClient()
    await supabase
      .from("blogs")
      .update({
        is_published: !isPublished,
        published_at: !isPublished ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
    router.refresh()
    setIsLoading(null)
  }

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    setIsLoading(id)
    const supabase = createClient()
    await supabase.from("blogs").update({ is_featured: !isFeatured, updated_at: new Date().toISOString() }).eq("id", id)
    router.refresh()
    setIsLoading(null)
  }

  const deleteBlog = async () => {
    if (!deleteId) return
    setIsLoading(deleteId)
    const supabase = createClient()
    await supabase.from("blogs").delete().eq("id", deleteId)
    router.refresh()
    setDeleteId(null)
    setIsLoading(null)
  }

  const editBlog = (id: string) => {
    router.push(`/admin/blogs?edit=${id}`)
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No blog posts found</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      {blog.title}
                      {blog.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <div className="text-sm text-slate-500 sm:hidden">{blog.author}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{blog.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {blog.is_published ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-500">
                    {blog.published_at
                      ? new Date(blog.published_at).toLocaleDateString()
                      : new Date(blog.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading === blog.id}>
                          {isLoading === blog.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editBlog(blog.id)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {blog.is_published && (
                          <DropdownMenuItem asChild>
                            <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Post
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => togglePublished(blog.id, blog.is_published)}>
                          {blog.is_published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(blog.id, blog.is_featured)}>
                          {blog.is_featured ? (
                            <>
                              <StarOff className="w-4 h-4 mr-2" />
                              Remove Featured
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Mark Featured
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(blog.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBlog} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
