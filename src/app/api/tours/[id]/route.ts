import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  
  // 1. Find the tour and its images
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { images: true }
  });

  if (tour && tour.images.length > 0) {
    // 2. Delete each image from Cloudinary
    for (const image of tour.images) {
      try {
        const url = image.url;
        const parts = url.split("/");
        const lastPart = parts[parts.length - 1]; 
        const publicId = lastPart.split(".")[0];
        const folderMatch = url.match(/\/v\d+\/(.+)\/[^/]+$/);
        const folder = folderMatch && folderMatch[1] !== "upload" ? folderMatch[1] : "altosh-travel";
        const fullPublicId = `${folder}/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (e) {
        console.error("Failed to delete image from Cloudinary:", image.url, e);
      }
    }
  }

  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
