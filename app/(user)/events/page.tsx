import { EventsHero } from "@/components/events/events-hero"
import { EventsFilter } from "@/components/events/events-filter"
import { EventsList } from "@/components/events/events-list"
import { PastEvents } from "@/components/events/past-events"

export const metadata = {
  title: "Events | Scalpel",
  description: "Explore upcoming workshops, conferences, and masterclasses in surgical education.",
}

export const dynamic = "force-dynamic"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  return (
    <>
      <EventsHero />
      <EventsFilter />
      <EventsList searchParams={resolvedSearchParams} />
      <PastEvents />
    </>
  )
}
