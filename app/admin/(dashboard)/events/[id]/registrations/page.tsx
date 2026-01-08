import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrationsTable } from "@/components/admin/events/registrations-table"

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event details
  const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", id).single()

  if (eventError || !event) {
    notFound()
  }

  // Fetch registrations for this event
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false })

  const registrationCount = registrations?.length || 0
  const spotsLeft = event.max_participants ? event.max_participants - registrationCount : "Unlimited"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center text-slate-600 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Event Registrations</h1>
      </div>

      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-slate-600">Date</p>
                <p className="font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-slate-600">Participants</p>
                <p className="font-medium">
                  {registrationCount}
                  {event.max_participants && ` / ${event.max_participants}`}
                  {typeof spotsLeft === "number" && <span className="text-slate-500"> ({spotsLeft} left)</span>}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <RegistrationsTable registrations={registrations || []} eventId={id} />
    </div>
  )
}
