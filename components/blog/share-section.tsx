"use client"

import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface ShareSectionProps {
    title: string
    slug: string
}

export function ShareSection({ title, slug }: ShareSectionProps) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : ""

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    const shareLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
        },
        {
            name: "Twitter",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: "hover:bg-sky-500 hover:text-white hover:border-sky-500",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: "hover:bg-blue-700 hover:text-white hover:border-blue-700",
        },
    ]

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-slate-200/50 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <span className="font-bold text-slate-900 flex items-center gap-2 text-xl mb-1">
                        <Share2 className="w-6 h-6 text-primary" />
                        Enjoyed this article?
                    </span>
                    <p className="text-slate-600 text-sm">Spread the word with your medical network</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {shareLinks.map((link) => (
                        <Button
                            key={link.name}
                            variant="outline"
                            size="icon"
                            asChild
                            className={`rounded-full bg-white border-slate-200 text-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 w-12 h-12 ${link.color}`}
                        >
                            <a href={link.href} target="_blank" rel="noopener noreferrer" title={`Share on ${link.name}`}>
                                <link.icon className="w-5 h-5" />
                            </a>
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        className={`rounded-full bg-white border-slate-200 text-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 w-12 h-12 ${copied ? "bg-green-50 border-green-200 text-green-600" : "hover:bg-slate-900 hover:text-white"
                            }`}
                        title="Copy magic link"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
