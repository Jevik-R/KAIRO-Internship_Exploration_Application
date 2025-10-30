import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: Request) {
  try {
    const user = verifyAuth(req);
    return NextResponse.json({ message: "authorized" ,user}, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
