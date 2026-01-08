import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, Mail, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts
  const [membersRes, eventsRes, blogsRes, subscribersRes] = await Promise.all([
    supabase.from("members").select("id, status", { count: "exact" }),
    supabase.from("events").select("id, is_past", { count: "exact" }),
    supabase.from("blogs").select("id, is_published", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id, is_active", { count: "exact" }),
  ])

  const totalMembers = membersRes.count || 0
  const pendingMembers = membersRes.data?.filter((m) => m.status === "pending").length || 0
  const totalEvents = eventsRes.count || 0
  const upcomingEvents = eventsRes.data?.filter((e) => !e.is_past).length || 0
  const totalBlogs = blogsRes.count || 0
  const publishedBlogs = blogsRes.data?.filter((b) => b.is_published).length || 0
  const totalSubscribers = subscribersRes.count || 0
  const activeSubscribers = subscribersRes.data?.filter((s) => s.is_active).length || 0

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      subtitle: `${pendingMembers} pending approval`,
      icon: Users,
      href: "/admin/members",
      color: "bg-blue-500",
    },
    {
      title: "Events",
      value: totalEvents,
      subtitle: `${upcomingEvents} upcoming`,
      icon: Calendar,
      href: "/admin/events",
      color: "bg-green-500",
    },
    {
      title: "Blog Posts",
      value: totalBlogs,
      subtitle: `${publishedBlogs} published`,
      icon: FileText,
      href: "/admin/blogs",
      color: "bg-purple-500",
    },
    {
      title: "Subscribers",
      value: totalSubscribers,
      subtitle: `${activeSubscribers} active`,
      icon: Mail,
      href: "/admin/newsletter",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">Welcome to the Scalpel admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-slate-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm">Activity feed will appear here as data is added.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-slate-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/events?action=new"
              className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <p className="font-medium text-slate-900">Create New Event</p>
              <p className="text-sm text-slate-500">Add a new conference, workshop, or seminar</p>
            </Link>
            <Link
              href="/admin/blogs?action=new"
              className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <p className="font-medium text-slate-900">Write Blog Post</p>
              <p className="text-sm text-slate-500">Create and publish new content</p>
            </Link>
            <Link
              href="/admin/members?status=pending"
              className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <p className="font-medium text-slate-900">Review Pending Members</p>
              <p className="text-sm text-slate-500">Approve or reject membership applications</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
