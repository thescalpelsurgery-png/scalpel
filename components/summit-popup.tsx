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
            <DialogContent className="max-w-[95vw] sm:max-w-[900px] p-0 border-none bg-transparent shadow-2xl overflow-hidden text-white">
                {/* Visually hidden title for accessibility */}
                <DialogTitle className="sr-only">{event.title}</DialogTitle>

                {/* Main Container with Glassmorphism */}
                <div className="relative w-full flex flex-col sm:flex-row bg-[#0b0f19]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">

                    {/* Left Side: Content & Title */}
                    <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center relative z-10 order-2 sm:order-1 min-h-[300px]">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                            <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full bg-blue-500 blur-[80px]" />
                            <div className="absolute bottom-[-20%] right-[20%] w-[200px] h-[200px] rounded-full bg-purple-500 blur-[60px]" />
                        </div>

                        <div className="relative">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-medium tracking-wider mb-3 sm:mb-4 border border-blue-500/20">
                                UPCOMING SUMMIT
                            </span>

                            <h2 className="text-2xl sm:text-4xl font-bold leading-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                {event.title}
                            </h2>

                            <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                                {event.description}
                            </p>

                            <Link href={`/events/${event.id}`}>
                                <Button onClick={() => setOpen(false)} className="w-full sm:w-auto rounded-full px-6 py-5 sm:px-8 sm:py-6 bg-white text-black hover:bg-white/90 font-semibold group transition-all text-sm sm:text-base">
                                    Explore Details
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Image & Info */}
                    <div className="w-full sm:w-[400px] flex flex-col order-1 sm:order-2 bg-black/20 border-b sm:border-b-0 sm:border-l border-white/10">

                        {/* Image Area - Strictly 16:9 */}
                        <div className="relative w-full aspect-video z-10 overflow-hidden bg-slate-900">
                            <Image
                                src={event.image_url || "/placeholder.svg"}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info Area - Below Image */}
                        <div className="p-5 sm:p-8 space-y-4 flex flex-col justify-center flex-1 bg-gradient-to-b from-transparent to-black/20">
                            <div className="flex items-start gap-4 text-white/90">
                                <div className="p-2 bg-blue-500/10 rounded-lg shrink-0 border border-blue-500/20">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-white">Date & Time</p>
                                    <p className="text-xs sm:text-sm text-white/60 mt-0.5 leading-relaxed">
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-white/90">
                                <div className="p-2 bg-purple-500/10 rounded-lg shrink-0 border border-purple-500/20">
                                    <MapPin className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-white">Location</p>
                                    <p className="text-xs sm:text-sm text-white/60 mt-0.5 leading-relaxed">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
