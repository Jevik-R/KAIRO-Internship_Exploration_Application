import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const applications = await prisma.internshipApplication.findMany({
      where: {
        applicantId: userId,
      },
      include: {
        internship: {
          include: {
            company: {
              select: {
                name: true, 
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied internships:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}