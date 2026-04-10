import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tour);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const tour = await prisma.tour.update({
    where: { id },
    data: {
      title: body.title,
      titleKz: body.titleKz || "",
      description: body.description,
      descriptionKz: body.descriptionKz || "",
      route: body.route,
      routeKz: body.routeKz,
      price: parseFloat(body.price),
      childPrice: body.childPrice ? parseFloat(body.childPrice) : null,
      duration: parseInt(body.duration),
      category: body.category,
      isPublished: body.isPublished ?? false,
    },
  });
  return NextResponse.json(tour);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
