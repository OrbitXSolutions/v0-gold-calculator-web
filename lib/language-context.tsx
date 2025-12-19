"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguage(savedLang)
      document.documentElement.lang = savedLang
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr"

      // Add/remove RTL class from body
      if (savedLang === "ar") {
        document.body.classList.add("rtl")
        document.body.classList.remove("ltr")
      } else {
        document.body.classList.add("ltr")
        document.body.classList.remove("rtl")
      }
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"

    if (lang === "ar") {
      document.body.classList.add("rtl")
      document.body.classList.remove("ltr")
    } else {
      document.body.classList.add("ltr")
      document.body.classList.remove("rtl")
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
