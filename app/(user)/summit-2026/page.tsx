
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Summit2026Page() {
    const supabase = await createClient()

    const { data: event } = await supabase
        .from("events")
        .select("id")
        .eq("is_summit_2026", true)
        .single()

    if (event) {
        redirect(`/events/${event.id}`)
    } else {
        redirect("/events") // Fallback
    }
}
