"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const membershipTypes = [
  { value: "student", label: "Student - $99/year" },
  { value: "professional", label: "Professional - $299/year" },
  { value: "institution", label: "Institution - $1,999/year" },
]

const specialties = [
  "General Surgery",
  "Cardiothoracic Surgery",
  "Neurosurgery",
  "Orthopedic Surgery",
  "Plastic Surgery",
  "Pediatric Surgery",
  "Vascular Surgery",
  "Trauma Surgery",
  "Other",
]

export function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialty: "",
    institution: "",
    membershipType: "",
    agreeTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Thank You!</h2>
        <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {
            "Welcome to Scalpel! We've sent a confirmation email to your inbox. Please verify your email to activate your account."
          }
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white h-10 sm:h-11">Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-slate-100"
    >
      <div className="space-y-4 sm:space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="firstName" className="text-sm">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="lastName" className="text-sm">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="email" className="text-sm">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@hospital.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="password" className="text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-10 sm:h-11 text-sm sm:text-base pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        {/* Specialty */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="specialty" className="text-sm">
            Surgical Specialty
          </Label>
          <Select onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty.toLowerCase().replace(" ", "-")}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Institution */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="institution" className="text-sm">
            Institution / Hospital
          </Label>
          <Input
            id="institution"
            placeholder="Enter your institution name"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className="h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>

        {/* Membership Type */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="membership" className="text-sm">
            Membership Plan
          </Label>
          <Select onValueChange={(value) => setFormData({ ...formData, membershipType: value })}>
            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select your membership plan" />
            </SelectTrigger>
            <SelectContent>
              {membershipTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 sm:gap-3">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
            required
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs sm:text-sm text-slate-600 leading-relaxed cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white h-10 sm:h-11 text-sm sm:text-base"
          disabled={!formData.agreeTerms}
        >
          Create Account
        </Button>

        {/* Login Link */}
        <p className="text-center text-xs sm:text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
