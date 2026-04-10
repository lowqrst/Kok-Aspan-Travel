import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.settings.findUnique({ where: { id: "main" } });
  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "main", whatsappNum: "77059652303", companyName: "Altosh Travel" },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const settings = await prisma.settings.upsert({
    where: { id: "main" },
    update: { whatsappNum: body.whatsappNum, companyName: body.companyName, contactInfo: body.contactInfo },
    create: { id: "main", whatsappNum: body.whatsappNum, companyName: body.companyName, contactInfo: body.contactInfo },
  });
  return NextResponse.json(settings);
}
