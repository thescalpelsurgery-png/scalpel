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
import { Download, Loader2, Users, Mail, Phone, Building2, Stethoscope } from "lucide-react"

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

    useEffect(() => {
        if (open && eventId) {
            fetchRegistrants()
        }
    }, [open, eventId])

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

    const exportToCSV = () => {
        if (registrants.length === 0) return

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
        ]

        const csvData = registrants.map((r) => [
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
        ])

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
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
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
                    </div>
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
                                        <TableHead className="font-bold">Name</TableHead>
                                        <TableHead className="font-bold">Contact</TableHead>
                                        <TableHead className="font-bold">Professional Info</TableHead>
                                        <TableHead className="font-bold">Special Requirements</TableHead>
                                        <TableHead className="font-bold">Registered</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrants.map((registrant) => (
                                        <TableRow key={registrant.id} className="hover:bg-slate-50">
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
                                                <div className="space-y-1 text-sm">
                                                    {registrant.institution && (
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-3 h-3 text-slate-400" />
                                                            <span className="text-slate-700">{registrant.institution}</span>
                                                        </div>
                                                    )}
                                                    {registrant.specialty && (
                                                        <div className="flex items-center gap-2">
                                                            <Stethoscope className="w-3 h-3 text-slate-400" />
                                                            <span className="text-slate-700">{registrant.specialty}</span>
                                                        </div>
                                                    )}
                                                    {registrant.experience_level && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {registrant.experience_level}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    {registrant.dietary_requirements && (
                                                        <div>
                                                            <span className="font-medium">Diet:</span> {registrant.dietary_requirements}
                                                        </div>
                                                    )}
                                                    {registrant.special_needs && (
                                                        <div>
                                                            <span className="font-medium">Special:</span> {registrant.special_needs}
                                                        </div>
                                                    )}
                                                    {!registrant.dietary_requirements && !registrant.special_needs && (
                                                        <span className="text-slate-400">None</span>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
