import { HeroSection } from "@/components/home/hero-section"
import { PastEventsSlider } from "@/components/home/past-events-slider"
import { WhyChooseSection } from "@/components/home/why-choose-section"
import { StatsSection } from "@/components/home/stats-section"
import { EventsPreviewSection } from "@/components/home/events-preview-section"
import { ContactSection } from "@/components/home/contact-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { BlogPreviewSection } from "@/components/home/blog-preview-section"
import { createClient } from "@/lib/supabase/server"
import { SummitPopup } from "@/components/summit-popup"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: summitEvent } = await supabase
    .from("events")
    .select("*")
    .eq("is_summit_2026", true)
    .single()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scalpel",
    url: "https://scalpelsurgery.org",
    logo: "https://scalpelsurgery.org/logo.png",
    description: "Join a comprehensive academic platform where interdisciplinary collaboration meets continuous professional development. Elevate your surgical expertise with evidence-based programs.",
    sameAs: [
      // Add social media links if known
      "https://www.facebook.com/share/18AZ7qCCgA/?mibextid=wwXIfr",
      "https://www.instagram.com/scalpel",
      "https://www.linkedin.com/company/scalpel"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SummitPopup event={summitEvent} />
      <HeroSection />
      <EventsPreviewSection />
      <WhyChooseSection />
      <StatsSection />
      <PastEventsSlider />
      <BlogPreviewSection />
      <ContactSection />
      <NewsletterSection />
    </>
  )
}
