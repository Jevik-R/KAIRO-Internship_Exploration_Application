import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { internshipId, userId, coverLetter, resumeUrl } = body;

    if (!internshipId || !userId) {
      return NextResponse.json(
        { error: "internshipId and userId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        role: true, 
        gender: true,
        name: true,      
        email: true,     
        applicant: {     
            select: {
                skills: true,
                rawResumeText: true
            }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    
    if (!user.name || !user.name.trim()) {
      return NextResponse.json(
        { error: "Please complete your profile: Name is required before applying." },
        { status: 400 }
      );
    }

    if (!user.email || !user.email.trim()) {
      return NextResponse.json(
        { error: "Please complete your profile: Email is required before applying." },
        { status: 400 }
      );
    }

    const hasSkills = user.applicant?.skills && user.applicant.skills.length > 0;

    if (!hasSkills) {
      return NextResponse.json(
        { error: "Please add at least one skill to your applicant profile before applying." },
        { status: 400 }
      );
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    const existingApp = await prisma.internshipApplication.findUnique({
      where: {
        internshipId_applicantId: {
          internshipId,
          applicantId: userId,
        },
      },
    });

    if (existingApp) {
      return NextResponse.json(
        { message: "You have already applied for this internship" },
        { status: 409 }
      );
    }

    const [application] = await prisma.$transaction([
      prisma.internshipApplication.create({
        data: {
          internshipId,
          applicantId: userId,
          coverLetter,
          resumeUrl,
          gender: user.gender,
          resumeData: user.applicant?.rawResumeText ?? undefined,
        },
      }),
      prisma.internship.update({
        where: { id: internshipId },
        data: { applicationsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error applying for internship:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}