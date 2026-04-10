"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface BookingModalProps {
  tour: { id: string; title: string };
  onClose: () => void;
}

export default function BookingModal({ tour, onClose }: BookingModalProps) {
  const { t } = useLang();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [comment, setComment] = useState("");
  const [whatsappNum, setWhatsappNum] = useState("77059652303");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => d.whatsappNum && setWhatsappNum(d.whatsappNum))
      .catch(() => {});
  }, []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      alert("Пожалуйста, укажите даты");
      return;
    }
    const url = buildWhatsAppUrl({
      whatsappNum,
      tourTitle: tour.title,
      checkIn,
      checkOut,
      adults,
      children,
      comment,
    });
    window.open(url, "_blank");
    onClose();
  };

  const Counter = ({
    label, value, onChange, min = 0,
  }: { label: string; value: number; onChange: (v: number) => void; min?: number }) => (
    <div>
      <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)", color: "white", fontSize: 18,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          −
        </button>
        <span style={{ fontSize: 20, fontWeight: 700, color: "white", minWidth: 24, textAlign: "center" }}>
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)", color: "white", fontSize: 18,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          width: "100%",
          maxWidth: 480,
          padding: 32,
          animation: "fadeInUp 0.3s ease",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "2px", color: "#2d9966", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>
              🏔 {t.tours.bookingTitle}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1.3 }}>
              {tour.title}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "white",
            width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 16,
            flexShrink: 0,
          }}>
            ✕
          </button>
        </div>

        {/* Dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
              📅 {t.tours.checkIn}
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="input-dark"
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
              📅 {t.tours.checkOut}
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="input-dark"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        {/* Counters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <Counter label={`👨‍👩‍👧 ${t.tours.adults}`} value={adults} onChange={setAdults} min={1} />
          <Counter label={`👶 ${t.tours.children}`} value={children} onChange={setChildren} min={0} />
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
            💬 {t.tours.comment}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.tours.commentPlaceholder}
            rows={3}
            className="input-dark"
            style={{ resize: "none" }}
          />
        </div>

        {/* Summary preview */}
        <div style={{
          background: "rgba(45,153,102,0.08)",
          border: "1px solid rgba(45,153,102,0.2)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.8,
        }}>
          <div>📍 <b style={{ color: "white" }}>{tour.title}</b></div>
          {checkIn && <div>📅 {checkIn} — {checkOut || "..."}</div>}
          <div>👨‍👩‍👧 {adults} взр. · 👶 {children} дет.</div>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleBook}
          className="btn-whatsapp"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t.tours.goToWhatsapp}
        </button>
      </div>
    </div>
  );
}
