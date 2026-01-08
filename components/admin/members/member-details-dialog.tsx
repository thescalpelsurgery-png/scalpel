import type { Member } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface MemberDetailsDialogProps {
  member: Member | null
  onClose: () => void
}

export function MemberDetailsDialog({ member, onClose }: MemberDetailsDialogProps) {
  if (!member) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>
              {member.first_name} {member.last_name}
            </span>
            {getStatusBadge(member.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="font-medium">{member.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Specialty</p>
                <p className="font-medium">{member.specialty}</p>
              </div>
              <div>
                <p className="text-slate-500">Position</p>
                <p className="font-medium">{member.position}</p>
              </div>
              <div>
                <p className="text-slate-500">Institution</p>
                <p className="font-medium">{member.institution}</p>
              </div>
              <div>
                <p className="text-slate-500">Experience</p>
                <p className="font-medium">{member.experience}</p>
              </div>
            </div>
          </div>

          {member.interests && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Areas of Interest</h3>
              <p className="text-sm text-slate-600">{member.interests}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Referral Source</p>
                <p className="font-medium">{member.referral || "Not provided"}</p>
              </div>
              <div>
                <p className="text-slate-500">Newsletter</p>
                <p className="font-medium">{member.subscribed_newsletter ? "Subscribed" : "Not subscribed"}</p>
              </div>
              <div>
                <p className="text-slate-500">Applied On</p>
                <p className="font-medium">{new Date(member.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Last Updated</p>
                <p className="font-medium">{new Date(member.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
