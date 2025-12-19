"use client"
import { FileText, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { getTermsTranslation } from "@/lib/translations"

const MotionDiv: any = motion.div

function Rule({ index, text }: { index: number; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold shadow"
        style={{ backgroundColor: "#f8a219" }}
      >
        {index}
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  )
}

export default function TermsConditionsPage() {
  const { language } = useLanguage()
  const t = getTermsTranslation(language)

  const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="section-spacing">
      <div className="container-max">
        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          <div
            className="inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg"
            style={{ backgroundColor: "#f8a219" }}
          >
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-gray-900 text-3xl font-bold text-balance">{t.pageTitle}</h1>
        </MotionDiv>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <p className="text-gray-700 text-lg">{t.intro}</p>

          <div className="mt-6 space-y-3">
            <Rule index={1} text={t.rule1} />
            <Rule index={2} text={t.rule2} />
            <Rule index={3} text={t.rule3} />
            <Rule index={4} text={t.rule4} />
            <Rule index={5} text={t.rule5} />
          </div>

          <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-xl p-5 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: "#f8a219" }} />
            <p className="text-gray-700 font-medium">{t.important}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm">{t.lastUpdated}</div>
        </MotionDiv>
      </div>
    </div>
  )
}
