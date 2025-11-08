import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (user.role === "APPLICANT") {
      // Total applications submitted
      const totalApplications = await prisma.internshipApplication.count({
        where: { applicantId: user.id },
      })

      // Applications by status
      const applicationsByStatus = await prisma.internshipApplication.groupBy({
        by: ["status"],
        where: { applicantId: user.id },
        _count: true,
      })

      const acceptedCount = applicationsByStatus.find((a) => a.status === "ACCEPTED")?._count || 0
      const pendingCount = applicationsByStatus.find((a) => a.status === "PENDING")?._count || 0
      const reviewedCount = applicationsByStatus.find((a) => a.status === "REVIEWED")?._count || 0

      // Get last application created date
      const lastApplication = await prisma.internshipApplication.findFirst({
        where: { applicantId: user.id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      })

      // Get applicant details
      const applicant = await prisma.applicant.findUnique({
        where: { userId: user.id },
        select: {
          linkedInLink: true,
          portfolioLink: true,
          githubLink: true,
        },
      })

      const savedInternships = applicant?.linkedInLink ? 1 : 0
      const upcomingInterviews = 0

      return NextResponse.json({
        totalApplications,
        acceptedApplications: acceptedCount,
        reviewedApplications: reviewedCount,
        pendingApplications: pendingCount,
        savedInternships,
        upcomingInterviews,
        lastActivityDate: lastApplication?.createdAt || user.emailVerified || new Date(),
      })
    }

    return NextResponse.json({
      totalApplications: 0,
      acceptedApplications: 0,
      reviewedApplications: 0,
      pendingApplications: 0,
      savedInternships: 0,
      upcomingInterviews: 0,
      lastActivityDate: new Date(),
    })
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
