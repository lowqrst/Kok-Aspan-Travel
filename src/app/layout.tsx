import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";

export const metadata: Metadata = {
  title: "Vostok Travel — Туры по Казахстану",
  description: "Откройте красоту Казахстана с Vostok Travel. Незабываемые туры по горам, озёрам и степям. Бронирование через WhatsApp.",
  keywords: "туры Казахстан, отдых Казахстан, горные туры, Алтай, Балхаш, Восток Тревел",
  openGraph: {
    title: "Vostok Travel — Туры по Казахстану",
    description: "Незабываемые туры по горам, озёрам и степям Казахстана",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
