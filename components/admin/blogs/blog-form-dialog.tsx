"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Blog } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Upload, X } from "lucide-react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface BlogFormDialogProps {
  open: boolean
  blog: Blog | null
}

const categories = [
  "Surgical Techniques",
  "Research",
  "Education",
  "Technology",
  "Patient Care",
  "Career Development",
  "News",
]

export function BlogFormDialog({ open, blog }: BlogFormDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    author_role: "",
    author_image: "",
    category: "",
    image_url: "",
    read_time: "",
    is_featured: false,
    is_published: false,
  })

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        author_role: blog.author_role || "",
        author_image: blog.author_image || "",
        category: blog.category,
        image_url: blog.image_url || "",
        read_time: blog.read_time || "",
        is_featured: blog.is_featured,
        is_published: blog.is_published,
      })
      setImageType("url")
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        author_role: "",
        author_image: "",
        category: "",
        image_url: "",
        read_time: "",
        is_featured: false,
        is_published: false,
      })
      setImageType("url")
      setUploadFile(null)
    }
  }, [blog])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: blog ? formData.slug : generateSlug(title),
    })
  }

  const handleClose = () => {
    router.push("/admin/blogs")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `blogs/${fileName}`

    const { error: uploadError } = await supabase.storage.from("scalpel").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("scalpel").getPublicUrl(filePath)
    return data.publicUrl
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      let finalImageUrl = formData.image_url

      if (imageType === "upload" && uploadFile) {
        finalImageUrl = await handleImageUpload(uploadFile)
      }

      const data = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        author_role: formData.author_role || null,
        author_image: formData.author_image || null,
        category: formData.category,
        image_url: finalImageUrl || null,
        read_time: formData.read_time || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      if (blog) {
        const { error: updateError } = await supabase.from("blogs").update(data).eq("id", blog.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("blogs").insert(data)
        if (insertError) {
          if (insertError.code === "23505") {
            throw new Error("A blog post with this slug already exists")
          }
          throw insertError
        }
      }

      router.push("/admin/blogs")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="post-url-slug"
            />
            <p className="text-xs text-slate-500">This will be the URL: /blog/{formData.slug || "..."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time">Read Time</Label>
              <Input
                id="read_time"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="e.g., 5 min read"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              required
              placeholder="Brief summary of the post..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_role">Author Role</Label>
              <Input
                id="author_role"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                placeholder="Chief Surgeon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_image">Author Image URL</Label>
              <Input
                id="author_image"
                type="url"
                value={formData.author_image}
                onChange={(e) => setFormData({ ...formData, author_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Featured Image</Label>
            <RadioGroup
              value={imageType}
              onValueChange={(value) => setImageType(value as "url" | "upload")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="img-url" />
                <Label htmlFor="img-url">Image URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="img-upload" />
                <Label htmlFor="img-upload">Upload Image</Label>
              </div>
            </RadioGroup>

            {imageType === "url" ? (
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {uploadFile && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      <span>{uploadFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {blog?.image_url && !uploadFile && (
                  <p className="text-xs text-slate-500">
                    Current image will be kept if no new file is uploaded.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked as boolean })}
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Featured post
              </Label>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : blog ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
