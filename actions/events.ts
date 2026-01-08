"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function registerForEvent(prevState: any, formData: FormData) {
    const eventId = formData.get("eventId") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const organization = formData.get("organization") as string
    const specialRequirements = formData.get("specialRequirements") as string

    if (!eventId || !firstName || !lastName || !email) {
        return { error: "Missing required fields" }
    }

    const supabase = await createClient()

    // Check if already registered
    const { data: existing } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("email", email)
        .single()

    if (existing) {
        return { error: "You are already registered for this event with this email." }
    }

    // Check capacity (optional, but good practice to double check)
    const { data: event } = await supabase
        .from("events")
        .select("max_participants")
        .eq("id", eventId)
        .single()

    if (event?.max_participants) {
        const { count } = await supabase
            .from("event_registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)

        if (count !== null && count >= event.max_participants) {
            return { error: "Event is full." }
        }
    }

    const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        institution: organization || null,
        special_needs: specialRequirements || null,
    })

    if (error) {
        console.error("Registration error:", error)
        return { error: "Failed to register. Please try again." }
    }

    revalidatePath(`/events/${eventId}`)
    return { success: "Successfully registered!" }
}
