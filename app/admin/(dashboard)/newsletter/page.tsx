import { createClient } from "@/lib/supabase/server"
import { NewsletterHeader } from "@/components/admin/newsletter/newsletter-header"
import { SubscribersTable } from "@/components/admin/newsletter/subscribers-table"
import { ComposeEmailDialog } from "@/components/admin/newsletter/compose-email-dialog"
import type { NewsletterSubscriber } from "@/lib/types"

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; action?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })

  if (params.status === "active") {
    query = query.eq("is_active", true)
  } else if (params.status === "inactive") {
    query = query.eq("is_active", false)
  }

  if (params.search) {
    query = query.ilike("email", `%${params.search}%`)
  }

  const { data: subscribers } = await query

  // Get counts
  const { data: allSubscribers } = await supabase.from("newsletter_subscribers").select("is_active")
  const counts = {
    all: allSubscribers?.length || 0,
    active: allSubscribers?.filter((s) => s.is_active).length || 0,
    inactive: allSubscribers?.filter((s) => !s.is_active).length || 0,
  }

  return (
    <div className="space-y-6">
      <NewsletterHeader counts={counts} currentStatus={params.status || "all"} />
      <SubscribersTable subscribers={(subscribers as NewsletterSubscriber[]) || []} />
      <ComposeEmailDialog
        open={params.action === "compose"}
        subscribers={(subscribers as NewsletterSubscriber[]) || []}
      />
    </div>
  )
}
