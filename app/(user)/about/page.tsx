import { AboutHero } from "@/components/about/about-hero"
import { MissionVision } from "@/components/about/mission-vision"
import { TeamSection } from "@/components/about/team-section"
import { Timeline } from "@/components/about/timeline"
import { EducationalApproach } from "@/components/about/educational-approach"
import { PartnersSection } from "@/components/about/partners-section"

export const metadata = {
  title: "About Us | Scalpel",
  description: "Learn about Scalpel's mission to advance surgical education and professional development worldwide.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <EducationalApproach />
      <Timeline />
      {/* <TeamSection /> */}
      <PartnersSection />
    </>
  )
}
