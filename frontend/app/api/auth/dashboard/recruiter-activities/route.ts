import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock recent activities for recruiters
    const activities = [
      {
        icon: "✅",
        title: "Candidate Hired",
        description: "John Smith accepted offer for Frontend Developer position",
        date: "2 hours ago",
      },
      {
        icon: "📝",
        title: "New Application",
        description: "Sarah Johnson applied for Backend Engineer Intern",
        date: "5 hours ago",
      },
      {
        icon: "📅",
        title: "Interview Scheduled",
        description: "Interview with Michael Chen for UI/UX Design Intern",
        date: "1 day ago",
      },
      {
        icon: "📢",
        title: "Listing Published",
        description: "Full Stack Developer Intern position is now live",
        date: "2 days ago",
      },
    ]

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("[v0] Recruiter activities error:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
