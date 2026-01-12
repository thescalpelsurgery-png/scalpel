"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Loader2, Users, Mail, Phone, Building2, Stethoscope, Send, CheckSquare, Square } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ComposeEmailDialog } from "./compose-email-dialog"

import { sendEventEmail } from "@/actions/admin-email"
import { deleteRegistrant } from "@/actions/events"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface Registrant {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    institution: string | null
    specialty: string | null
    experience_level: string | null
    dietary_requirements: string | null
    special_needs: string | null
    created_at: string
    registration_data?: any
}

interface EventRegistrantsDialogProps {
    eventId: string | null
    eventTitle: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EventRegistrantsDialog({ eventId, eventTitle, open, onOpenChange }: EventRegistrantsDialogProps) {
    const [registrants, setRegistrants] = useState<Registrant[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null)
    const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({})

    // Email Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [emailDialogOpen, setEmailDialogOpen] = useState(false)

    const toggleSelectAll = () => {
        if (selectedIds.size === registrants.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(registrants.map(r => r.id)))
        }
    }

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleSendEmail = async (subject: string, message: string) => {
        if (!eventId) return

        const recipients = selectedIds.size > 0
            ? Array.from(selectedIds)
            : 'all' // If none selected but button clicked (default behavior debated, but usually explicit selection is better. Let's say if 0 selected => All, or enforce selection?)

        // Let's implement logic: 
        // If > 0 selected => Send to selected.
        // If 0 selected => Send to ALL.
        const target = selectedIds.size > 0 ? Array.from(selectedIds) : 'all'

        const result = await sendEventEmail(eventId, target, subject, message)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message)
            setEmailDialogOpen(false)
            setSelectedIds(new Set()) // Reset selection
        }
    }


    const handleDelete = async (registrantId: string) => {
        if (!confirm("Are you sure you want to delete this registrant? This action cannot be undone.")) return

        setLoading(true)
        const result = await deleteRegistrant(registrantId, eventId || "")
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Registrant deleted successfully")
            // Refresh list
            fetchRegistrants()
        }
    }

    useEffect(() => {
        if (open && eventId) {
            fetchRegistrants()
            fetchEventConfig()
        }
    }, [open, eventId])

    const fetchEventConfig = async () => {
        if (!eventId) return
        const supabase = createClient()
        const { data, error } = await supabase
            .from("events")
            .select("registration_form_config")
            .eq("id", eventId)
            .single()

        if (!error && data?.registration_form_config) {
            const labels: Record<string, string> = {}
            if (Array.isArray(data.registration_form_config)) {
                data.registration_form_config.forEach((field: any) => {
                    labels[field.id] = field.label
                })
            }
            setFieldLabels(labels)
        }
    }

    const fetchRegistrants = async () => {
        if (!eventId) return

        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from("event_registrations")
            .select("*")
            .eq("event_id", eventId)
            .order("created_at", { ascending: false })

        if (!error && data) {
            setRegistrants(data)
        }
        setLoading(false)
    }

    const getLabelForField = (key: string) => {
        return fieldLabels[key] || key.replace(/_/g, " ")
    }

    const exportToCSV = () => {
        if (registrants.length === 0) return

        // 1. Collect all unique keys from registration_data
        const dynamicKeys = new Set<string>()
        registrants.forEach(r => {
            if (r.registration_data) {
                Object.keys(r.registration_data).forEach(k => dynamicKeys.add(k))
            }
        })
        const dynamicKeysArray = Array.from(dynamicKeys)

        // 2. Build Headers
        const headers = [
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Institution",
            "Specialty",
            "Experience Level",
            "Dietary Requirements",
            "Special Needs",
            "Registration Date",

            ...dynamicKeysArray.map(key => getLabelForField(key)) // Add dynamic columns
        ]

        // 3. Build Rows
        const csvData = registrants.map((r) => {
            const standardFields = [
                r.first_name,
                r.last_name,
                r.email,
                r.phone || "",
                r.institution || "",
                r.specialty || "",
                r.experience_level || "",
                r.dietary_requirements || "",
                r.special_needs || "",
                new Date(r.created_at).toLocaleString(),
            ]

            const dynamicFields = dynamicKeysArray.map(key => {
                const val = r.registration_data ? r.registration_data[key] : ""
                // Escape quotes if needed, though simpler here
                if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""')
                return val ? String(val).replace(/"/g, '""') : ""
            })

            return [...standardFields, ...dynamicFields]
        })

        const csvContent = [
            headers.join(","),
            ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${eventTitle.replace(/\s+/g, "_")}_registrants.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Users className="w-6 h-6 text-primary" />
                        Event Registrants
                    </DialogTitle>
                    <DialogDescription>
                        Viewing registrants for: <span className="font-semibold text-slate-900">{eventTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <Badge className="bg-primary/10 text-primary text-lg px-4 py-2">
                            {registrants.length} {registrants.length === 1 ? "Registrant" : "Registrants"}
                        </Badge>
                        {selectedIds.size > 0 && (
                            <span className="text-sm text-slate-500 font-medium">
                                {selectedIds.size} selected
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setEmailDialogOpen(true)}
                            className="gap-2"
                            disabled={registrants.length === 0}
                        >
                            <Send className="w-4 h-4" />
                            {selectedIds.size > 0 ? "Email Selected" : "Email All"}
                        </Button>
                        <Button
                            onClick={exportToCSV}
                            disabled={registrants.length === 0}
                            className="gap-2"
                            variant="outline"
                        >
                            <Download className="w-4 h-4" />
                            Export to CSV
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : registrants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Users className="w-16 h-16 mb-4 text-slate-300" />
                            <p className="text-lg font-medium">No registrants yet</p>
                            <p className="text-sm">Registrations will appear here once people sign up</p>
                        </div>
                    ) : (
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={registrants.length > 0 && selectedIds.size === registrants.length}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                        <TableHead className="font-bold">Name</TableHead>
                                        <TableHead className="font-bold">Contact</TableHead>
                                        <TableHead className="font-bold">Custom Data</TableHead>
                                        <TableHead className="font-bold">Registered</TableHead>
                                        <TableHead className="font-bold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrants.map((registrant) => (
                                        <TableRow key={registrant.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.has(registrant.id)}
                                                    onCheckedChange={() => toggleSelect(registrant.id)}
                                                    aria-label={`Select ${registrant.first_name}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-slate-900">
                                                    {registrant.first_name} {registrant.last_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        <a
                                                            href={`mailto:${registrant.email}`}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {registrant.email}
                                                        </a>
                                                    </div>
                                                    {registrant.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            {registrant.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600 max-w-xs truncate">
                                                    {registrant.registration_data ? (
                                                        <span className="italic">{Object.keys(registrant.registration_data).length} custom fields</span>
                                                    ) : (
                                                        <span className="text-slate-400">N/A</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600">
                                                    {new Date(registrant.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedRegistrant(registrant)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(registrant.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>

            {/* Detailed View Modal */}
            <Dialog open={!!selectedRegistrant} onOpenChange={(open) => !open && setSelectedRegistrant(null)}>
                <DialogContent className="max-w-2xl bg-white max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Registrant Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedRegistrant?.first_name} {selectedRegistrant?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRegistrant && (
                        <div className="space-y-6 pt-4">
                            {/* Standard Info */}
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <h4 className="text-xs uppercase text-slate-500 font-semibold mb-1">Email</h4>
                                    <p>{selectedRegistrant.email}</p>
                                </div>
                                {selectedRegistrant.phone && (
                                    <div>
                                        <h4 className="text-xs uppercase text-slate-500 font-semibold mb-1">Phone</h4>
                                        <p>{selectedRegistrant.phone}</p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Info from old schema */}
                            {(selectedRegistrant.institution || selectedRegistrant.specialty) && (
                                <div className="space-y-2 border-b border-slate-100 pb-4">
                                    <h4 className="text-xs uppercase text-slate-500 font-semibold">Professional</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedRegistrant.institution && (
                                            <p><span className="text-slate-400 text-sm">Institution:</span> {selectedRegistrant.institution}</p>
                                        )}
                                        {selectedRegistrant.specialty && (
                                            <p><span className="text-slate-400 text-sm">Specialty:</span> {selectedRegistrant.specialty}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Data */}
                            {selectedRegistrant.registration_data && Object.keys(selectedRegistrant.registration_data).length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase text-slate-500 font-semibold mb-3">Custom Registration Data</h4>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                        {Object.entries(selectedRegistrant.registration_data).map(([key, value]) => (
                                            <div key={key}>
                                                <p className="text-sm font-medium text-slate-700 mb-1 capitalize">{getLabelForField(key)}</p>
                                                {typeof value === 'string' && value.startsWith('http') ? (
                                                    <a
                                                        href={value}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                                    >
                                                        View File / Link
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-slate-600 break-words">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
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
            </Dialog>

            <ComposeEmailDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                recipientCount={selectedIds.size > 0 ? selectedIds.size : registrants.length}
                onSend={handleSendEmail}
            />
        </Dialog>
    )
}
