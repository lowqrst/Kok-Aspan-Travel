"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TourCard from "@/components/TourCard";
import { useLang } from "@/context/LangContext";

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
  isPublished: boolean;
  images: { id: string; url: string; order: number }[];
}

const CATEGORIES = ["all", "mountains", "lakes", "steppe", "cities", "adventure"] as const;

export default function HomePage() {
  const { t } = useLang();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filtered, setFiltered] = useState<Tour[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((data) => {
        setTours(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filterTours = useCallback(() => {
    let result = tours;
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [tours, activeCategory, search]);

  useEffect(() => {
    filterTours();
  }, [filterTours]);

  const stats = [
    { num: "200+", label: "Туров" },
    { num: "5000+", label: "Клиентов" },
    { num: "8", label: "Лет опыта" },
    { num: "4.9★", label: "Рейтинг" },
  ];

  const whyUs = [
    { icon: "🛡", title: t.whyUs.safe, desc: t.whyUs.safeDesc },
    { icon: "💰", title: t.whyUs.price, desc: t.whyUs.priceDesc },
    { icon: "📞", title: t.whyUs.support, desc: t.whyUs.supportDesc },
  ];

  return (
    <>
      <Navbar />

      {/* ─── Hero ─── */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0a0e14 0%, #0a1a12 50%, #0a0e14 100%)",
        }}
      >
        {/* Animated background blobs */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,153,102,0.12) 0%, transparent 70%)",
          top: "10%", left: "5%", animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)",
          bottom: "20%", right: "10%", animation: "float 6s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />

        {/* Mountain silhouette SVG */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.15, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: "100%", height: 320 }}>
            <path fill="#2d9966" d="M0,320 L0,200 L120,160 L240,200 L360,120 L480,180 L600,100 L720,160 L840,80 L960,140 L1080,60 L1200,130 L1320,90 L1440,150 L1440,320 Z"/>
            <path fill="#1a6b4a" opacity="0.6" d="M0,320 L0,240 L180,200 L360,250 L540,180 L720,220 L900,170 L1080,210 L1260,180 L1440,200 L1440,320 Z"/>
          </svg>
        </div>

        {/* Hero content */}
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 800, position: "relative", zIndex: 1 }}>
          <div className="animate-fadeInUp" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(45,153,102,0.12)",
            border: "1px solid rgba(45,153,102,0.25)",
            borderRadius: 40,
            padding: "8px 20px",
            marginBottom: 32,
            fontSize: 13,
            color: "#2d9966",
            fontWeight: 600,
          }}>
            <span style={{ animation: "float 2s ease-in-out infinite" }}>🏔</span>
            Казахстан · Туры и отели
          </div>

          <h1
            className="section-title animate-fadeInUp"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.1, marginBottom: 24 }}
          >
            {t.hero.title}
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.6)",
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}>
            {t.hero.subtitle}
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex", gap: 0, maxWidth: 560, margin: "0 auto 48px",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            <input
              type="text"
              placeholder={t.hero.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, padding: "16px 20px", background: "transparent",
                border: "none", outline: "none", color: "white",
                fontSize: 15, fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              className="btn-primary"
              style={{ padding: "16px 28px", borderRadius: 0, fontSize: 15, fontWeight: 600 }}
            >
              🔍 {t.hero.search}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 4vw, 48px)", flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.num} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#2d9966" }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,0.3)", fontSize: 12,
        }}>
          <div style={{ animation: "float 2s ease-in-out infinite" }}>↓</div>
        </div>
      </section>

      {/* ─── Tours ─── */}
      <section id="tours" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 48px)", marginBottom: 16 }}>
            {t.tours.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>{t.tours.subtitle}</p>
        </div>

        {/* Category filters */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10,
          justifyContent: "center", marginBottom: 48,
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "9px 22px",
                borderRadius: 40,
                border: activeCategory === cat
                  ? "1px solid #2d9966"
                  : "1px solid rgba(255,255,255,0.1)",
                background: activeCategory === cat
                  ? "linear-gradient(135deg, #2d9966, #1a6b4a)"
                  : "rgba(255,255,255,0.04)",
                color: activeCategory === cat ? "white" : "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {t.categories[cat as keyof typeof t.categories]}
            </button>
          ))}
        </div>

        {/* Tours grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 40, marginBottom: 16, animation: "float 1.5s ease-in-out infinite" }}>⏳</div>
            Загрузка туров...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>Туры не найдены</div>
            <div style={{ fontSize: 14 }}>Попробуйте изменить фильтры</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}>
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Why Us ─── */}
      <section id="about" style={{
        padding: "100px 24px",
        background: "linear-gradient(180deg, transparent 0%, rgba(45,153,102,0.04) 50%, transparent 100%)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
              {t.whyUs.title}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {whyUs.map((item) => (
              <div key={item.title} className="glass" style={{
                padding: 36, borderRadius: 20, textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.transform = "translateY(-6px)");
                  (e.currentTarget.style.boxShadow = "0 20px 50px rgba(45,153,102,0.15)");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.transform = "");
                  (e.currentTarget.style.boxShadow = "");
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto 60px" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a6b4a 0%, #0f4a32 100%)",
          borderRadius: 28,
          padding: "clamp(32px, 6vw, 60px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", top: -80, right: -80,
          }} />
          <div style={{
            position: "absolute", width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", bottom: -50, left: -50,
          }} />

          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 16, position: "relative" }}>
            Готовы к путешествию? 🌄
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32, position: "relative" }}>
            Напишите нам в WhatsApp — ответим быстро и поможем выбрать тур мечты
          </p>
          <a
            href="https://wa.me/77059652303"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "white",
              color: "#1a6b4a",
              padding: "14px 32px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.transform = "translateY(-2px)");
              (e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.transform = "");
              (e.currentTarget.style.boxShadow = "");
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a6b4a">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Написать в WhatsApp
          </a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer id="contact" style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "60px 24px 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #2d9966, #1a6b4a)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>🏔</div>
                <div>
                  <div style={{ fontWeight: 800, color: "white" }}>Altosh Travel</div>
                  <div style={{ fontSize: 11, color: "#2d9966", letterSpacing: 2 }}>КАЗАХСТАН</div>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7 }}>
                Незабываемые туры по красивейшим местам Казахстана
              </p>
            </div>

            <div>
              <h4 style={{ color: "white", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Навигация</h4>
              {["Главная", "Туры", "О нас", "Контакты"].map((link) => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2d9966")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ color: "white", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Контакты</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a
                  href="https://wa.me/77059652303"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    color: "#25d366", textDecoration: "none", fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 18 }}>💬</span>
                  +7 705 965-23-03
                </a>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                  📍 Казахстан
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
              © 2024 Altosh Travel. {t.footer.rights}.
            </p>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
              Сделано с ❤️ в Казахстане
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
