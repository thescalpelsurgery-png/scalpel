"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Event } from "@/lib/types"

export function SummitPopup({ event }: { event: Event | null }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (event) {
            // No session storage check - opens every time
            const timer = setTimeout(() => {
                setOpen(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [event])

    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[800px] p-0 border-none bg-transparent shadow-2xl overflow-hidden text-white min-h-[400px] sm:h-[450px]">
                {/* Visually hidden title for accessibility */}
                <DialogTitle className="sr-only">{event.title}</DialogTitle>

                {/* Main Container with Glassmorphism */}
                <div className="relative w-full h-full flex flex-col sm:flex-row bg-[#0b0f19]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">

                    {/* Left Side: Content & Title */}
                    <div className="flex-1 p-6 sm:p-10 flex flex-col justify-end relative z-10 order-2 sm:order-1">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                            <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full bg-blue-500 blur-[80px]" />
                            <div className="absolute bottom-[-20%] right-[20%] w-[200px] h-[200px] rounded-full bg-purple-500 blur-[60px]" />
                        </div>

                        <div className="relative pt-4 sm:pt-0">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-medium tracking-wider mb-3 sm:mb-4 border border-blue-500/20">
                                UPCOMING SUMMIT
                            </span>

                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                {event.title}
                            </h2>

                            <p className="text-white/60 mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-2 text-sm sm:text-base leading-relaxed">
                                {event.description}
                            </p>

                            <Link href={`/events/${event.id}`}>
                                <Button onClick={() => setOpen(false)} className="w-full sm:w-auto rounded-full px-6 py-5 sm:px-8 sm:py-6 bg-white text-black hover:bg-white/90 font-semibold group transition-all text-sm sm:text-base">
                                    Register Now
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Image & Info */}
                    <div className="relative w-full sm:w-[350px] h-[180px] sm:h-auto order-1 sm:order-2 flex flex-col">

                        {/* Image Area */}
                        <div className="relative flex-1 w-full h-full">
                            <Image
                                src={event.image_url || "/placeholder.svg"}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] to-transparent sm:bg-gradient-to-l sm:from-transparent sm:to-[#0b0f19]/80" />
                        </div>

                        {/* Info Area */}
                        <div className="absolute bottom-0 left-0 w-full sm:relative bg-gradient-to-t from-black/80 to-transparent sm:bg-black/40 sm:backdrop-blur-md p-4 sm:p-6 space-y-3 sm:space-y-4 sm:border-t-0 sm:border-l border-white/5 sm:h-auto sm:flex sm:flex-col sm:justify-end">

                            <div className="flex items-center sm:items-start gap-3 text-white/90">
                                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg shrink-0 backdrop-blur-sm">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm">Date & Time</p>
                                    <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center sm:items-start gap-3 text-white/90">
                                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg shrink-0 backdrop-blur-sm">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm">Location</p>
                                    <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 line-clamp-1">{event.location}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
