"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Event } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Pencil, Trash2, Star, StarOff, Loader2, Users } from "lucide-react"
import { EventRegistrantsDialog } from "./event-registrants-dialog"

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [registrantsDialog, setRegistrantsDialog] = useState<{ eventId: string; eventTitle: string } | null>(null)

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    setIsLoading(id)
    const supabase = createClient()
    await supabase
      .from("events")
      .update({ is_featured: !isFeatured, updated_at: new Date().toISOString() })
      .eq("id", id)
    router.refresh()
    setIsLoading(null)
  }

  const deleteEvent = async () => {
    if (!deleteId) return
    setIsLoading(deleteId)
    const supabase = createClient()
    await supabase.from("events").delete().eq("id", deleteId)
    router.refresh()
    setDeleteId(null)
    setIsLoading(null)
  }

  const editEvent = (id: string) => {
    router.push(`/admin/events?edit=${id}`)
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      conference: "bg-blue-100 text-blue-800",
      workshop: "bg-green-100 text-green-800",
      seminar: "bg-purple-100 text-purple-800",
      webinar: "bg-orange-100 text-orange-800",
      training: "bg-teal-100 text-teal-800",
    }
    return <Badge className={`${colors[type] || "bg-slate-100 text-slate-800"} hover:${colors[type]}`}>{type}</Badge>
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No events found</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden lg:table-cell">Featured</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-slate-500 sm:hidden">{event.type}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{getTypeBadge(event.type)}</TableCell>
                  <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                  <TableCell>
                    <div>{new Date(event.date).toLocaleDateString()}</div>
                    {event.time && <div className="text-sm text-slate-500">{event.time}</div>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {event.is_featured ? (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-slate-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading === event.id}>
                          {isLoading === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editEvent(event.id)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRegistrantsDialog({ eventId: event.id, eventTitle: event.title })}>
                          <Users className="w-4 h-4 mr-2" />
                          View Registrants
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(event.id, event.is_featured)}>
                          {event.is_featured ? (
                            <>
                              <StarOff className="w-4 h-4 mr-2" />
                              Remove Featured
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Mark Featured
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(event.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEvent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EventRegistrantsDialog
        eventId={registrantsDialog?.eventId || null}
        eventTitle={registrantsDialog?.eventTitle || ""}
        open={!!registrantsDialog}
        onOpenChange={(open) => !open && setRegistrantsDialog(null)}
      />
    </>
  )
}
