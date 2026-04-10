import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const tourId = formData.get("tourId") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

  if (tourId) {
    const image = await prisma.image.create({
      data: { url, tourId, order },
    });
    return NextResponse.json(image);
  }

  return NextResponse.json({ url });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.image.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
