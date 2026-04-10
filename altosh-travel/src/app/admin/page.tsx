import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [total, published, settings] = await Promise.all([
    prisma.tour.count(),
    prisma.tour.count({ where: { isPublished: true } }),
    prisma.settings.findUnique({ where: { id: "main" } }),
  ]);
  return { total, published, settings };
}

export default async function AdminDashboardPage() {
  const { total, published, settings } = await getStats();
  const drafts = total - published;

  const stats = [
    { label: "Всего туров", value: total, icon: "🏔", color: "#2d9966" },
    { label: "Опубликовано", value: published, icon: "✅", color: "#2d9966" },
    { label: "Черновиков", value: drafts, icon: "📝", color: "#f59e0b" },
    { label: "WhatsApp", value: settings?.whatsappNum || "—", icon: "💬", color: "#25d366", small: true },
  ];

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>
          Добро пожаловать 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Панель управления Altosh Travel
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 24,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(45,153,102,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{
              fontSize: stat.small ? 16 : 32,
              fontWeight: 800,
              color: stat.color,
              marginBottom: 4,
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "white", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
          Быстрые действия
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <Link href="/admin/tours/new" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(45,153,102,0.15), rgba(26,107,74,0.08))",
              border: "1px solid rgba(45,153,102,0.2)",
              borderRadius: 14, padding: 20, cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              display: "flex", flexDirection: "column", gap: 8,
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.transform = "translateY(-2px)"); (e.currentTarget.style.borderColor = "rgba(45,153,102,0.4)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.transform = ""); (e.currentTarget.style.borderColor = "rgba(45,153,102,0.2)"); }}
            >
              <span style={{ fontSize: 24 }}>➕</span>
              <div style={{ color: "#2d9966", fontWeight: 700, fontSize: 15 }}>Добавить тур</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Создать новый тур</div>
            </div>
          </Link>

          <Link href="/admin/tours" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 20, cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              display: "flex", flexDirection: "column", gap: 8,
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.transform = "translateY(-2px)"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.transform = ""); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"); }}
            >
              <span style={{ fontSize: 24 }}>📋</span>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Все туры</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Управление турами</div>
            </div>
          </Link>

          <Link href="/admin/settings" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 20, cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              display: "flex", flexDirection: "column", gap: 8,
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.transform = "translateY(-2px)"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.transform = ""); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"); }}
            >
              <span style={{ fontSize: 24 }}>⚙️</span>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Настройки</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>WhatsApp, контакты</div>
            </div>
          </Link>

          <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 20, cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              display: "flex", flexDirection: "column", gap: 8,
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.transform = "translateY(-2px)"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.transform = ""); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"); }}
            >
              <span style={{ fontSize: 24 }}>🌐</span>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Сайт</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Открыть в новой вкладке</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
