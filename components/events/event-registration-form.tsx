"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X } from "lucide-react"
import { registerForEvent } from "@/actions/events"
import type { Event, RegistrationField } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface EventRegistrationFormProps {
  event: Event
}

export function EventRegistrationForm({ event }: { event: Event }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  // State for dynamic fields: key = field.label (or id), value = answer
  const [dynamicData, setDynamicData] = useState<Record<string, any>>({})
  // State for file objects: key = field.id, value = File
  const [fileFiles, setFileFiles] = useState<Record<string, File | null>>({})

  const handleDynamicChange = (id: string, value: any) => {
    setDynamicData(prev => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (id: string, file: File | null) => {
    setFileFiles(prev => ({ ...prev, [id]: file }))
  }

  const uploadFile = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `registrations/${event.id}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("scalpel").upload(filePath, file)
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("scalpel").getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate dynamic required fields
      const missingFields = event.registration_form_config?.filter(
        (field: RegistrationField) => {
          if (field.type === 'file') return field.required && !fileFiles[field.id]
          return field.required && !dynamicData[field.id]
        }
      )

      if (missingFields && missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.map((f: RegistrationField) => f.label).join(", ")}`)
      }

      // Process file uploads
      const processedDynamicData = { ...dynamicData }

      for (const [fieldId, file] of Object.entries(fileFiles)) {
        if (file) {
          const url = await uploadFile(file)
          processedDynamicData[fieldId] = url // Store URL in the data
        }
      }

      const form = new FormData()
      form.append("eventId", event.id)
      form.append("firstName", formData.firstName)
      form.append("lastName", formData.lastName)
      form.append("email", formData.email)
      // Pass null for removed fields to satisfy server action if needed, or just let them be null/undefined
      form.append("phone", "")
      form.append("organization", "")
      form.append("specialRequirements", "")

      // Append dynamic data as JSON
      form.append("registrationData", JSON.stringify(processedDynamicData))

      const result = await registerForEvent(null, form)

      if (result.error) {
        throw new Error(result.error)
      }

      // Optional email sending logic omitted for brevity as per previous plan

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Thank You!</h3>
        <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
          Your registration form has been submitted. Confirmation details will be shared via email one week before the Summit Day.
        </p>
        <Button asChild className="min-w-[200px]">
          <a href={`/events`}>Back to Events</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {event.disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900 leading-relaxed">
          <span className="font-bold block mb-1">Important:</span>
          <div
            className="prose prose-sm prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: event.disclaimer }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Standard Fields */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 text-sm border-b pb-2">Your Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="bg-slate-50"
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
              className="bg-slate-50"
            />
          </div>
        </div>

        {/* Dynamic Custom Fields */}
        {event.registration_form_config && event.registration_form_config.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 text-sm border-b pb-2">Additional Information</h4>
            {event.registration_form_config.map((field: RegistrationField) => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input
                    value={dynamicData[field.id] || ""}
                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-slate-50"
                  />
                )}

                {field.type === "number" && (
                  <Input
                    type="number"
                    value={dynamicData[field.id] || ""}
                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-slate-50"
                  />
                )}

                {field.type === "select" && (
                  <Select
                    value={dynamicData[field.id]}
                    onValueChange={(val) => handleDynamicChange(field.id, val)}
                    required={field.required}
                  >
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder={field.placeholder || "Select option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "checkbox" && (
                  <div className="space-y-2">
                    {field.options ? (
                      field.options.map((opt) => (
                        <div key={opt} className="flex items-center gap-2">
                          <Checkbox
                            id={`${field.id}-${opt}`}
                            checked={(dynamicData[field.id] || []).includes(opt)}
                            onCheckedChange={(checked) => {
                              const current = dynamicData[field.id] || []
                              if (checked) {
                                handleDynamicChange(field.id, [...current, opt])
                              } else {
                                handleDynamicChange(field.id, current.filter((v: string) => v !== opt))
                              }
                            }}
                          />
                          <Label htmlFor={`${field.id}-${opt}`} className="cursor-pointer font-normal">{opt}</Label>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={field.id}
                          checked={!!dynamicData[field.id]}
                          onCheckedChange={(checked) => handleDynamicChange(field.id, checked)}
                          required={field.required}
                        />
                        <Label htmlFor={field.id} className="cursor-pointer font-normal">Yes</Label>
                      </div>
                    )}
                  </div>
                )}

                {field.type === "file" && (
                  <div className="space-y-2">
                    {!fileFiles[field.id] ? (
                      <div className="relative">
                        <Input
                          type="file"
                          id={field.id}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                          onChange={(e) => e.target.files && handleFileChange(field.id, e.target.files[0])}
                          required={field.required}
                        />
                        <div className="flex items-center gap-2 border border-slate-200 rounded-md p-2 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <Upload className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-500">Click to upload file</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md border border-slate-200">
                        <span className="text-sm truncate max-w-[200px]">{fileFiles[field.id]?.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileChange(field.id, null)}
                          className="text-slate-500 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {field.type === "date" && (
                  <Input
                    type="date"
                    value={dynamicData[field.id] || ""}
                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                    required={field.required}
                    className="bg-slate-50"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </form>
    </div>
  )
}

