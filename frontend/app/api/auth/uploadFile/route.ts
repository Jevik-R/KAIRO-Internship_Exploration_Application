import { NextRequest, NextResponse } from "next/server";
import { UploadClient } from "@uploadcare/upload-client";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

const RESUME_PARSER_URL = process.env.RESUME_PARSER_URL;

export async function POST(req: NextRequest) {
  try {
    // 0. Configuration Check
    if (!RESUME_PARSER_URL) {
      console.error("FATAL: RESUME_PARSER_URL environment variable is not set.");
      return NextResponse.json({ 
        error: "Server configuration error: Resume parser URL base missing." 
      }, { status: 500 });
    }
    
    // 1. Authentication
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { include: { applicant: true } } },
    });

    if (!session?.user?.applicant) {
      return NextResponse.json(
        { error: "Unauthorized or applicant profile not found" },
        { status: 403 }
      );
    }
    
    const applicantId = session.user.applicant.id;
    const userId = session.user.id; // Needed to update the User model

    // 2. Parse Request Body
    const body = await req.json();
    const { fileBase64, fileName } = body;

    if (!fileBase64 || typeof fileBase64 !== 'string') {
      return NextResponse.json({ error: "Missing or invalid file data" }, { status: 400 });
    }

    // 3. Upload File to Uploadcare
    const client = new UploadClient({
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
    });

    const fileBuffer = Buffer.from(fileBase64, "base64");
    const safeFileName = fileName || "upload.pdf";

    console.log(`INFO: Uploading file ${safeFileName} to Uploadcare...`);
    const uploadedFile = await client.uploadFile(fileBuffer, {
      fileName: safeFileName,
      store: true,
    });

    const cdnUrl = `https://720nna3ivj.ucarecd.net/${uploadedFile.uuid}/${fileName || "file.pdf"}`;

    // 4. Call FastAPI Resume Parser
    console.log(`INFO: Calling external resume parser...`);
    
    let parsedResumeData: any = null;
    try {
      const parserResponse = await fetch(RESUME_PARSER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cdnUrl }),
      });

      if (parserResponse.ok) {
        parsedResumeData = await parserResponse.json();
        console.log('INFO: Resume parsing successful.');
      } else {
        console.error(`ERROR: Parser returned status ${parserResponse.status}`);
      }
    } catch (error) {
      console.error('ERROR: Failed to call parser:', error);
    }

    // 5. Prepare Applicant Update Data
    // We explicitly define this object to ensure no 'name' field slips in
    const applicantUpdateData: any = { 
      resumeLink: cdnUrl,
    };

    if (parsedResumeData) {
      // Schema Fix: rawResumeText is Json, so pass object directly
      applicantUpdateData.rawResumeText = parsedResumeData;
      
      applicantUpdateData.phoneNumber = parsedResumeData.phone ? [parsedResumeData.phone] : [];
      applicantUpdateData.skills = Array.isArray(parsedResumeData.skills) ? parsedResumeData.skills : [];
      applicantUpdateData.linkedInLink = parsedResumeData.linkedin || null;
      applicantUpdateData.githubLink = parsedResumeData.github || null;
      applicantUpdateData.portfolioLink = parsedResumeData.portfolio || null;

      // Map Education
      if (parsedResumeData.college || parsedResumeData.course) {
        const newEducationEntry = {
            id: uuidv4(),
            institution: parsedResumeData.college || "",
            degree: parsedResumeData.course || "",
            year: parsedResumeData.year || "",
            grade: parsedResumeData.cgpa || "",
            board: "" 
        };
        
        // Append to existing education if available
        const currentEducation = (session.user.applicant.education as any[]) || [];
        applicantUpdateData.education = [...currentEducation, newEducationEntry];
      }
    }

    // 6. Perform Updates (Parallel)
    const promises = [];

    // Update A: Applicant Profile (resume link, skills, etc.)
    promises.push(
      prisma.applicant.update({
        where: { id: applicantId },
        data: applicantUpdateData,
      })
    );

    // Update B: User Name (Only if found in resume and strictly on User model)
    if (parsedResumeData?.name) {
      // Optional: Only update if the user doesn't have a name yet?
      // For now, we overwrite based on the resume.
      promises.push(
        prisma.user.update({
          where: { id: userId },
          data: { name: parsedResumeData.name },
        })
      );
    }

    await Promise.all(promises);

    // 7. Return Success
    return NextResponse.json({ 
      message: "File uploaded and parsed successfully", 
      fileUrl: cdnUrl,
      parsedData: parsedResumeData
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}