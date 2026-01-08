"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
        email,
        source: "homepage",
        is_active: true,
      })

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("This email is already subscribed")
        }
        throw insertError
      }

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newsletterWelcome",
            to: email,
          }),
        })
      } catch (emailError) {
        console.error("[v0] Failed to send welcome email:", emailError)
      }

      setIsSubscribed(true)
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/medical-education-classroom-with-students-and-digi.jpg"
          alt="Medical Education"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 md:mb-6">
            <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>

          <h2 className="sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 text-balance px-2 text-xl text-center">
            Stay Updated in Surgical Education
          </h2>

          <p className="text-white/80 md:text-lg mb-6 md:mb-8 max-w-xl mx-auto px-2 text-sm text-center">
            Subscribe to our newsletter and receive updates on upcoming events, new courses, research highlights, and
            exclusive member benefits.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 md:gap-3 text-white bg-white/20 backdrop-blur-sm rounded-2xl py-4 md:py-5 px-6 max-w-md mx-auto border border-white/20">
              <CheckCircle className="w-6 h-6 md:w-7 md:h-7 shrink-0" />
              <span className="font-medium text-base md:text-lg">Thank you for subscribing!</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto px-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 h-12 md:h-14 pl-12 rounded-xl"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-primary hover:bg-white/90 px-8 group h-12 md:h-14 w-full sm:w-auto rounded-xl font-semibold"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              {error && (
                <p className="text-white/90 text-sm mt-3 bg-red-500/20 backdrop-blur-sm rounded-lg py-2 px-4 max-w-lg mx-auto">
                  {error}
                </p>
              )}
            </>
          )}

          <p className="text-white/50 text-xs md:text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
