import { createClient } from "@/lib/supabase/server"
import { EventsListClient } from "./events-list-client"

export async function EventsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const { category, search } = searchParams

  let query = supabase
    .from("events")
    .select("*")
    .eq("is_past", false)
    .neq("is_draft", true)
    .order("is_featured", { ascending: false })
    .order("date", { ascending: true })

  if (category && typeof category === "string" && category !== "All Events") {
    // ILIKE is case-insensitive, useful if DB has "Workshop" but URL has "workshops"
    // However, if the DB 'type' column is exact enum, we might need to be careful.
    // Assuming partial match or case-insensitive match is desired for flexibility.
    query = query.ilike("type", `%${category}%`)
  }

  if (search && typeof search === "string") {
    query = query.ilike("title", `%${search}%`)
  }

  const { data: events } = await query

  return <EventsListClient events={events || []} />
}
