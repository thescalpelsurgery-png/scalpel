import Link from "next/link"
import Image from "next/image"
import { Facebook, MessageCircle, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-background text-primary-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Scalpel Logo"
                width={50}
                height={50}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <span className="text-lg md:text-xl font-bold">SCALPEL</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-primary-foreground max-w-xs">
              Advancing surgical excellence through innovation, collaboration, and continuous professional growth.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://lnkd.in/eeQXqwtz"
                target="_blank"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 transition-colors flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-slate-900" />
              </Link>
              <Link
                href="https://www.instagram.com/the.scalpel.surgery"
                target="_blank"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-slate-900" />
              </Link>
              <Link
                href="https://m.facebook.com/profile.php?id=61586660913489"
                target="_blank"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Facebook className="w-4 h-4 text-slate-900" />
              </Link>
              <Link
                href="https://wa.me/message/5EVJKUTQSZC4J1"
                target="_blank"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <MessageCircle className="w-4 h-4 text-slate-900" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3 text-primary-foreground">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Events", href: "/events" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-white/80 transition-colors text-xs md:text-sm text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Contact */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start gap-2 md:gap-3 text-xs md:text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                <span className="text-primary-foreground">Ayub Teaching Hospital, Abbottabad, KP, Pakistan.</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <Phone className="w-4 h-4 shrink-0 text-secondary" />
                <span className="text-primary-foreground">+92 341 5931072</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <Mail className="w-4 h-4 shrink-0 text-secondary" />
                <span className="text-primary-foreground">support@scalpelsurgery.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-center sm:text-left text-secondary">
            © 2026 SCALPEL. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
            <Link href="#" className="hover:text-white/80 transition-colors text-primary-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white/80 transition-colors text-primary-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white/80 transition-colors text-primary-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
