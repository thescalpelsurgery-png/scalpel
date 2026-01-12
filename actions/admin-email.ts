"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

export async function sendEventEmail(
    eventId: string,
    recipientIds: string[] | 'all',
    subject: string,
    message: string
) {
    const supabase = await createClient()

    // 1. Fetch Recipients
    let query = supabase
        .from("event_registrations")
        .select("email, first_name, last_name")
        .eq("event_id", eventId)

    if (recipientIds !== 'all') {
        query = query.in("id", recipientIds)
    }

    const { data: registrants, error } = await query

    if (error) {
        console.error("Error fetching registrants:", error)
        return { error: "Failed to fetch recipients" }
    }

    if (!registrants || registrants.length === 0) {
        return { error: "No recipients found" }
    }

    // 2. Send Emails (Batched or sequential)
    // Simple sequential loop for now, ideally use a bulk provider endpoint or queue
    let successCount = 0
    let failCount = 0

    // Construct a basic HTML template wrapping the message
    const htmlTemplate = (content: string) => `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <div style="white-space: pre-wrap;">${content}</div>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">You are receiving this email because you registered for an event at Scalpel.</p>
    </div>
  `

    for (const registrant of registrants) {
        const success = await sendEmail({
            to: registrant.email,
            subject: subject,
            html: htmlTemplate(message)
        })

        if (success) successCount++
        else failCount++
    }

    return {
        success: true,
        sent: successCount,
        failed: failCount,
        message: `Sent to ${successCount} recipients${failCount > 0 ? `, failed for ${failCount}` : ''}.`
    }
}
