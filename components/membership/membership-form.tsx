"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Loader2 } from "lucide-react"

export function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    institution: "",
    position: "",
    experience: "",
    interests: "",
    referral: "",
    terms: false,
    newsletter: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from("members").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        specialty: formData.specialty,
        institution: formData.institution,
        position: formData.position,
        experience: formData.experience,
        interests: formData.interests || null,
        referral: formData.referral || null,
        subscribed_newsletter: formData.newsletter,
        status: "pending",
      })

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("This email is already registered")
        }
        throw insertError
      }

      // Also add to newsletter if subscribed
      if (formData.newsletter) {
        await supabase
          .from("newsletter_subscribers")
          .upsert({ email: formData.email, source: "membership" }, { onConflict: "email" })
      }

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "membershipConfirmation",
            to: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          }),
        })
      } catch (emailError) {
        console.error("[v0] Failed to send confirmation email:", emailError)
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Welcome to Scalpel!</h2>
        <p className="text-slate-600 mb-6">
          Your membership application has been submitted successfully. We'll review your application and get back to you
          within 24-48 hours.
        </p>
        <p className="text-sm text-slate-500">Check your email for a confirmation message.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5"
    >
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              required
              className="h-11"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              required
              className="h-11"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            required
            className="h-11"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="h-11"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-semibold text-slate-900">Professional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="specialty">Medical Specialty *</Label>
          <Select required onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Surgery">General Surgery</SelectItem>
              <SelectItem value="Cardiac Surgery">Cardiac Surgery</SelectItem>
              <SelectItem value="Neurosurgery">Neurosurgery</SelectItem>
              <SelectItem value="Orthopedic Surgery">Orthopedic Surgery</SelectItem>
              <SelectItem value="Plastic Surgery">Plastic Surgery</SelectItem>
              <SelectItem value="Pediatric Surgery">Pediatric Surgery</SelectItem>
              <SelectItem value="Trauma Surgery">Trauma Surgery</SelectItem>
              <SelectItem value="Vascular Surgery">Vascular Surgery</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">Institution / Hospital *</Label>
          <Input
            id="institution"
            placeholder="Medical Center Name"
            required
            className="h-11"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Current Position *</Label>
          <Select required onValueChange={(value) => setFormData({ ...formData, position: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Resident">Resident</SelectItem>
              <SelectItem value="Fellow">Fellow</SelectItem>
              <SelectItem value="Attending Surgeon">Attending Surgeon</SelectItem>
              <SelectItem value="Chief of Surgery">Chief of Surgery</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Medical Student">Medical Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Select required onValueChange={(value) => setFormData({ ...formData, experience: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2 years">0-2 years</SelectItem>
              <SelectItem value="3-5 years">3-5 years</SelectItem>
              <SelectItem value="6-10 years">6-10 years</SelectItem>
              <SelectItem value="11-20 years">11-20 years</SelectItem>
              <SelectItem value="20+ years">20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-semibold text-slate-900">Additional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="interests">Areas of Interest</Label>
          <Textarea
            id="interests"
            placeholder="Tell us about your areas of interest, research focus, or what you hope to gain from membership..."
            rows={3}
            className="resize-none"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral">How did you hear about us?</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, referral: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Colleague Referral">Colleague Referral</SelectItem>
              <SelectItem value="Conference/Event">Conference/Event</SelectItem>
              <SelectItem value="Social Media">Social Media</SelectItem>
              <SelectItem value="Search Engine">Search Engine</SelectItem>
              <SelectItem value="Medical Publication">Medical Publication</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agreement */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            required
            className="mt-1"
            checked={formData.terms}
            onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
          />
          <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
            I agree to the Terms of Service and Privacy Policy, and consent to receive communications from Scalpel
            regarding membership benefits and events. *
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="newsletter"
            className="mt-1"
            checked={formData.newsletter}
            onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
          />
          <Label htmlFor="newsletter" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
            Subscribe to our newsletter for the latest surgical education news and updates.
          </Label>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By submitting, you'll become a member of the Scalpel community.
      </p>
    </form>
  )
}
