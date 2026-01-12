import { HeroSection } from "@/components/home/hero-section"
import { PastEventsSlider } from "@/components/home/past-events-slider"
import { WhyChooseSection } from "@/components/home/why-choose-section"
import { StatsSection } from "@/components/home/stats-section"
import { EventsPreviewSection } from "@/components/home/events-preview-section"
import { ContactSection } from "@/components/home/contact-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { BlogPreviewSection } from "@/components/home/blog-preview-section"

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scalpel",
    url: "https://scalpel.org",
    logo: "https://scalpel.org/logo.png",
    description: "Join a comprehensive academic platform where interdisciplinary collaboration meets continuous professional development. Elevate your surgical expertise with evidence-based programs.",
    sameAs: [
      // Add social media links if known
      "https://www.facebook.com/scalpel",
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
      <HeroSection />
      <PastEventsSlider />
      <WhyChooseSection />
      <StatsSection />
      <EventsPreviewSection />
      <BlogPreviewSection />
      <ContactSection />
      <NewsletterSection />
    </>
  )
}
