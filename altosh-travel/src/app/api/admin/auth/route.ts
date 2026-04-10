import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Return simple session token (for simplicity, we use cookie-based approach)
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-session");
  return response;
}
