"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { getHomeTranslation } from "@/lib/translations"

const MotionDiv: any = motion.div

export default function CTA() {
  const { language } = useLanguage()
  const t = getHomeTranslation(language)

  return (
    <section className="footer-dark">
      <div className="container-max section-spacing">
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-base-100"
        >
          <h3 className="text-white text-xl font-semibold">{t.ctaTitle}</h3>
          <p className="mt-2 text-white/80">{t.ctaSubtitle}</p>
          <div className="mt-6">
            <Link href="/calculator" className="gold-btn">
              {t.goToCalculator}
            </Link>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
