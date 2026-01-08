"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { PlayCircle, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function PastEventsClient({ events }: { events: any[] }) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    if (!events || events.length === 0) {
        return null
    }

    return (
        <section ref={sectionRef} className="w-full py-12 md:py-16 bg-white">
            <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12">
                    <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
                        Event Archive
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Past Events</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base px-2">
                        Missed an event? Access recordings and materials from our previous programs.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className={cn(
                                "group relative bg-slate-50 rounded-lg md:rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300",
                                isVisible && "animate-fade-in-up",
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-28 md:h-40">
                                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {event.has_recording && <PlayCircle className="w-8 h-8 md:w-12 md:h-12 text-white" />}
                                </div>
                                {event.has_recording && (
                                    <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-primary text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                                        Recording
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3 md:p-4">
                                <h3 className="font-semibold text-slate-900 mb-2 md:mb-3 line-clamp-2 text-xs md:text-sm">
                                    {event.title}
                                </h3>
                                <div className="flex items-center justify-between text-[10px] md:text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    {event.attendees && (
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            {event.attendees}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
