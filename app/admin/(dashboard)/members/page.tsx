import { createClient } from "@/lib/supabase/server"
import { MembersTable } from "@/components/admin/members/members-table"
import { MembersHeader } from "@/components/admin/members/members-header"
import type { Member } from "@/lib/types"

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  // const params = await searchParams
  // const supabase = await createClient()

  // let query = supabase.from("members").select("*").order("created_at", { ascending: false })

  // if (params.status && params.status !== "all") {
  //   query = query.eq("status", params.status)
  // }

  // if (params.search) {
  //   query = query.or(
  //     `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
  //   )
  // }

  // const { data: members, error } = await query

  // // Get counts for each status
  // const { data: allMembers } = await supabase.from("members").select("status")
  // const counts = {
  //   all: allMembers?.length || 0,
  //   pending: allMembers?.filter((m) => m.status === "pending").length || 0,
  //   approved: allMembers?.filter((m) => m.status === "approved").length || 0,
  //   rejected: allMembers?.filter((m) => m.status === "rejected").length || 0,
  // }

  return (
    <div className="space-y-6">
      {/* <MembersHeader counts={counts} currentStatus={params.status || "all"} />
      <MembersTable members={(members as Member[]) || []} /> */}
    </div>
  )
}
