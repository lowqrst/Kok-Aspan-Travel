"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: "📊", label: "Дашборд", exact: true },
  { href: "/admin/tours", icon: "🏔", label: "Туры" },
  { href: "/admin/settings", icon: "⚙️", label: "Настройки" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <aside style={{
      width: 240,
      background: "#111827",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 36 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #2d9966, #1a6b4a)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🏔</div>
          <div>
            <div style={{ fontWeight: 800, color: "white", fontSize: 15 }}>Altosh</div>
            <div style={{ fontSize: 10, color: "#2d9966", letterSpacing: 2 }}>ADMIN</div>
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12,
                background: active ? "linear-gradient(135deg, rgba(45,153,102,0.2), rgba(26,107,74,0.1))" : "transparent",
                border: active ? "1px solid rgba(45,153,102,0.25)" : "1px solid transparent",
                color: active ? "#2d9966" : "rgba(255,255,255,0.5)",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = "rgba(255,255,255,0.04)"); }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 16 }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", borderRadius: 10,
          color: "rgba(255,255,255,0.4)", textDecoration: "none",
          fontSize: 13, marginBottom: 8,
        }}>
          🌐 Просмотр сайта
        </a>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10, width: "100%",
            background: "none", border: "none",
            color: "rgba(239,68,68,0.7)", fontSize: 13, cursor: "pointer",
            fontFamily: "Inter, sans-serif", textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(239,68,68,0.7)")}
        >
          🚪 Выйти
        </button>
      </div>
    </aside>
  );
}
