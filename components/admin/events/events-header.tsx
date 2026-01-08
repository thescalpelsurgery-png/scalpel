"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Plus } from "lucide-react"
import { useState } from "react"

interface EventsHeaderProps {
  counts: {
    all: number
    conference: number
    workshop: number
    seminar: number
    webinar: number
    training: number
  }
  currentType: string
}

const typeTabs = [
  { key: "all", label: "All" },
  { key: "conference", label: "Conference" },
  { key: "workshop", label: "Workshop" },
  { key: "seminar", label: "Seminar" },
  { key: "webinar", label: "Webinar" },
  { key: "training", label: "Training" },
]

export function EventsHeader({ counts, currentType }: EventsHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === "all") {
      params.delete("type")
    } else {
      params.set("type", type)
    }
    router.push(`/admin/events?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/admin/events?${params.toString()}`)
  }

  const openNewEventDialog = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("action", "new")
    router.push(`/admin/events?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events
          </h2>
          <p className="text-slate-600 mt-1">Manage conferences, workshops, and seminars</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-48"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <Button onClick={openNewEventDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={currentType === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(tab.key)}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({counts[tab.key as keyof typeof counts]})</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
