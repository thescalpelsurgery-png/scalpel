"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Users, Calendar, FileText, Mail, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/members", icon: Users, label: "Members" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/blogs", icon: FileText, label: "Blogs" },
  { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
]

function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <div className="flex items-center h-16 px-6 border-b border-slate-200">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Scalpel" width={100} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span>← Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Scalpel" width={100} height={32} className="h-8 w-auto" />
            </Link>
          </div>
          <div className="py-6">
            <NavLinks onItemClick={() => setOpen(false)} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span>← Back to Website</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
