
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EventRegistrationForm } from "@/components/events/event-registration-form"
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: event, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error || !event) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Event Details
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Event Registration</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8">

                    {/* Event Summary Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                            <div className="relative h-32 w-full">
                                <Image
                                    src={event.image_url || "/placeholder.svg?height=400&width=600"}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            </div>
                            <div className="p-6">
                                <h2 className="font-bold text-lg text-slate-900 mb-4 leading-tight">{event.title}</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    {event.time && (
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{event.time}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900">Complete Your Registration</h2>
                                <p className="text-slate-500 text-sm mt-1">Please fill in your details below to secure your spot.</p>
                            </div>

                            <EventRegistrationForm event={event} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
