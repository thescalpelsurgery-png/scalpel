"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
    targetDate: string
    targetTime?: string | null
}

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const calculateTimeLeft = () => {
            const target = new Date(targetDate)
            if (targetTime) {
                const [hours, minutes] = targetTime.split(":")
                target.setHours(parseInt(hours) || 0, parseInt(minutes) || 0)
            }

            const now = new Date()
            const difference = target.getTime() - now.getTime()

            if (difference <= 0) {
                return null
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
        }

        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate, targetTime])

    if (!mounted) return null

    if (!timeLeft) {
        return (
            <div className="text-center py-4">
                <span className="text-lg font-bold text-primary animate-pulse">
                    🎉 Event has started!
                </span>
            </div>
        )
    }

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ]

    return (
        <div className="grid grid-cols-4 gap-3">
            {timeUnits.map(({ label, value }) => (
                <div
                    key={label}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-center shadow-xl border border-slate-700/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                        <div className="relative">
                            <div className="text-3xl md:text-4xl font-black text-white tabular-nums">
                                {value.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                                {label}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
