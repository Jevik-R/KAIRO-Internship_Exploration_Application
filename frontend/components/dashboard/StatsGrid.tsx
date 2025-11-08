"use client"

import { useEffect, useState } from "react"
import DashboardCard from "./DashboardCard"

interface StatsData {
  totalApplications: number
  acceptedApplications: number
  reviewedApplications: number
  pendingApplications: number
  savedInternships: number
  upcomingInterviews: number
  lastActivityDate: string
}

interface StatsGridProps {
  userId: string
}

export default function StatsGrid({ userId }: StatsGridProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/auth/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground">Failed to load stats</div>
  }

  const lastActivityDate = new Date(stats.lastActivityDate)
  const formattedDate = lastActivityDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        icon="🎯"
        label="Total Applications"
        value={stats.totalApplications}
        description="Submitted applications"
      />
      <DashboardCard
        icon="💼"
        label="Saved Internships"
        value={stats.savedInternships}
        description="Bookmarked opportunities"
      />
      <DashboardCard
        icon="✅"
        label="Applications Accepted"
        value={stats.acceptedApplications}
        description="Offers received"
      />
      <DashboardCard
        icon="⏳"
        label="Pending Responses"
        value={stats.pendingApplications}
        description="Awaiting decisions"
      />
      <DashboardCard
        icon="📅"
        label="Upcoming Interviews"
        value={stats.upcomingInterviews}
        description="Scheduled interviews"
      />
      <DashboardCard
        icon="🕒"
        label="Last Activity"
        value={formattedDate}
        description="Last login or submission"
        isDate
      />
    </div>
  )
}
