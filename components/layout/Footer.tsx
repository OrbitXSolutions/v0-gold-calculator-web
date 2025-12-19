"use client"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { getPrivacyTranslation, getTermsTranslation } from "@/lib/translations"

export default function Footer() {
  const { t, language } = useLanguage()
  const privacyT = getPrivacyTranslation(language)
  const termsT = getTermsTranslation(language)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-12 border-t border-amber-200 bg-gradient-to-b from-white to-amber-50/30 text-gray-800 mt-16">
      <div className="container-max">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="text-xl font-bold text-gray-900">GoldCheck</div>
            </div>
            <p className="text-gray-600 text-sm max-w-xs leading-relaxed">{t.poweredBy}</p>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/calculator"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {t.calculator}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/blog"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/about-us"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {t.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">{language === "ar" ? "قانوني" : "Legal"}</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/privacy-policy"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {privacyT.pageTitle}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/terms-and-conditions"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {termsT.pageTitle}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  href="/contact-us"
                  onClick={scrollToTop}
                >
                  <span className="text-amber-500">→</span>
                  {t.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">{language === "ar" ? "الحالة" : "Status"}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-amber-200 text-sm text-gray-500 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>
              © {new Date().getFullYear()} GoldCheck. {language === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
              .
            </p>
            <p className="sm:text-right">
              {language === "ar"
                ? "استخدم وفقًا لتقديرك؛ ليس نصيحة مالية"
                : "Use at your own discretion; not financial advice"}
              .
            </p>
          </div>
          <div className="text-center sm:text-left pt-2">
            <p>
              {language === "ar" ? "مدعوم من" : "Powered by"}{" "}
              <a
                href="https://orbitxsolutions.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
              >
                OrbitX Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
