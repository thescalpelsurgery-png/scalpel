import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { Poppins, Oxygen, Poppins as V0_Font_Poppins, Dosis as V0_Font_Dosis } from 'next/font/google'

// Initialize fonts
const _poppins = V0_Font_Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _dosis = V0_Font_Dosis({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800"] })

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
})
const oxygen = Oxygen({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
})

// <CHANGE> Updated metadata for Scalpel surgical society
export const metadata: Metadata = {
    title: "Scalpel | Master Advanced Surgical Techniques",
    description:
        "Join a comprehensive academic platform where interdisciplinary collaboration meets continuous professional development. Elevate your surgical expertise with evidence-based programs.",
    generator: "v0.app",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`font-sans antialiased`}>
                <Navbar />
                <main>{children}</main>
                <Footer />
                <Analytics />
            </body>
        </html>
    )
}
