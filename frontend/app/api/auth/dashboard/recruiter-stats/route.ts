import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock data for recruiter stats
    // In production, these would query actual internship and application tables
    const activeListings = 12
    const totalApplicants = 247
    const hiredCandidates = 8
    const shortlistedCandidates = 23
    const pendingReviews = 45
    const upcomingInterviews = 15

    return NextResponse.json({
      activeListings,
      totalApplicants,
      hiredCandidates,
      shortlistedCandidates,
      pendingReviews,
      upcomingInterviews,
    })
  } catch (error) {
    console.error("[v0] Recruiter stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
