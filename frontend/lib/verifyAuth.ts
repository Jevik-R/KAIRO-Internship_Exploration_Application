import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function verifyAuth(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Authorized
    return NextResponse.json({ message: "Authorized", user: decoded }, { status: 200 });

  } catch (error: any) {
    // Unauthorized
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }
}
