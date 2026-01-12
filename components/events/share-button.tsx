"use client"

import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function ShareButton() {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            toast({
                title: "Link copied!",
                description: "Event URL has been copied to your clipboard.",
            })
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast({
                title: "Failed to copy",
                description: "Please copy the URL manually from the address bar.",
                variant: "destructive",
            })
        }
    }

    return (
        <Button
            variant="outline"
            className="flex-1 gap-2 bg-secondary hover:bg-primary/80 border-2 hover:border-primary transition-all duration-300"
            onClick={handleShare}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    Share
                </>
            )}
        </Button>
    )
}
