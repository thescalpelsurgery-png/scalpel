

import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle, Users, Sparkles, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EventRegistrationForm } from "@/components/events/event-registration-form"
import { CountdownTimer } from "@/components/events/countdown-timer"
import { ShareButton } from "@/components/events/share-button"
import { ClientMap } from "@/components/ui/client-map"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("title, description, image_url").eq("id", id).single()

  if (!event) return { title: "Event Not Found" }

  return {
    title: event.title,
    description: event.description,
    alternates: {
      canonical: `/events/${id}`,
    },
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image_url ? [event.image_url] : [],
      type: "website",
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error || !event) {
    notFound()
  }

  const { count: registrationCount } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id)

  const spotsLeft = event.capacity ? event.capacity - (registrationCount || 0) : null

  // Check if event is upcoming
  const isUpcoming = new Date(event.date) > new Date()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
      },
    },
    image: event.image_url,
    organizer: {
      "@type": "Organization",
      name: "Scalpel",
      url: "https://scalpelsurgery.org",
    },
    eventStatus: event.is_past ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled", // Could be more precise if we had a status column
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", // Assuming offline for now
  }

  return (
    <div className="min-h-screen relative bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link with enhanced spacing */}
      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10 ">
        <Link
          href="/events"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-20 relative z-10 bg-white">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image / Header */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={event.image_url || "/placeholder.svg?height=600&width=800"}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                {isUpcoming && (
                  <Badge className="bg-green-500/90 hover:bg-green-500 text-white backdrop-blur-md border-0 px-3 py-1 shadow-lg">
                    Upcoming
                  </Badge>
                )}
                {event.is_featured && (
                  <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white backdrop-blur-md border-0 px-3 py-1 shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-4 md:gap-6 text-white/90">
                  {/* Date/Time/Location badges embedded in hero if desired, or keep generic */}
                  <div className="flex items-center gap-2 text-sm md:text-base font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-base font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-8">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Date</span>
                  <span className="font-bold text-slate-800">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                {event.time && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Time</span>
                    <span className="font-bold text-slate-800">{event.time}</span>
                  </div>
                )}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Type</span>
                  <span className="font-bold text-slate-800 capitalize">{event.type}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Available</span>
                  <span className="font-bold text-slate-800">{spotsLeft !== null ? spotsLeft : 'Open'}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Event</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
              </div>

              {event.content && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-primary">
                  <div dangerouslySetInnerHTML={{ __html: event.content }} />
                </div>
              )}
            </div>

            {/* Map Section */}
            {event.latitude && event.longitude && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Event Location
                </h2>
                <ClientMap
                  lat={event.latitude}
                  lng={event.longitude}
                  popupText={event.location}
                />
                <div className="mt-4 flex items-center gap-2 text-slate-600 bg-slate-50 p-4 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {!event.is_past && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100">
                  <div className="text-center mb-6">
                    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Registration</span>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      {event.capacity ? (
                        <>
                          <span className="text-3xl font-bold text-slate-900">{spotsLeft}</span>
                          <span className="text-sm text-slate-500 font-medium">/ {event.capacity} spots left</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-slate-900">Open Registration</span>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                  >
                    <Link href={`/events/${event.id}/register`}>
                      Register Now
                    </Link>
                  </Button>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-center w-full">
                      <ShareButton />
                    </div>
                  </div>
                </div>

                {event.abstract_submission_link && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100">
                    <div className="text-center mb-4">
                      <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Call for Papers</span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">Abstract Submission</h3>
                    </div>

                    {event.abstract_details && (
                      <p className="text-slate-600 text-sm mb-6 text-center leading-relaxed">
                        {event.abstract_details}
                      </p>
                    )}

                    <Button
                      asChild
                      className="w-full bg-primary text-white shadow-lg shadow-blue-500/20"
                      size="lg"
                    >
                      <Link href={event.abstract_submission_link} target="_blank" rel="noopener noreferrer">
                        Submit Your Abstract
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Sidebar for Past Events */}
          {event.is_past && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100">
                  <div className="text-center mb-6">
                    <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-500 border-slate-200">
                      Past Event
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900">Event Concluded</h3>
                    <p className="text-slate-500 text-sm mt-2">
                      This event has ended. Registrations are no longer accepted.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-center w-full">
                      <ShareButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


