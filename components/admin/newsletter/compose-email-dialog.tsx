"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { NewsletterSubscriber, Event } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Users, Calendar, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ComposeEmailDialogProps {
  open: boolean
  subscribers: NewsletterSubscriber[]
}

interface Registrant {
  id: string
  email: string
  first_name: string
  last_name: string
}

export function ComposeEmailDialog({ open, subscribers }: ComposeEmailDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("subscribers")

  // Data for event registrants
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [eventRegistrants, setEventRegistrants] = useState<Registrant[]>([])
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false)

  // Selection state
  const activeSubscribers = subscribers.filter((s) => s.is_active)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set(activeSubscribers.map((s) => s.email)))
  const [selectAll, setSelectAll] = useState(true)

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })

  // Fetch events when dialog opens
  useEffect(() => {
    if (open) {
      const fetchEvents = async () => {
        const supabase = createClient()
        const { data } = await supabase.from("events").select("id, title").order("date", { ascending: false })
        if (data) setEvents(data as any)
      }
      fetchEvents()
    }
  }, [open])

  // Fetch registrants when event changes
  useEffect(() => {
    if (selectedEventId) {
      const fetchRegistrants = async () => {
        setIsLoadingRegistrants(true)
        const supabase = createClient()
        const { data } = await supabase
          .from("event_registrations")
          .select("id, email, first_name, last_name")
          .eq("event_id", selectedEventId)

        if (data) {
          setEventRegistrants(data)
          // Default to selecting all registrants when an event is selected
          setSelectedEmails(new Set(data.map(r => r.email)))
          setSelectAll(true)
        }
        setIsLoadingRegistrants(false)
      }
      fetchRegistrants()
    }
  }, [selectedEventId])

  const handleClose = () => {
    router.push("/admin/newsletter")
    setSuccess(false)
    setFormData({ subject: "", message: "" })
    setSelectedEventId("")
    setEventRegistrants([])
  }

  const toggleSelectAll = (list: string[]) => {
    if (selectAll) {
      setSelectedEmails(new Set())
    } else {
      setSelectedEmails(new Set(list))
    }
    setSelectAll(!selectAll)
  }

  const toggleEmail = (email: string, totalCount: number) => {
    const newSelected = new Set(selectedEmails)
    if (newSelected.has(email)) {
      newSelected.delete(email)
    } else {
      newSelected.add(email)
    }
    setSelectedEmails(newSelected)
    setSelectAll(newSelected.size === totalCount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "adminBroadcast",
          to: Array.from(selectedEmails),
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setSuccess(true)
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email. Please check your configuration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-white">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Email Sent Successfully!</h3>
            <p className="text-slate-600 mb-6">
              Your message has been sent to {selectedEmails.size} recipient{selectedEmails.size !== 1 ? "s" : ""}.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Compose Broadcast
          </DialogTitle>
          <DialogDescription>Send a premium broadcast email to your community</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Recipient Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Recipients</Label>
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {selectedEmails.size} selected
                </span>
              </div>

              <Tabs defaultValue="subscribers" onValueChange={(v) => {
                setActiveTab(v)
                setSelectedEmails(new Set())
                setSelectAll(false)
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="subscribers" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Subscribers
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event Registrants
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="subscribers" className="space-y-4 m-0">
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 p-3 border-b bg-slate-50/80 backdrop-blur-sm">
                      <Checkbox
                        id="selectAllSubs"
                        checked={selectAll && activeSubscribers.length > 0}
                        onCheckedChange={() => toggleSelectAll(activeSubscribers.map(s => s.email))}
                      />
                      <Label htmlFor="selectAllSubs" className="cursor-pointer font-medium text-sm flex items-center gap-2">
                        Select All Active Subscribers ({activeSubscribers.length})
                      </Label>
                    </div>

                    <ScrollArea className="h-48">
                      <div className="p-3 space-y-2">
                        {activeSubscribers.map((subscriber) => (
                          <div key={subscriber.id} className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                            <Checkbox
                              id={subscriber.id}
                              checked={selectedEmails.has(subscriber.email)}
                              onCheckedChange={() => toggleEmail(subscriber.email, activeSubscribers.length)}
                            />
                            <Label htmlFor={subscriber.id} className="cursor-pointer text-sm flex items-center justify-between flex-1">
                              <span>{subscriber.email}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{subscriber.source}</span>
                            </Label>
                          </div>
                        ))}
                        {activeSubscribers.length === 0 && (
                          <div className="text-center py-8">
                            <Mail className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No active subscribers found</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="space-y-4 m-0">
                  <div className="space-y-3">
                    <Label htmlFor="event-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Select Event
                    </Label>
                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                      <SelectTrigger id="event-select" className="h-11 shadow-sm">
                        <SelectValue placeholder="Choose an event to see registrants" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEventId && (
                    <div className="border rounded-xl overflow-hidden shadow-sm mt-4">
                      <div className="flex items-center gap-3 p-3 border-b bg-slate-50/80 backdrop-blur-sm">
                        <Checkbox
                          id="selectAllRegs"
                          checked={selectAll && eventRegistrants.length > 0}
                          onCheckedChange={() => toggleSelectAll(eventRegistrants.map(r => r.email))}
                          disabled={isLoadingRegistrants}
                        />
                        <Label htmlFor="selectAllRegs" className="cursor-pointer font-medium text-sm flex items-center gap-2">
                          Select All Registrants ({eventRegistrants.length})
                        </Label>
                      </div>

                      <ScrollArea className="h-48">
                        <div className="p-3 space-y-2">
                          {isLoadingRegistrants ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                              <Loader2 className="w-6 h-6 animate-spin text-primary" />
                              <p className="text-sm text-slate-500">Loading registrants...</p>
                            </div>
                          ) : (
                            <>
                              {eventRegistrants.map((registrant) => (
                                <div key={registrant.id} className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                                  <Checkbox
                                    id={registrant.id}
                                    checked={selectedEmails.has(registrant.email)}
                                    onCheckedChange={() => toggleEmail(registrant.email, eventRegistrants.length)}
                                  />
                                  <Label htmlFor={registrant.id} className="cursor-pointer text-sm flex flex-col">
                                    <span className="font-medium">{registrant.first_name} {registrant.last_name}</span>
                                    <span className="text-xs text-slate-500">{registrant.email}</span>
                                  </Label>
                                </div>
                              ))}
                              {eventRegistrants.length === 0 && (
                                <div className="text-center py-8">
                                  <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                  <p className="text-sm text-slate-500">No registrants found for this event</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Content Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-semibold">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Enter a compelling subject line"
                  className="h-11 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={10}
                  required
                  placeholder="Compose your premium broadcast content here..."
                  className="shadow-sm resize-none focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedEmails.size === 0}
              className="px-8 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {selectedEmails.size} Recipient{selectedEmails.size !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
