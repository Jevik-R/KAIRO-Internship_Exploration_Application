import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (user.role === "APPLICANT") {
      // Fetch recent applications (last 5)
      const recentApplications = await prisma.internshipApplication.findMany({
        where: { applicantId: user.id },
        include: { internship: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      })

      const activities = recentApplications.map((app) => ({
        icon: getStatusIcon(app.status),
        title: `Application ${getStatusText(app.status)}`,
        description: app.internship.title,
        date: new Date(app.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }))

      return NextResponse.json({ activities })
    }

    return NextResponse.json({ activities: [] })
  } catch (error) {
    console.error("[v0] Activities error:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "✅"
    case "REJECTED":
      return "❌"
    case "PENDING":
      return "⏳"
    case "REVIEWED":
      return "👀"
    default:
      return "📝"
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "Accepted"
    case "REJECTED":
      return "Rejected"
    case "PENDING":
      return "Submitted"
    case "REVIEWED":
      return "Under Review"
    default:
      return "Created"
  }
}
