"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tour {
  id: string;
  title: string;
  price: number;
  duration: number;
  category: string;
  isPublished: boolean;
  images: { url: string }[];
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  mountains: "🏔 Горы", lakes: "🏞 Озёра", steppe: "🌾 Степи",
  cities: "🏙 Города", adventure: "🧗 Активный",
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadTours = () => {
    fetch("/api/tours?published=false")
      .then((r) => r.json())
      .then((data) => { setTours(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadTours(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить тур «${title}»? Это действие нельзя отменить.`)) return;
    setDeleting(id);
    await fetch(`/api/tours/${id}`, { method: "DELETE" });
    setTours((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  };

  const togglePublish = async (tour: Tour) => {
    await fetch(`/api/tours/${tour.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tour, isPublished: !tour.isPublished }),
    });
    setTours((prev) => prev.map((t) => t.id === tour.id ? { ...t, isPublished: !t.isPublished } : t));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>Туры</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            {tours.length} туров в базе
          </p>
        </div>
        <Link href="/admin/tours/new" style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ padding: "11px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
            + Добавить тур
          </button>
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>
          Загрузка...
        </div>
      ) : tours.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 80,
          background: "#111827", borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏔</div>
          <div style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Нет туров</div>
          <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Добавьте первый тур</div>
          <Link href="/admin/tours/new">
            <button className="btn-primary" style={{ padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
              + Добавить тур
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tours.map((tour) => (
            <div key={tour.id} style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(45,153,102,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              {/* Image */}
              <div style={{
                width: 64, height: 64, borderRadius: 10, overflow: "hidden",
                background: "rgba(255,255,255,0.05)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tour.images[0] ? (
                  <img src={tour.images[0].url} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 24 }}>🏔</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "white", fontSize: 15, marginBottom: 4 }}>
                  {tour.title}
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {CATEGORY_LABELS[tour.category] || tour.category}
                  </span>
                  <span style={{ fontSize: 12, color: "#2d9966", fontWeight: 600 }}>
                    {tour.price.toLocaleString()} ₸
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {tour.duration} дн.
                  </span>
                </div>
              </div>

              {/* Status toggle */}
              <button
                onClick={() => togglePublish(tour)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: tour.isPublished ? "rgba(45,153,102,0.15)" : "rgba(255,255,255,0.06)",
                  color: tour.isPublished ? "#2d9966" : "rgba(255,255,255,0.4)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {tour.isPublished ? "✓ Опубликован" : "○ Черновик"}
              </button>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/tours/${tour.id}/edit`}>
                  <button style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: "rgba(255,255,255,0.06)", border: "none",
                    color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                  }}>
                    ✏️ Редактировать
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(tour.id, tour.title)}
                  disabled={deleting === tour.id}
                  style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171", cursor: "pointer", fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {deleting === tour.id ? "..." : "🗑"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
