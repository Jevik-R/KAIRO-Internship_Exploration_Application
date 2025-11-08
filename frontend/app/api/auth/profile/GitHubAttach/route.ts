import { NextRequest, NextResponse } from "next/server";
import { getGitHubUser } from "@/lib/GithubAPI";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  console.log("Received request to attach GitHub profile");

  try {
    // Authenticate the request
    const currentUser = await requireAuth();

    // Parse request body
    const { githubLink, userId } = await req.json();

    if (!githubLink) {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Prevent users from editing others' accounts
    if (currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: user mismatch" },
        { status: 403 }
      );
    }


    // Clean up username if a full GitHub URL was pasted
    const cleanUsername = githubLink
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .split("/")[0];

    console.log("Cleaned GitHub username:", cleanUsername);

    // Fetch GitHub user data
    const githubUser = await getGitHubUser(cleanUsername);
    const fullLink = `https://github.com/${cleanUsername}`;

    // Save to Applicant model
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { githubLink },
      create: { userId, githubLink },
      select: { id: true, githubLink: true },
    });

    return NextResponse.json({
      message: "GitHub profile linked successfully",
      githubData: githubUser,
      applicant: updatedApplicant,
    });
  } catch (error: unknown) {
    console.error("Error attaching GitHub profile:", error);

    let message = "Internal Server Error";
    let status = 500;

    if (error instanceof Error) {
      message = error.message;
      if (message.includes("Unauthorized")) status = 401;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
