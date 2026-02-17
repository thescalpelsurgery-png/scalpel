"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, Trash2, Loader2, Mail, Phone, Building, BookOpen } from "lucide-react"

interface Registration {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  organization?: string
  special_requirements?: string
  status: string
  created_at: string
  registration_data?: any
}

interface RegistrationsTableProps {
  registrations: Registration[]
  eventId: string
}

export function RegistrationsTable({ registrations, eventId }: RegistrationsTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  const deleteRegistration = async (id: string) => {
    setIsLoading(id)
    const supabase = createClient()
    await supabase.from("event_registrations").delete().eq("id", id)
    router.refresh()
    setIsLoading(null)
  }

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Organization", "Registration Date"]
    const rows = registrations.map((r) => [
      r.first_name,
      r.last_name,
      r.email,
      r.phone || "",
      r.organization || "",
      new Date(r.created_at).toLocaleDateString(),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `event-registrations-${eventId}.csv`
    a.click()
  }

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No registrations yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Registered Participants ({registrations.length})</h3>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            Export to CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Organization</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">
                    {registration.first_name} {registration.last_name}
                  </TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{registration.phone || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{registration.organization || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {registration.registration_data && Object.entries(registration.registration_data).map(([key, value]) => {
                        if (typeof value === "string" && value.toLowerCase().includes("http")) {
                          return (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                            >
                              <BookOpen className="w-3 h-3" />
                              {key.replace(/_/g, " ")}
                            </a>
                          )
                        }
                        return null
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(registration.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading === registration.id}>
                          {isLoading === registration.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedRegistration(registration)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />


                        <DropdownMenuItem onClick={() => deleteRegistration(registration.id)} className="text-red-600">
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
      </div >

      {/* Details Dialog */}
      < Dialog open={!!selectedRegistration
      } onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Registered on {selectedRegistration && new Date(selectedRegistration.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="font-medium">
                  {selectedRegistration.first_name} {selectedRegistration.last_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{selectedRegistration.email}</p>
                </div>
              </div>
              {selectedRegistration.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-medium">{selectedRegistration.phone}</p>
                  </div>
                </div>
              )}
              {selectedRegistration.organization && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">Organization</p>
                    <p className="font-medium">{selectedRegistration.organization}</p>
                  </div>
                </div>
              )}
              {selectedRegistration.special_requirements && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Special Requirements</p>
                  <p className="text-slate-900">{selectedRegistration.special_requirements}</p>
                </div>
              )}
              {selectedRegistration.registration_data && Object.keys(selectedRegistration.registration_data).length > 0 && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Custom Fields</p>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                    {Object.entries(selectedRegistration.registration_data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        {typeof value === "string" && value.toLowerCase().includes("http") ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            View File
                          </a>
                        ) : (
                          <p className="text-sm text-slate-900 break-words">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog >
    </>
  )
}
