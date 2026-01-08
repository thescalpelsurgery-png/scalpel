import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel | Scalpel",
  description: "Manage members, events, blogs, and newsletters",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
