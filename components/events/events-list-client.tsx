"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Define Event type based on usage (since we don't have a shared type file handy yet, verifying from original code)
// The original code uses: id, title, description, date, end_date, location, type, image_url, capacity, is_featured, registration_link...
type Event = {
    id: string
    title: string
    description: string
    content?: string
    date: string
    time?: string
    end_date?: string
    location: string
    type: string
    image_url?: string
    capacity?: number
    registration_link?: string
    is_featured: boolean
    is_past: boolean
    is_draft?: boolean
    is_summit_2026?: boolean
    created_at: string
    updated_at: string
}

interface EventsListClientProps {
    events: Event[]
}

export function EventsListClient({ events }: EventsListClientProps) {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

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
        return (
            <section className="w-full py-8 sm:py-12 md:py-16 bg-slate-50">
                <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <p className="text-slate-500">No upcoming events at this time. Check back soon!</p>
                    </div>
                </div>
            </section>
        )
    }

    const featuredEvents = events.filter((e) => e.is_featured)
    const regularEvents = events.filter((e) => !e.is_featured)

    const formatDate = (dateStr: string, endDateStr?: string) => {
        const date = new Date(dateStr)
        const endDate = endDateStr ? new Date(endDateStr) : null

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]

        if (endDate && date.getMonth() === endDate.getMonth()) {
            return `${monthNames[date.getMonth()]} ${date.getDate()}-${endDate.getDate()}, ${date.getFullYear()}`
        }
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }

    const getSpotsLeft = (capacity?: number) => {
        if (!capacity) return "Limited spots"
        return `${capacity} spots available`
    }

    return (
        <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 bg-slate-50">
            <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 md:mb-12 gap-1 sm:gap-2">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Upcoming Events</h2>
                        <p className="text-slate-600 mt-1 text-xs sm:text-sm md:text-base">
                            Find and register for our upcoming programs
                        </p>
                    </div>
                    <span className="text-slate-500 text-xs sm:text-sm">{events.length} events found</span>
                </div>

                {/* Featured Events */}
                {featuredEvents.length > 0 && (
                    <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12 ">
                        {featuredEvents.map((event, index) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className={cn(
                                    "group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100",
                                    isVisible && "animate-fade-in-up",
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex flex-col sm:flex-row border border-grey">
                                    {/* Image */}
                                    <div className="relative w-full sm:w-3/5 lg:w-3/5 aspect-video shrink-0">
                                        <Image
                                            src={event.image_url || "/placeholder.svg?height=400&width=600"}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-secondary text-white text-xs">Featured</Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col">
                                        <Badge variant="outline" className="mb-2 w-fit text-xs">
                                            {event.type}
                                        </Badge>

                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-600 text-xs sm:text-sm mb-3 md:mb-4 line-clamp-2 flex-grow">
                                            {event.description}
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 mb-3 md:mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                <span className="truncate">{formatDate(event.date, event.end_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                                <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                {getSpotsLeft(event.capacity)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                            <Button
                                                size="sm"
                                                className="group/btn bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                                            >
                                                Register Now
                                                <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Regular Events */}
                {regularEvents.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {regularEvents.map((event, index) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className={cn(
                                    "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100",
                                    isVisible && "animate-fade-in-up",
                                )}
                                style={{ animationDelay: `${(index + featuredEvents.length) * 100}ms` }}
                            >
                                {/* Image */}
                                <div className="relative aspect-video">
                                    <Image
                                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-primary text-white text-xs">{event.type}</Badge>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-5">
                                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span className="truncate">{formatDate(event.date, event.end_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="text-xs text-slate-400">{getSpotsLeft(event.capacity)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
