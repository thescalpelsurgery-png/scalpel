import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function EventsPreviewSection() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_past", false)
    .neq("is_draft", true)
    .order("date", { ascending: true })
    .limit(3)

  if (!events || events.length === 0) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)

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

    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="inline-block text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4">
              Upcoming Events
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Join Our Next Educational Event
            </h2>
          </div>
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="outline" className="group bg-background w-full sm:w-auto">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {events.map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={event.image_url || "/placeholder.svg?height=300&width=500"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 md:px-3 rounded-full">
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-4 md:p-6 overflow-hidden">
                {/* Background image with overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image_url || "/placeholder.svg?height=300&width=500"})` }}
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Content on top */}
                <div className="relative z-10">
                  <h3 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                      <span className="truncate">{formatDate(event.date)}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                        <span className="truncate">{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
