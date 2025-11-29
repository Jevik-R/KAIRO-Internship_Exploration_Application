import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const recruitersId = searchParams.get("recruiterId");

    if (!recruitersId) {
      return NextResponse.json(
        { error: "Missing recruiterId" },
        { status: 400 }
      );
    }
    const recruiter = await prisma.recruiter.findUnique({
      where: {userId :recruitersId},
    })
    if (!recruiter) {
        return NextResponse.json(
            { error: "Recruiter not found" },
            { status: 404 }
        );
    }
    const recruiterId = recruiter.id

    const internships = await prisma.internship.findMany({
      where: { recruiterId },
      select: { id: true },
    });

    if (internships.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const internshipIds = internships.map((i) => i.id);

    const applications = await prisma.internshipApplication.findMany({
      where: {
        internshipId: {
          in: internshipIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
