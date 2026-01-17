"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/summit-2026", label: "Summit 2026" },
  { href: "/blog", label: "Blogs" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          "w-full z-50 transition-all duration-300",
          isScrolled ? "fixed top-0 left-0 right-0 bg-white backdrop-blur-md shadow-lg" : "relative bg-white",
        )}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Scalpel Logo"
                  width={50}
                  height={50}
                  className={cn(
                    "object-contain transition-all duration-300",
                    isScrolled ? "w-8 h-8 sm:w-9 sm:h-9" : "w-9 h-9 sm:w-11 sm:h-11",
                  )}
                />
                <span className="font-bold tracking-tight text-black text-base sm:text-lg lg:text-xl">SCALPEL</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-black/90 hover:text-primary px-3 xl:px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="hidden lg:flex items-center">
                <Link href="/about">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white px-6">
                    About Us
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
              </button>
            </nav>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden fixed inset-0 top-14 sm:top-16 bg-white z-40 transition-all duration-300 ",
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none",
          )}
        >
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors py-3.5 px-4 rounded-lg font-medium text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-4 pt-4 pb-8 border-t border-slate-100">
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white">
                  About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      {isScrolled && <div className="h-14 sm:h-16 lg:h-18" />}
    </>
  )
}
