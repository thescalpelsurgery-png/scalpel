import Image from "next/image"
import { MembershipForm } from "@/components/membership/membership-form"

export const metadata = {
  title: "Become a Member | Scalpel",
  description: "Join the Scalpel community and become a member of our global network of surgical professionals.",
}

export default function BecomeMemberPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Image (hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:w-1/2 xl:w-2/5 relative">
          <Image
            src="/medical-education-classroom-with-students-and-digi.jpg"
            alt="Medical team collaboration"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
          <div className="absolute inset-0 flex items-center justify-center p-8 xl:p-12">
            <div className="text-white max-w-md">
              <h2 className="text-2xl xl:text-3xl font-bold mb-4">Join the Scalpel Community</h2>
              <p className="text-white/80 leading-relaxed mb-6 text-sm xl:text-base">
                Become a member and start your journey to surgical excellence with access to world-class education and a
                global network of professionals.
              </p>
              <ul className="space-y-3 text-white/90 text-sm xl:text-base">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                  Access 200+ educational resources
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                  Connect with 5000+ surgeons worldwide
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                  Earn CME credits and certifications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                  Exclusive event discounts
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-8 overflow-y-auto">
          <div className="w-full max-w-md sm:max-w-lg">
            {/* Mobile/Tablet header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">Become a Member</h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Join Scalpel and unlock your path to surgical excellence.
              </p>
            </div>

            <MembershipForm />
          </div>
        </div>
      </div>
    </div>
  )
}
