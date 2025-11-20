import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Generate unique Login ID
function generateLoginId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "COMP-";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      industry,
      website,
      password,
      establishedYear,
      companySize,
      location,
      overview,
    } = body;

    // Validate required fields
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!industry) missing.push("industry");
    if (!website) missing.push("website");
    if (!password) missing.push("password");
    if (!companySize) missing.push("companySize");
    if (!location) missing.push("location");
    if (!overview) missing.push("overview");
    if (!establishedYear) missing.push("establishedYear");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate establishedYear
    const estYear = Number(establishedYear);
    if (isNaN(estYear) || estYear < 1800 || estYear > new Date().getFullYear()) {
      return NextResponse.json(
        { error: "Invalid establishedYear value" },
        { status: 400 }
      );
    }

    // Create company entry
    const company = await prisma.company.create({
      data: {
        name,
        industry,
        website,
        companySize,
        location,
        overview,
        establishedYear: estYear,
      },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create unique login ID
    let createdLoginId: string | null = null;
    for (let attempts = 0; attempts < 5; attempts++) {
      const loginId = generateLoginId();

      try {
        await prisma.companyAuth.create({
          data: {
            companyId: company.id,
            loginId,
            password: hashedPassword,
          },
        });
        createdLoginId = loginId;
        break;
      } catch (err: any) {
        if (err?.code !== "P2002") throw err; // unique constraint error
      }
    }

    if (!createdLoginId) {
      return NextResponse.json(
        { error: "Failed to generate a unique login ID" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Company registered successfully",
        company: {
          id: company.id,
          name: company.name,
        },
        loginId: createdLoginId,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
