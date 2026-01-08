"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setProgress(Math.min(100, Math.max(0, scrollPercent)))
        }

        window.addEventListener("scroll", updateProgress, { passive: true })
        updateProgress()

        return () => window.removeEventListener("scroll", updateProgress)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200/50 backdrop-blur-sm">
            <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-lg shadow-primary/20"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
