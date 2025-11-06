import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recruiterId = searchParams.get("recruiterId")

    if (!recruiterId) {
      return NextResponse.json({ error: "Recruiter ID required" }, { status: 400 })
    }

    // Mock data for recruiter internships
    // In production, this would query the actual internships table
    const mockInternships = [
      {
        id: "1",
        title: "Frontend Developer Intern",
        description:
          "Join our team to build modern web applications using React and TypeScript. You'll work on real projects and learn from experienced developers.",
        location: "Remote",
        type: "Full-time",
        status: "ACTIVE",
        applicantsCount: 45,
      },
      {
        id: "2",
        title: "Backend Engineer Intern",
        description:
          "Work with our backend team to develop scalable APIs and microservices. Experience with Node.js and databases preferred.",
        location: "San Francisco, CA",
        type: "Part-time",
        status: "ACTIVE",
        applicantsCount: 32,
      },
      {
        id: "3",
        title: "UI/UX Design Intern",
        description:
          "Help design beautiful and intuitive user interfaces. You'll collaborate with product managers and developers to create amazing user experiences.",
        location: "New York, NY",
        type: "Full-time",
        status: "ACTIVE",
        applicantsCount: 28,
      },
    ]

    return NextResponse.json({ internships: mockInternships })
  } catch (error) {
    console.error("[v0] Recruiter internships error:", error)
    return NextResponse.json({ error: "Failed to fetch internships" }, { status: 500 })
  }
}
