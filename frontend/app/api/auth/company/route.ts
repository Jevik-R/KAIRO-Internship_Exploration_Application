import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const recruiters = await prisma.recruiter.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        position: true,
        contactEmail: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(recruiters, { status: 200 });

  } catch (error) {
    console.error("Fetch recruiters error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}