"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

const categories = ["All Events", "Workshops", "Conferences", "Masterclasses", "Webinars", "Symposiums"]

export function EventsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAllCategories, setShowAllCategories] = useState(false)

  const initialCategory = searchParams.get("category") || "All Events"
  const initialSearch = searchParams.get("search") || ""

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const debouncedSearch = useDebounce(searchTerm, 500)

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 3)

  // Sync category with URL
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    if (category && category !== "All Events") {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [debouncedSearch, router]) // searchParams intentionally omitted to avoid loops

  return (
    <section className="w-full py-4 sm:py-6 md:py-8 bg-white border-b border-slate-100 sticky top-14 sm:top-16 lg:top-18 z-40">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Search Row */}
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <Input
                placeholder="Search events..."
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-11 sm:w-11 bg-transparent shrink-0 text-black">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Mobile: Show limited categories with expand option */}
            <div className="flex flex-wrap gap-2 sm:hidden">
              {visibleCategories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "text-xs h-8 px-3",
                    activeCategory === category ? "bg-primary text-white" : "hover:bg-primary/10 bg-transparent text-black",
                  )}
                >
                  {category}
                </Button>
              ))}
              {!showAllCategories && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllCategories(true)}
                  className="text-xs h-8 px-3 bg-transparent text-black"
                >
                  +{categories.length - 3} more
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>

            {/* Desktop: Show all categories */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4",
                    activeCategory === category ? "bg-primary text-white" : "hover:bg-primary/10 bg-transparent text-black",
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
