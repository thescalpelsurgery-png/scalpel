"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"
import { registerForEvent } from "@/actions/events"

interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
}

interface EventRegistrationFormProps {
  event: Event
}

export function EventRegistrationForm({ event }: EventRegistrationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    specialRequirements: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const form = new FormData()
      form.append("eventId", event.id)
      form.append("firstName", formData.firstName)
      form.append("lastName", formData.lastName)
      form.append("email", formData.email)
      form.append("phone", formData.phone)
      form.append("organization", formData.organization)
      form.append("specialRequirements", formData.specialRequirements)

      const result = await registerForEvent(null, form)

      if (result.error) {
        throw new Error(result.error)
      }

      // Send confirmation email (optional, keeping existing logic if needed, but actions usually handle emails. 
      // Existing code had client-side fetch for email. I'll keep it or rely on server action. 
      // For now, I'll rely on the server action indicating success, and maybe move email sending to server action later if requested.
      // But the prompt says "It should update everything like lower the seats etc."
      // The original code tried to send email via /api/send-email. I'll keep it if it was working, or skip it.
      // Since I touched the server action logic, the email sending logic was in the client component. 
      // I'll leave the email sending out for simplicity unless critical, as I already migrated registration to server action.
      // Or better, I can call the API route here too if successful.

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "eventRegistration",
            to: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            eventTitle: event.title,
            eventDate: new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            eventLocation: event.location,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white">Register Now</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Registration Confirmed!</h3>
            <p className="text-slate-600 mb-6">You'll receive a confirmation email with event details shortly.</p>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                rows={3}
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="Dietary restrictions, accessibility needs, etc."
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
