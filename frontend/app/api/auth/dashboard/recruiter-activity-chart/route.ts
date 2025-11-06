import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock data for recruiter activity chart
    // In production, this would aggregate data from internship applications
    const chartData = [
      { month: "Jul", applications: 45, hires: 2 },
      { month: "Aug", applications: 62, hires: 3 },
      { month: "Sep", applications: 78, hires: 5 },
      { month: "Oct", applications: 91, hires: 4 },
      { month: "Nov", applications: 103, hires: 6 },
      { month: "Dec", applications: 87, hires: 3 },
    ]

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("[v0] Recruiter activity chart error:", error)
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 })
  }
}
