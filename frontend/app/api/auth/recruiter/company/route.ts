import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("id");

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Recruiter ID is required" },
        { status: 400 }
      );
    }

    const recruiterData = await prisma.recruiter.findUnique({
      where: {
        userId: recruiterId, 
      },
      select: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            website: true,
            overview: true,
            companySize: true,
            location: true,
            establishedYear: true,
          },
        },
      },
    });

    if (!recruiterData) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    if (!recruiterData.company) {
      return NextResponse.json(
        { error: "No company profile associated with this recruiter account" },
        { status: 404 }
      );
    }

    return NextResponse.json(recruiterData.company, { status: 200 });

  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}