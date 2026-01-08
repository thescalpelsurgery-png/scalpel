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

  return (
    <div className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-40 -left-64 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] -right-64 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back Link */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Link
          href="/events"
          className="inline-flex items-center text-slate-600 hover:text-primary transition-all duration-300 hover:gap-3 gap-2 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200/50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image with Enhanced Gradient Overlay */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              {/* Multi-layer gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 z-10 mix-blend-overlay" />

              <Image
                src={event.image_url || "/placeholder.svg?height=600&width=1200"}
                alt={event.title}
                width={1200}
                height={600}
                className="w-full h-80 md:h-96 lg:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Event Type Badge */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <Badge className="bg-white/90 backdrop-blur-md text-primary capitalize px-4 py-2 text-sm font-bold shadow-lg border-0 hover:bg-white">
                  <Tag className="w-3 h-3 mr-1.5" />
                  {event.type}
                </Badge>
                {event.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-2 text-sm font-bold shadow-lg border-0">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title and date overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-2 text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Countdown Timer for Upcoming Events */}
            {isUpcoming && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_theme(colors.primary/0.2),_transparent_50%)]" />
                <div className="relative">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Event Starts In
                  </h3>
                  <CountdownTimer targetDate={event.date} targetTime={event.time} />
                </div>
              </div>
            )}

            {/* Event Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-purple-50 p-5 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Date</div>
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {event.time && (
                  <div className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-cyan-50 p-5 rounded-2xl border border-blue-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Time</div>
                    <div className="text-sm font-bold text-slate-900">{event.time}</div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-green-50 via-green-50/50 to-emerald-50 p-5 rounded-2xl border border-green-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Location</div>
                  <div className="text-sm font-bold text-slate-900 line-clamp-2">{event.location}</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 via-orange-50/50 to-amber-50 p-5 rounded-2xl border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Registered</div>
                  <div className="text-sm font-bold text-slate-900">{registrationCount || 0} participants</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                  About This Event
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">{event.description}</p>
              </div>

              {event.content && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Event Details</h3>
                  <div
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed
                      prose-headings:font-bold prose-headings:text-slate-900
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                      prose-p:mb-4 prose-p:text-lg
                      prose-ul:my-4 prose-li:my-1
                      prose-a:text-primary prose-a:font-semibold"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                </div>
              )}
            </div>

            {/* What's Included */}
            {event.includes && Array.isArray(event.includes) && event.includes.length > 0 && (
              <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-200/50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  What's Included
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.includes.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-green-100/50"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  Speakers & Instructors
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-100 group hover:-translate-y-1"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                        <Image
                          src={speaker.image || "/placeholder.svg"}
                          alt={speaker.name}
                          width={80}
                          height={80}
                          className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{speaker.name}</h4>
                        <p className="text-sm text-slate-600 font-medium">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-slate-200/50 sticky top-24">
              {/* Availability Progress */}
              {event.capacity && spotsLeft !== null && (
                <div className="mb-6 p-5 bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/50 rounded-2xl border border-primary/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-900">Availability</span>
                    <span className={`text-sm font-bold ${spotsLeft <= 10 ? 'text-orange-600' : 'text-primary'}`}>
                      {spotsLeft} of {event.capacity} spots left
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-lg ${spotsLeft <= 10
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-gradient-to-r from-primary via-purple-500 to-pink-500'
                        }`}
                      style={{
                        width: `${Math.max(5, ((event.capacity - spotsLeft) / event.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                  {spotsLeft <= 10 && spotsLeft > 0 && (
                    <p className="text-xs text-orange-600 font-semibold mt-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Only {spotsLeft} spots remaining! Reserve yours now.
                    </p>
                  )}
                  {spotsLeft === 0 && (
                    <p className="text-xs text-red-600 font-semibold mt-3">🔒 Event is full - Join waitlist</p>
                  )}
                </div>
              )}

              <EventRegistrationForm event={event} />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <ShareButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
