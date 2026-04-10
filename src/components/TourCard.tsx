"use client";

import { useState } from "react";
import Image from "next/image";
import BookingModal from "./BookingModal";
import { useLang } from "@/context/LangContext";

interface TourImage {
  id: string;
  url: string;
  order: number;
}

interface Tour {
  id: string;
  title: string;
  titleKz: string;
  description: string;
  descriptionKz: string;
  price: number;
  childPrice: number | null;
  duration: number;
  category: string;
  images: TourImage[];
}

const categoryIcons: Record<string, string> = {
  mountains: "🏔",
  lakes: "🏞",
  steppe: "🌾",
  cities: "🏙",
  adventure: "🧗",
};

const categoryColors: Record<string, string> = {
  mountains: "#3b82f6",
  lakes: "#06b6d4",
  steppe: "#f59e0b",
  cities: "#8b5cf6",
  adventure: "#ef4444",
};

export default function TourCard({ tour }: { tour: Tour }) {
  const { lang, t } = useLang();
  const [showBooking, setShowBooking] = useState(false);
  const [imgError, setImgError] = useState(false);

  const title = lang === "kz" && tour.titleKz ? tour.titleKz : tour.title;
  const description = lang === "kz" && tour.descriptionKz ? tour.descriptionKz : tour.description;
  const mainImage = tour.images[0]?.url;
  const icon = categoryIcons[tour.category] || "🌍";
  const color = categoryColors[tour.category] || "#2d9966";

  return (
    <>
      <div className="tour-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Image */}
        <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
          {mainImage && !imgError ? (
            <Image
              src={mainImage}
              alt={title}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              onError={() => setImgError(true)}
              onMouseEnter={(e) => { (e.currentTarget.style.transform = "scale(1.08)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #1a2235 0%, #0f4a32 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 64,
            }}>
              {icon}
            </div>
          )}

          {/* Category badge */}
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: color + "22",
            backdropFilter: "blur(10px)",
            border: `1px solid ${color}44`,
            color: color,
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {icon} {t.categories[tour.category as keyof typeof t.categories] || tour.category}
          </div>

          {/* Duration badge */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            color: "white",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
          }}>
            🕐 {tour.duration} {t.tours.days}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{title}</h3>

          <p style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 14,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {description}
          </p>

          {/* Price */}
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>
                  {t.tours.from}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#2d9966" }}>
                  {tour.price.toLocaleString()} ₸
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                    {" "}{t.tours.perPerson}
                  </span>
                </div>
                {tour.childPrice && (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Детский: {tour.childPrice.toLocaleString()} ₸
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="btn-primary"
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {t.tours.bookNow}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          tour={{ id: tour.id, title }}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}
