
import { createClient } from "@/lib/supabase/server"
import { EventsHeader } from "@/components/admin/events/events-header"
import { EventsTable } from "@/components/admin/events/events-table"
import { EventFormDialog } from "@/components/admin/events/event-form-dialog"
import type { Event } from "@/lib/types"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; action?: string; edit?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("events").select("*").order("date", { ascending: false })

  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,location.ilike.%${params.search}%`)
  }

  const { data: events } = await query

  // Get counts for each type
  const { data: allEvents } = await supabase.from("events").select("type")
  const counts = {
    all: allEvents?.length || 0,
    conference: allEvents?.filter((e) => e.type === "conference").length || 0,
    workshop: allEvents?.filter((e) => e.type === "workshop").length || 0,
    seminar: allEvents?.filter((e) => e.type === "seminar").length || 0,
    webinar: allEvents?.filter((e) => e.type === "webinar").length || 0,
    training: allEvents?.filter((e) => e.type === "training").length || 0,
  }

  // Get event to edit if specified
  let editEvent: Event | null = null
  if (params.edit) {
    const { data } = await supabase.from("events").select("*").eq("id", params.edit).single()
    editEvent = data as Event
  }

  return (
    <div className="space-y-6">
      <EventsHeader counts={counts} currentType={params.type || "all"} />
      <EventsTable events={(events as Event[]) || []} />
      <EventFormDialog open={params.action === "new" || !!params.edit} event={editEvent} />
    </div>
  )
}
