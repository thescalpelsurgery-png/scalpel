"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
    id: string
    title: string
    image_url: string
    date: string
    location: string
    is_past: boolean
}

export function PastEventsSlider() {
    const [events, setEvents] = useState<Event[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        async function fetchPastEvents() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("events")
                .select("id, title, image_url, date, location, is_past")
                .eq("is_past", true)
                .order("date", { ascending: false })
                .limit(6)

            if (!error && data) {
                setEvents(data)
            }
            setLoading(false)
        }

        fetchPastEvents()
    }, [])

    // Auto-play logic
    useEffect(() => {
        if (!isAutoPlaying || events.length === 0) return

        const interval = setInterval(() => {
            nextSlide()
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, events.length, currentIndex])

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (events.length === 0) {
        return null
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)
    }

    const getVisibleEvents = () => {
        const result = []
        for (let i = 0; i < events.length; i++) {
            result.push(events[(currentIndex + i) % events.length])
        }
        return result
    }

    const visibleEvents = getVisibleEvents()

    return (
        <section
            className="w-full py-12 bg-slate-50 overflow-hidden relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-center items-center text-center mb-16 gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-[2px] bg-primary"></span>
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Past Experiences</span>
                            <span className="w-12 h-[2px] bg-primary"></span>

                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.2]"
                        >
                            Surgery <span className="text-primary italic">Excellence</span> <br /> In Motion
                        </motion.h2>
                    </div>
                </div>
                <div className="flex gap-4 mb-4 justify-end">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            prevSlide()
                            setIsAutoPlaying(false)
                        }}
                        className="group relative overflow-hidden rounded-full w-14 h-14 border-2 border-primary/20 hover:border-primary transition-all duration-500"
                    >
                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                        <ArrowLeft className="w-6 h-6 relative z-10 group-hover:text-white transition-colors duration-500" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            nextSlide()
                            setIsAutoPlaying(false)
                        }}
                        className="group relative overflow-hidden rounded-full w-14 h-14 border-2 border-primary/20 hover:border-primary transition-all duration-500"
                    >
                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                        <ArrowRight className="w-6 h-6 relative z-10 group-hover:text-white transition-colors duration-500" />
                    </Button>
                </div>
                <div className="relative">
                    <div className="flex gap-6 md:gap-8 perspective-1000">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visibleEvents.map((event, index) => {
                                const isVisible = index < 3
                                if (!isVisible) return null

                                const isCenter = index === 1

                                return (
                                    <motion.div
                                        key={event.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.7, rotateY: 30, x: 100 }}
                                        animate={{
                                            opacity: isCenter ? 1 : 0.9,
                                            scale: isCenter ? 1.05 : 0.85,
                                            rotateY: index === 0 ? 15 : index === 2 ? -15 : 0,
                                            x: 0,
                                            zIndex: isCenter ? 10 : index === 0 ? 5 : 5
                                        }}
                                        exit={{ opacity: 0, scale: 0.7, rotateY: -30, x: -100 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 25,
                                            duration: 0.6
                                        }}
                                        className={`relative w-full mx-auto md:w-3/10 flex-shrink-0 group ${index !== 1 ? 'hidden md:block' : ''}`}
                                    >
                                        <div className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 ${!isCenter ? 'grayscale-[0.5]' : ''}`}>
                                            <Image
                                                src={event.image_url || "/placeholder.jpg"}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-125"
                                            />
                                            {/* Dimming overlay for non-active cards */}
                                            {!isCenter && (
                                                <div className="absolute inset-0 bg-slate-900/40 z-10 pointer-events-none transition-opacity duration-500"></div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 z-20">
                                                <div className="transform transition-all duration-500 group-hover:translate-y-[-10px]">
                                                    <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
                                                        {new Date(event.date).getFullYear()}
                                                    </span>
                                                    <h3 className={`font-bold text-white mb-4 line-clamp-2 drop-shadow-lg transition-all duration-500 ${isCenter ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                                                        {event.title}
                                                    </h3>
                                                    <div className={`flex flex-col gap-2 text-white/70 text-sm transition-opacity duration-500 ${isCenter ? 'group-hover:opacity-100' : 'opacity-0'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-primary" />
                                                            <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-primary" />
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-20 flex justify-center items-center gap-4">
                    <div className="h-[2px] w-20 bg-slate-200"></div>
                    <div className="flex gap-3">
                        {events.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`group relative h-3 rounded-full transition-all duration-500 ${index === currentIndex
                                    ? "w-12 bg-primary"
                                    : "w-3 bg-slate-300 hover:bg-primary/40"
                                    }`}
                            >
                                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                    Event 0{index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="h-[2px] w-20 bg-slate-200"></div>
                </div>
            </div>

            {/* Hyper-realistic Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </section>
    )
}
