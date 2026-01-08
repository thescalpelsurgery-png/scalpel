import { NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, to, name, eventTitle, eventDate, eventLocation, subject, message, data } = body

    let emailContent: { subject: string; html: string } | null = null

    switch (type) {
      case "membershipConfirmation":
        emailContent = emailTemplates.membershipConfirmation(name)
        break
      case "eventRegistration":
        emailContent = emailTemplates.eventRegistration(name, eventTitle, eventDate, eventLocation)
        break
      case "newsletterWelcome":
        emailContent = emailTemplates.newsletterWelcome(to)
        break
      case "adminBroadcast":
        emailContent = emailTemplates.adminBroadcast(subject, message)
        break
      case "contactRequest":
        emailContent = emailTemplates.contactRequest(data)
        break
      case "newsletter": // Compatibility with existing code
        emailContent = emailTemplates.adminBroadcast(subject, message)
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    if (!emailContent) {
      return NextResponse.json({ error: "Failed to generate email content" }, { status: 400 })
    }

    const success = await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Email API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
