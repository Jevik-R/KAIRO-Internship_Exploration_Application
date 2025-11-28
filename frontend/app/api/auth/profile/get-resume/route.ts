import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the Applicant profile linked to this User ID
    const applicant = await prisma.applicant.findUnique({
      where: { userId: userId }, // Uses the @unique relation
      select: { resumeLink: true },
    });

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant profile not found" },
        { status: 404 }
      );
    }

    if (!applicant.resumeLink) {
      return NextResponse.json(
        { error: "No resume found in your profile. Please upload one." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { resumeLink: applicant.resumeLink },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}