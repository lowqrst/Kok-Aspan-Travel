import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const published = searchParams.get("published");

  const tours = await prisma.tour.findMany({
    where: {
      ...(category && category !== "all" ? { category } : {}),
      ...(published !== "false" ? { isPublished: true } : {}),
    },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tours);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tour = await prisma.tour.create({
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
  return NextResponse.json(tour, { status: 201 });
}
