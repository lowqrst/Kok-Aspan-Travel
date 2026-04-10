import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TourForm from "@/components/admin/TourForm";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!tour) return notFound();

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>
          Редактировать тур
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{tour.title}</p>
      </div>
      <TourForm initialData={{
        id: tour.id,
        title: tour.title,
        titleKz: tour.titleKz,
        description: tour.description,
        descriptionKz: tour.descriptionKz,
        route: tour.route || "",
        routeKz: tour.routeKz || "",
        price: String(tour.price),
        childPrice: tour.childPrice ? String(tour.childPrice) : "",
        duration: String(tour.duration),
        category: tour.category,
        isPublished: tour.isPublished,
        images: tour.images,
      }} />
    </div>
  );
}
