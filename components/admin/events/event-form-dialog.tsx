"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Event, RegistrationField, EventSection } from "@/lib/types"
import { FormBuilder } from "@/components/admin/events/form-builder"
import { ContentBuilder } from "@/components/admin/events/content-builder"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Upload, X } from "lucide-react"

interface EventFormDialogProps {
  open: boolean
  event: Event | null
}

export function EventFormDialog({ open, event }: EventFormDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    date: "",
    time: "",
    end_date: "",
    location: "",
    type: "",
    image_url: "",
    capacity: "",
    registration_link: "",
    is_featured: false,
    is_past: false,
    abstract_submission_link: "",
    abstract_details: "",
    disclaimer: "",
    latitude: 0,
    longitude: 0,
    is_draft: true,
    is_summit_2026: false,
    is_registration_closed: false,
  })

  // Start with capacity disabled by default unless editing an event with capacity
  const [hasCapacity, setHasCapacity] = useState(false)

  const [formFields, setFormFields] = useState<RegistrationField[]>([])
  const [contentSections, setContentSections] = useState<EventSection[]>([])

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        content: event.content || "",
        date: event.date,
        time: event.time || "",
        end_date: event.end_date || "",
        location: event.location,
        type: event.type,
        image_url: event.image_url || "",
        capacity: event.capacity?.toString() || "",
        registration_link: event.registration_link || "",
        is_featured: event.is_featured,
        is_past: event.is_past,
        abstract_submission_link: event.abstract_submission_link || "",
        abstract_details: event.abstract_details || "",
        disclaimer: event.disclaimer || "",
        latitude: event.latitude || 0,
        longitude: event.longitude || 0,
        is_draft: event.is_draft ?? false,
        is_summit_2026: event.is_summit_2026 ?? false,
        is_registration_closed: event.is_registration_closed ?? false,
      })
      setHasCapacity(!!event.capacity && event.capacity > 0)
      setFormFields(event.registration_form_config || [])

      try {
        if (event.content && event.content.trim().startsWith("[")) {
          setContentSections(JSON.parse(event.content))
        } else {
          setContentSections([])
        }
      } catch (e) {
        console.error("Failed to parse event content", e)
        setContentSections([])
      }

      setImageType("url")
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        date: "",
        time: "",
        end_date: "",
        location: "",
        type: "",
        image_url: "",
        capacity: "",
        registration_link: "",
        is_featured: false,
        is_past: false,
        abstract_submission_link: "",
        abstract_details: "",
        disclaimer: "",
        latitude: 0,
        longitude: 0,
        is_draft: true,
        is_summit_2026: false,
        is_registration_closed: false,
      })
      setHasCapacity(false)
      setFormFields([])
      setContentSections([])
      setImageType("url")
      setUploadFile(null)
    }
  }, [event])

  const handleClose = () => {
    router.push("/admin/events")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `events/${fileName}`

    const { error: uploadError } = await supabase.storage.from("scalpel").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("scalpel").getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      let finalImageUrl = formData.image_url

      if (imageType === "upload" && uploadFile) {
        finalImageUrl = await handleImageUpload(uploadFile)
      }

      const data = {
        title: formData.title,
        description: formData.description,
        content: contentSections.length > 0 ? JSON.stringify(contentSections) : null,
        date: formData.date,
        time: formData.time || null,
        end_date: formData.end_date || null,
        location: formData.location,
        type: formData.type as Event["type"],
        image_url: finalImageUrl || null,
        capacity: formData.capacity ? Number.parseInt(formData.capacity) : null,
        registration_link: formData.registration_link || null,
        is_featured: formData.is_featured,
        is_past: formData.is_past,
        abstract_submission_link: formData.abstract_submission_link || null,
        abstract_details: formData.abstract_details || null,
        disclaimer: formData.disclaimer || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        is_draft: formData.is_draft,
        is_summit_2026: formData.is_summit_2026,
        is_registration_closed: formData.is_registration_closed,
        registration_form_config: formFields,
        updated_at: new Date().toISOString(),
      }

      if (event) {
        const { error: updateError } = await supabase.from("events").update(data).eq("id", event.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("events").insert(data)
        if (insertError) throw insertError
      }

      router.push("/admin/events")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Start Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Page Content</Label>
            <ContentBuilder
              sections={contentSections}
              onChange={setContentSections}
              onUpload={handleImageUpload}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="has_capacity"
                checked={hasCapacity}
                onCheckedChange={(checked) => {
                  setHasCapacity(!!checked)
                  if (!checked) setFormData({ ...formData, capacity: "" })
                }}
              />
              <Label htmlFor="has_capacity">Limit Capacity</Label>
            </div>

            {hasCapacity && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <Label htmlFor="capacity">Max Attendees</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Maximum attendees"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disclaimer">Registration Disclaimer / Terms (Appears at top of form)</Label>
            <Textarea
              id="disclaimer"
              value={formData.disclaimer}
              onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
              rows={3}
              placeholder="e.g. By registering, you agree to..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude (e.g., 51.5074)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude (e.g., -0.1278)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t mt-4">
            <h4 className="font-semibold text-sm">Call for Abstracts (Optional)</h4>
            <div className="space-y-2">
              <Label htmlFor="abstract_link">Submission Link</Label>
              <Input
                id="abstract_link"
                value={formData.abstract_submission_link}
                onChange={(e) => setFormData({ ...formData, abstract_submission_link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abstract_details">Abstract Guidelines / Details</Label>
              <Textarea
                id="abstract_details"
                value={formData.abstract_details}
                onChange={(e) => setFormData({ ...formData, abstract_details: e.target.value })}
                rows={10}
                placeholder="Enter details about abstract submission requirements..."
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <FormBuilder fields={formFields} onChange={setFormFields} />
          </div>

          <div className="space-y-4">
            <Label>Event Image</Label>
            <RadioGroup
              value={imageType}
              onValueChange={(value) => setImageType(value as "url" | "upload")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="img-url" />
                <Label htmlFor="img-url">Image URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="img-upload" />
                <Label htmlFor="img-upload">Upload Image</Label>
              </div>
            </RadioGroup>

            {imageType === "url" ? (
              <div className="space-y-3">
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
                {formData.image_url && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-slate-50">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {uploadFile && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      <span>{uploadFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {(uploadFile || event?.image_url) && (
                  <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-slate-50">
                    <img
                      src={uploadFile ? URL.createObjectURL(uploadFile) : event?.image_url || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Featured Event
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_past"
                checked={formData.is_past}
                onCheckedChange={(checked) => setFormData({ ...formData, is_past: checked as boolean })}
              />
              <Label htmlFor="is_past" className="cursor-pointer">
                Mark as Past Event
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_draft"
                checked={formData.is_draft}
                onCheckedChange={(checked) => setFormData({ ...formData, is_draft: checked as boolean })}
              />
              <Label htmlFor="is_draft" className="cursor-pointer">
                Draft (Hidden)
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_summit_2026"
                checked={formData.is_summit_2026}
                onCheckedChange={(checked) => setFormData({ ...formData, is_summit_2026: checked as boolean })}
              />
              <Label className="cursor-pointer" htmlFor="is_summit_2026">
                Summit 2026 Event
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_registration_closed"
                checked={formData.is_registration_closed}
                onCheckedChange={(checked) => setFormData({ ...formData, is_registration_closed: checked as boolean })}
              />
              <Label htmlFor="is_registration_closed" className="cursor-pointer">
                Registration Closed
              </Label>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}
