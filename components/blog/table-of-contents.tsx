"use client"

import { useEffect, useState } from "react"
import { List } from "lucide-react"

interface TocItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        // Parse headings from HTML content
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, "text/html")
        const h2s = doc.querySelectorAll("h2, h3")

        const items: TocItem[] = []
        h2s.forEach((heading, index) => {
            const id = `heading-${index}`
            const text = heading.textContent || ""
            const level = heading.tagName === "H2" ? 2 : 3
            if (text.trim()) {
                items.push({ id, text, level })
            }
        })
        setHeadings(items)
    }, [content])

    useEffect(() => {
        // Add IDs to actual headings in the DOM
        const articleHeadings = document.querySelectorAll("article h2, article h3")
        articleHeadings.forEach((heading, index) => {
            heading.id = `heading-${index}`
        })

        // Intersection observer for active section
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-20% 0px -60% 0px" }
        )

        articleHeadings.forEach((heading) => observer.observe(heading))

        return () => observer.disconnect()
    }, [headings])

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({ top: elementPosition - offset, behavior: "smooth" })
        }
    }

    if (headings.length === 0) return null

    return (
        <nav className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                Table of Contents
            </h3>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={heading.level === 3 ? "ml-4" : ""}
                    >
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={`text-left w-full text-sm transition-all duration-200 hover:text-primary py-1 px-2 rounded-lg hover:bg-primary/5 ${activeId === heading.id
                                    ? "text-primary font-semibold bg-primary/10"
                                    : "text-slate-600"
                                }`}
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
