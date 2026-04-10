"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CATEGORIES = [
  { value: "mountains", label: "🏔 Горы" },
  { value: "lakes", label: "🏞 Озёра" },
  { value: "steppe", label: "🌾 Степи" },
  { value: "cities", label: "🏙 Города" },
  { value: "adventure", label: "🧗 Активный отдых" },
];

interface UploadedImage {
  id?: string;
  url: string;
  file?: File;
  order: number;
}

interface TourFormProps {
  initialData?: {
    id?: string;
    title: string;
    titleKz: string;
    description: string;
    descriptionKz: string;
    route: string;
    routeKz: string;
    price: string;
    childPrice: string;
    duration: string;
    category: string;
    isPublished: boolean;
    images: { id: string; url: string; order: number }[];
  };
}

const defaultData = {
  title: "", titleKz: "",
  description: "", descriptionKz: "",
  route: "", routeKz: "",
  price: "", childPrice: "",
  duration: "3",
  category: "mountains",
  isPublished: false,
  images: [] as { id: string; url: string; order: number }[],
};

export default function TourForm({ initialData }: TourFormProps) {
  const router = useRouter();
  const data = initialData || defaultData;

  const [form, setForm] = useState({
    title: data.title,
    titleKz: data.titleKz,
    description: data.description,
    descriptionKz: data.descriptionKz,
    route: data.route,
    routeKz: data.routeKz || "",
    price: data.price,
    childPrice: data.childPrice,
    duration: data.duration,
    category: data.category,
    isPublished: data.isPublished,
  });

  const [images, setImages] = useState<UploadedImage[]>(
    data.images.map((img) => ({ id: img.id, url: img.url, order: img.order }))
  );
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState<"ru" | "kz">("ru");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      newImages.push({ url: data.url, order: images.length + i });
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Save/update the tour
    const method = initialData?.id ? "PUT" : "POST";
    const url = initialData?.id ? `/api/tours/${initialData.id}` : "/api/tours";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const tour = await res.json();
    const tourId = initialData?.id || tour.id;

    // Upload images that don't have an ID yet
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.id) {
        const formData = new FormData();
        if (img.file) {
          formData.append("file", img.file);
        } else {
          // already uploaded, just link
          await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          continue;
        }
        formData.append("tourId", tourId);
        formData.append("order", String(i));
        await fetch("/api/upload", { method: "POST", body: formData });
      }
    }

    // Link existing uploaded images that have a URL but no ID yet
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.id && img.url && !img.file) {
        // link by creating image record
        await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: img.url, tourId, order: i }),
        });
      }
    }

    router.push("/admin/tours");
    router.refresh();
  };

  const InputField = ({
    label, value, onChange, placeholder, multiline = false, required = false,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; multiline?: boolean; required?: boolean;
  }) => (
    <div>
      <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
        {label} {required && <span style={{ color: "#f87171" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          required={required}
          className="input-dark"
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="input-dark"
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>
      {/* Language tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12, width: "fit-content" }}>
        {(["ru", "kz"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setActiveTab(l)} style={{
            padding: "8px 24px", borderRadius: 8, border: "none", cursor: "pointer",
            background: activeTab === l ? "linear-gradient(135deg, #2d9966, #1a6b4a)" : "transparent",
            color: activeTab === l ? "white" : "rgba(255,255,255,0.5)",
            fontWeight: 600, fontSize: 14, fontFamily: "Inter, sans-serif",
          }}>
            {l === "ru" ? "🇷🇺 Русский" : "🇰🇿 Қазақша"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {activeTab === "ru" ? (
          <>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Название тура" value={form.title} onChange={(v) => set("title", v)} placeholder="Тур по Алтаю" required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Описание" value={form.description} onChange={(v) => set("description", v)} placeholder="Описание тура..." multiline required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Маршрут" value={form.route} onChange={(v) => set("route", v)} placeholder="Алматы → Катон-Карагай → ..." multiline />
            </div>
          </>
        ) : (
          <>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Тур атауы (қазақша)" value={form.titleKz} onChange={(v) => set("titleKz", v)} placeholder="Алтай туры" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Сипаттама" value={form.descriptionKz} onChange={(v) => set("descriptionKz", v)} placeholder="Тур сипаттамасы..." multiline />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Бағыт" value={form.routeKz} onChange={(v) => set("routeKz", v)} placeholder="Алматы → ..." multiline />
            </div>
          </>
        )}
      </div>

      {/* Price, Duration, Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Цена (взрослый) ₸ *
          </label>
          <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="50000" required className="input-dark" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Цена (детский) ₸
          </label>
          <input type="number" value={form.childPrice} onChange={(e) => set("childPrice", e.target.value)} placeholder="30000" className="input-dark" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Длительность (дней) *
          </label>
          <input type="number" value={form.duration} onChange={(e) => set("duration", e.target.value)} min="1" required className="input-dark" />
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 10, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Категория</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => set("category", cat.value)}
              style={{
                padding: "8px 16px", borderRadius: 20, border: form.category === cat.value ? "1px solid #2d9966" : "1px solid rgba(255,255,255,0.1)",
                background: form.category === cat.value ? "rgba(45,153,102,0.15)" : "rgba(255,255,255,0.04)",
                color: form.category === cat.value ? "#2d9966" : "rgba(255,255,255,0.6)",
                cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 10, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Фотографии
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative", width: 100, height: 80, borderRadius: 10, overflow: "hidden" }}>
              <Image src={img.url} alt="" fill style={{ objectFit: "cover" }} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute", top: 4, right: 4,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "rgba(239,68,68,0.9)", border: "none",
                  color: "white", cursor: "pointer", fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 100, height: 80, borderRadius: 10,
              border: "2px dashed rgba(255,255,255,0.15)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 12, gap: 4,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d9966")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
          >
            {uploadingImages ? "⏳" : "➕"}
            <span>{uploadingImages ? "Загрузка..." : "Добавить"}</span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
        />
      </div>

      {/* Publish toggle */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)", marginBottom: 28,
      }}>
        <button
          type="button"
          onClick={() => set("isPublished", !form.isPublished)}
          style={{
            width: 48, height: 26, borderRadius: 13, border: "none",
            background: form.isPublished ? "#2d9966" : "rgba(255,255,255,0.15)",
            cursor: "pointer", position: "relative", transition: "background 0.3s",
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%", background: "white",
            position: "absolute", top: 3,
            left: form.isPublished ? 25 : 3,
            transition: "left 0.3s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }} />
        </button>
        <div>
          <div style={{ color: form.isPublished ? "#2d9966" : "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14 }}>
            {form.isPublished ? "✓ Опубликован" : "○ Черновик"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            {form.isPublished ? "Тур виден на сайте" : "Тур скрыт от посетителей"}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ padding: "13px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Сохраняем..." : (initialData?.id ? "Сохранить изменения" : "Создать тур")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tours")}
          style={{
            padding: "13px 24px", borderRadius: 12, fontSize: 15,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
