import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import StatsGrid from "@/components/dashboard/StatsGrid"
import RecentActivityCard from "@/components/dashboard/RecentActivityCard"
import ActivityChart from "@/components/dashboard/ActivityChart"
import SuccessGauge from "@/components/dashboard/SuccessGauge"

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user || user.role !== "APPLICANT") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader user={user} />
        <div className="grid gap-8 mt-8">
          <ActivityChart userId={user.id} />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StatsGrid userId={user.id} />
            </div>
            <SuccessGauge userId={user.id} />
          </div>
          <RecentActivityCard userId={user.id} />
        </div>
      </div>
    </div>
  )
}
