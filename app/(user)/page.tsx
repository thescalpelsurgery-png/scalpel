import { HeroSection } from "@/components/home/hero-section"
import { PastEventsSlider } from "@/components/home/past-events-slider"
import { WhyChooseSection } from "@/components/home/why-choose-section"
import { StatsSection } from "@/components/home/stats-section"
import { EventsPreviewSection } from "@/components/home/events-preview-section"
import { ContactSection } from "@/components/home/contact-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { BlogPreviewSection } from "@/components/home/blog-preview-section"

export default function HomePage() {
  return (
    <>
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
