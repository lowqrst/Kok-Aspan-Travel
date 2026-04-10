"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ whatsappNum: "", companyName: "", contactInfo: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          whatsappNum: data.whatsappNum || "",
          companyName: data.companyName || "",
          contactInfo: data.contactInfo || "",
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div style={{ color: "rgba(255,255,255,0.4)" }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>Настройки</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Управление контактными данными сайта</p>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          background: "#111827", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 28,
        }}>
          <h3 style={{ color: "white", fontWeight: 700, marginBottom: 20, fontSize: 16 }}>
            📱 WhatsApp
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Номер WhatsApp *
            </label>
            <input
              type="text"
              value={form.whatsappNum}
              onChange={(e) => setForm((p) => ({ ...p, whatsappNum: e.target.value }))}
              placeholder="77059652303"
              required
              className="input-dark"
            />
            <p style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Формат: 77XXXXXXXXX (без + и пробелов)
            </p>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Тест перехода
            </label>
            <a
              href={`https://wa.me/${form.whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 10,
                background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                color: "#25d366", textDecoration: "none", fontSize: 13, fontWeight: 600,
              }}
            >
              💬 Открыть WhatsApp +{form.whatsappNum}
            </a>
          </div>
        </div>

        <div style={{
          background: "#111827", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 28,
        }}>
          <h3 style={{ color: "white", fontWeight: 700, marginBottom: 20, fontSize: 16 }}>
            🏢 Информация о компании
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Название компании *
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="Altosh Travel"
              required
              className="input-dark"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Дополнительные контакты
            </label>
            <textarea
              value={form.contactInfo}
              onChange={(e) => setForm((p) => ({ ...p, contactInfo: e.target.value }))}
              placeholder="Адрес, email, Instagram..."
              rows={3}
              className="input-dark"
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ padding: "13px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>

          {saved && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              color: "#2d9966", fontSize: 14, fontWeight: 600,
            }}>
              ✓ Сохранено!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
