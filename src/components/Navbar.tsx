"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled
          ? "rgba(10,14,20,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #2d9966, #1a6b4a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "white",
              boxShadow: "0 4px 15px rgba(45,153,102,0.4)",
            }}>
              🏔
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "white", lineHeight: 1 }}>
                Altosh
              </div>
              <div style={{ fontWeight: 400, fontSize: 11, color: "#2d9966", letterSpacing: 2 }}>
                TRAVEL
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {[
            { href: "/", label: t.nav.home },
            { href: "/#tours", label: t.nav.tours },
            { href: "/#about", label: t.nav.about },
            { href: "/#contact", label: t.nav.contact },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Language + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Lang Toggle */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}>
            {(["ru", "kz"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: lang === l ? "linear-gradient(135deg, #2d9966, #1a6b4a)" : "transparent",
                  color: lang === l ? "white" : "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Book CTA */}
          <a
            href="https://wa.me/77059652303"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 7,
              textDecoration: "none",
            }}
          >
            <span>💬</span>
            WhatsApp
          </a>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: 22,
              cursor: "pointer",
              display: "none",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(10,14,20,0.98)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          {[
            { href: "/", label: t.nav.home },
            { href: "/#tours", label: t.nav.tours },
            { href: "/#about", label: t.nav.about },
            { href: "/#contact", label: t.nav.contact },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 16, fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
