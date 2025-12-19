"use client"
import { useState } from "react"
import { Menu, Globe, X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GoldCheck</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                {t.home}
              </Link>
              <Link href="/calculator" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                {t.calculator}
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                {t.blog}
              </Link>
              <Link href="/about-us" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                {t.aboutUs}
              </Link>
              <Link href="/contact-us" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                {t.contactUs}
              </Link>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language === "en" ? "العربية" : "English"}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 ${language === "ar" ? "left-0" : "right-0"} h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : language === "ar" ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <span className="font-bold text-gray-900">GoldCheck</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
            >
              {t.home}
            </Link>
            <Link
              href="/calculator"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
            >
              {t.calculator}
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
            >
              {t.blog}
            </Link>
            <Link
              href="/about-us"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
            >
              {t.aboutUs}
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
            >
              {t.contactUs}
            </Link>
          </nav>

          {/* Language Switcher in Mobile Menu */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                toggleLanguage()
                setOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
