"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Неверный логин или пароль");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: 48,
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #2d9966, #1a6b4a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, margin: "0 auto 16px",
            boxShadow: "0 8px 25px rgba(45,153,102,0.4)",
          }}>
            🏔
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6 }}>
            Vostok Travel
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Панель администратора
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="input-dark"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-dark"
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 14,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: "14px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
              marginTop: 8,
            }}
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
