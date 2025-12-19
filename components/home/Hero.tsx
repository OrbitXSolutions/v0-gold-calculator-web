"use client"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { getHomeTranslation } from "@/lib/translations"

const MotionDiv: any = motion.div
const MotionH1: any = motion.h1
const MotionP: any = motion.p

export default function Hero() {
  const { language } = useLanguage()
  const t = getHomeTranslation(language)

  return (
    <section className="section-spacing">
      <div className="container-max">
        <MotionH1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-title"
        >
          {t.heroTitle}
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="hero-subtitle"
        >
          {t.heroSubtitle}
        </MotionP>

        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto"
        >
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-neutral">
              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{t.feature1}</span>
            </li>
            <li className="flex items-start gap-3 text-neutral">
              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{t.feature2}</span>
            </li>
          </ul>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-neutral">
              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{t.feature3}</span>
            </li>
            <li className="flex items-start gap-3 text-neutral">
              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{t.feature4}</span>
            </li>
          </ul>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/calculator" className="gold-btn">
            {t.goToCalculator}
          </Link>
        </MotionDiv>
      </div>
    </section>
  )
}
