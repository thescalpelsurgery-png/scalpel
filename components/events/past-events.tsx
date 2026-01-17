import { createClient } from "@/lib/supabase/server"
import { PastEventsClient } from "./past-events-client"

export async function PastEvents() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_past", true)
    .neq("is_draft", true)
    .order("date", { ascending: false })
    .limit(4)

  return <PastEventsClient events={events || []} />
}
