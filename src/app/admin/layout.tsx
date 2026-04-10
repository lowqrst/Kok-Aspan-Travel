import type { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — Altosh Travel",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
        <AdminSidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
