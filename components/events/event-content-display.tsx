"use client"

import { EventSection } from "@/lib/types"
import { Facebook, Linkedin, Twitter, Users, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, Circle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EventContentDisplayProps {
    content: string
}

export function EventContentDisplay({ content }: EventContentDisplayProps) {
    let sections: EventSection[] = []
    let isLegacyHtml = false

    try {
        if (content.trim().startsWith("[")) {
            sections = JSON.parse(content)
        } else {
            isLegacyHtml = true
        }
    } catch (e) {
        isLegacyHtml = true
    }

    if (isLegacyHtml) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-primary">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        )
    }

    return (
        <div className="space-y-8 md:space-y-12 w-full max-w-full overflow-hidden">
            {sections.map(section => (
                <SectionRenderer key={section.id} section={section} />
            ))}
        </div>
    )
}

function SectionRenderer({ section }: { section: EventSection }) {
    const { type, content } = section

    switch (type) {
        case "heading":
            return (
                <div className="relative mt-8 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 z-10 relative inline-block max-w-full break-words">
                        {content.text}
                        <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full opacity-80" />
                    </h2>
                </div>
            )

        case "text":
            return (
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg break-words">
                    <p>{content.text}</p>
                </div>
            )

        case "bullets":
            return (
                <ul className="grid gap-0">
                    {(content.items || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100/50 hover:bg-slate-100 transition-colors">
                            <Circle className="w-3 h-3 text-primary shrink-0 " />
                            <span className="leading-relaxed break-words">{item}</span>
                        </li>
                    ))}
                </ul>
            )

        case "image":
            // Default to video (16:9) if not specified
            const imageAspectClass = content.aspectRatio === "portrait"
                ? "aspect-[3/4] max-w-lg mx-auto"
                : content.aspectRatio === "square"
                    ? "aspect-square max-w-xl mx-auto"
                    : "aspect-video w-full"; // default 16:9

            return (
                <div className={`rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 my-8 group bg-slate-100 ${content.aspectRatio !== 'portrait' && content.aspectRatio !== 'square' ? 'w-full' : ''}`}>
                    <div className={`relative ${imageAspectClass} overflow-hidden`}>
                        {content.url ? (
                            <img
                                src={content.url}
                                alt={content.alt || "Event image"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No image provided
                            </div>
                        )}
                    </div>
                    {content.caption && (
                        <div className="bg-white/95 backdrop-blur-sm p-4 border-t border-slate-100">
                            <p className="text-sm text-center text-slate-600 font-medium italic">
                                {content.caption}
                            </p>
                        </div>
                    )}
                </div>
            )

        case "table":
            return (
                <div className="rounded-3xl border border-slate-200 overflow-hidden my-10 shadow-lg shadow-slate-100/50 bg-white w-full max-w-[90vw] md:max-w-full mx-auto">
                    <div className="overflow-x-auto w-full custom-scrollbar p-1">
                        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    {(content.columns || []).map((col: string, idx: number) => (
                                        <th key={idx} className="px-8 py-5 font-extrabold tracking-wider text-slate-800 bg-slate-50 sticky top-0">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(content.rows || []).map((row: string[], rIdx: number) => (
                                    <tr key={rIdx} className="bg-white hover:bg-slate-50/50 transition-colors group">
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-8 py-5 font-medium text-slate-600 whitespace-nowrap group-hover:text-slate-900 transition-colors leading-relaxed">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )

        case "grid":
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
                    {(content.images || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group bg-slate-100 border border-slate-200">
                            <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                    ))}
                </div>
            )

        case "slider":
            return <EventSlider images={content.images || []} aspectRatio={content.aspectRatio} />

        case "leadership":
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
                    {(content.members || []).map((member: any, idx: number) => (
                        <div key={idx} className="group flex flex-col items-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 mb-6 shadow-inner ring-4 ring-transparent group-hover:ring-primary/5 transition-all duration-300">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Users className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mb-4 w-full">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors break-words">{member.name}</h3>
                                <p className="text-sm font-medium text-primary/80 uppercase tracking-wide">{member.role}</p>
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4">{member.bio}</p>

                            <div className="flex gap-4 justify-center mt-auto">
                                {member.links?.x && (
                                    <Link href={member.links.x} target="_blank" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                                        <span className="sr-only">X (Twitter)</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </Link>
                                )}
                                {member.links?.linkedin && (
                                    <Link href={member.links.linkedin} target="_blank" className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-blue-50 rounded-full transition-all">
                                        <Linkedin className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )

        default:
            return null
    }
}

function EventSlider({ images, aspectRatio = "video" }: { images: string[], aspectRatio?: "video" | "portrait" | "square" }) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length)
    }, [images.length])

    const prev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length)
    }

    useEffect(() => {
        if (!isPaused && images.length > 1) {
            timerRef.current = setInterval(next, 5000)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isPaused, next, images.length])

    if (!images.length) return null

    // Determine config based on aspect ratio
    const aspectClass = aspectRatio === "portrait"
        ? "aspect-[3/4] max-w-lg mx-auto"
        : aspectRatio === "square"
            ? "aspect-square max-w-xl mx-auto"
            : "aspect-video w-full"; // default 16:9

    return (
        <div
            className={`rounded-3xl overflow-hidden shadow-2xl relative group bg-slate-900 my-8 ${aspectClass}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${current * 100}%)` }}>
                {images.map((img, idx) => (
                    <div key={idx} className="min-w-full h-full relative">
                        <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                    </div>
                ))}
            </div>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:scale-110 z-10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:scale-110 z-10"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    current === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isPaused ? <Pause className="w-4 h-4 text-white/70" /> : <Play className="w-4 h-4 text-white/70" />}
                    </div>
                </>
            )}
        </div>
    )
}
