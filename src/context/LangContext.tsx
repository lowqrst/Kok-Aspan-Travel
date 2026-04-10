"use client";

import React, { createContext, useContext, useState } from "react";
import { translations, Language } from "@/lib/translations";

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ru;
}

const LangContext = createContext<LangContextType>({
  lang: "ru",
  setLang: () => {},
  t: translations.ru,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("ru");
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
