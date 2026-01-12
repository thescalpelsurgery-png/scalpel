"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

import { sendEmail, emailTemplates } from "@/lib/email"

export async function registerForEvent(prevState: any, formData: FormData) {
    const eventId = formData.get("eventId") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const organization = formData.get("organization") as string
    const specialRequirements = formData.get("specialRequirements") as string

    const registrationData = formData.get("registrationData") as string

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
        .select("*")
        .eq("id", eventId)
        .single()

    if (event?.capacity) {
        const { count } = await supabase
            .from("event_registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)

        if (count !== null && count >= event.capacity) {
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
        registration_data: registrationData ? JSON.parse(registrationData) : {},
    })

    if (error) {
        console.error("Registration error:", error)
        return { error: "Failed to register. Please try again." }
    }

    // Send Confirmation Email
    try {
        if (event) {
            const emailContent = emailTemplates.eventRegistration(
                `${firstName} ${lastName}`,
                event.title,
                new Date(event.date).toLocaleDateString(),
                event.location
            )

            await sendEmail({
                to: email,
                subject: emailContent.subject,
                html: emailContent.html
            })
        }
    } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr)
        // We don't fail the request if email fails, but we log it
    }

    revalidatePath(`/events/${eventId}`)
    return { success: "Successfully registered!" }
}

export async function deleteRegistrant(registrantId: string, eventId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("id", registrantId)

    if (error) {
        console.error("Error deleting registrant:", error)
        return { error: "Failed to delete registrant" }
    }

    revalidatePath(`/events/${eventId}`)
    return { success: "Registrant deleted successfully" }
}
