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
      // Get applications from the last 6 months
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const applications = await prisma.internshipApplication.findMany({
        where: {
          applicantId: user.id,
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      // Group by month
      const monthlyData = new Map<string, number>()
      const months = []

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toLocaleDateString("en-US", { month: "short" })
        months.push(monthKey)
        monthlyData.set(monthKey, 0)
      }

      // Count applications per month
      applications.forEach((app) => {
        const monthKey = app.createdAt.toLocaleDateString("en-US", { month: "short" })
        if (monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1)
        }
      })

      // Format for chart
      const chartData = months.map((month) => ({
        month,
        applications: monthlyData.get(month) || 0,
      }))

      return NextResponse.json({ chartData })
    }

    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      months.push(monthKey)
    }

    const chartData = months.map((month) => ({
      month,
      applications: 0,
    }))

    return NextResponse.json({ chartData })
  } catch (error) {
    console.error("[v0] Activity chart error:", error)
    return NextResponse.json({ error: "Failed to fetch activity data" }, { status: 500 })
  }
}
