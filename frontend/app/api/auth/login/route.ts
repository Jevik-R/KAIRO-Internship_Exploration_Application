import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

interface JwtPayload {
    email: string;
    role: string;
}

export async function POST(req: NextRequest) {
    console.log("Running login handler...");

    try {
        const { email, password, role } = await req.json();

        //Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        //Validate role
        const validRoles = ["APPLICANT", "RECRUITER"];
        const normalizedRole = role?.toUpperCase();
        if (!validRoles.includes(normalizedRole)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        //Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        //Verify password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        //Verify role matches (if enforced)
        if (existingUser.role.toUpperCase() !== normalizedRole) {
            return NextResponse.json(
                { error: "Role does not match this account" },
                { status: 400 }
            );
        }

        //Create JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(
            {
                email: existingUser.email,
                role: existingUser.role,
            } as JwtPayload,
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        //Optionally set token as a cookie (for secure auth)
        const response = NextResponse.json(
            { success: true, message: "Login successful", token },
            { status: 200 }
        );

        // Secure HttpOnly cookie option (recommended for production)
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60, // 24 hour
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
