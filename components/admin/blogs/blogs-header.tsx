"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Plus } from "lucide-react"
import { useState } from "react"

interface BlogsHeaderProps {
  counts: {
    all: number
    published: number
    draft: number
  }
  categories: string[]
  currentStatus: string
}

const statusTabs = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
]

export function BlogsHeader({ counts, currentStatus }: BlogsHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    router.push(`/admin/blogs?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/admin/blogs?${params.toString()}`)
  }

  const openNewBlogDialog = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("action", "new")
    router.push(`/admin/blogs?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Blog Posts
          </h2>
          <p className="text-slate-600 mt-1">Create and manage blog content</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-48"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <Button onClick={openNewBlogDialog}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={currentStatus === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(tab.key)}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({counts[tab.key as keyof typeof counts]})</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
