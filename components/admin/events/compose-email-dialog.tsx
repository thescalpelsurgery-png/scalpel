"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"

interface ComposeEmailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    recipientCount: number
    onSend: (subject: string, message: string) => Promise<void>
}

export function ComposeEmailDialog({ open, onOpenChange, recipientCount, onSend }: ComposeEmailDialogProps) {
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        if (!subject || !message) return
        setSending(true)
        try {
            await onSend(subject, message)
            onOpenChange(false)
            setSubject("")
            setMessage("")
        } finally {
            setSending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Email Registrants</DialogTitle>
                    <DialogDescription>
                        Verify the recipient count and compose your message below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-slate-50 p-3 rounded-md border text-sm text-slate-600">
                        Sending to <strong>{recipientCount}</strong> {recipientCount === 1 ? "recipient" : "recipients"}.
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Important Update Regarding Event"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="min-h-[200px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={!subject || !message || sending}>
                        {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {sending ? "Sending..." : "Send Email"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
