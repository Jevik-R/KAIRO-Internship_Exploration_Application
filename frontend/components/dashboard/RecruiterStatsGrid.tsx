"use client"

import { useEffect, useState } from "react"
import DashboardCard from "./DashboardCard"

interface RecruiterStatsData {
  activeListings: number
  totalApplicants: number
  hiredCandidates: number
  shortlistedCandidates: number
  pendingReviews: number
  upcomingInterviews: number
}

interface RecruiterStatsGridProps {
  userId: string
}

export default function RecruiterStatsGrid({ userId }: RecruiterStatsGridProps) {
  const [stats, setStats] = useState<RecruiterStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/auth/dashboard/recruiter-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching recruiter stats:", error)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        icon="📢"
        label="Active Listings"
        value={stats.activeListings}
        description="Internships currently open"
      />
      <DashboardCard
        icon="🧑‍💻"
        label="Total Applicants"
        value={stats.totalApplicants}
        description="Across all listings"
      />
      <DashboardCard
        icon="✅"
        label="Hired Candidates"
        value={stats.hiredCandidates}
        description="Successfully hired"
      />
      <DashboardCard
        icon="⭐"
        label="Shortlisted"
        value={stats.shortlistedCandidates}
        description="Candidates under consideration"
      />
      <DashboardCard
        icon="⏳"
        label="Pending Review"
        value={stats.pendingReviews}
        description="Applications awaiting review"
      />
      <DashboardCard
        icon="📅"
        label="Upcoming Interviews"
        value={stats.upcomingInterviews}
        description="Scheduled interviews"
      />
    </div>
  )
}
