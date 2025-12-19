"use client"
import { Shield, Cookie, User, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { getPrivacyTranslation } from "@/lib/translations"

const MotionDiv: any = motion.div

function Item({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
      <Icon className="h-5 w-5" style={{ color: "#f8a219" }} />
      <span className="text-gray-700">{text}</span>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()
  const t = getPrivacyTranslation(language)

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
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-gray-900 text-3xl font-bold text-balance">{t.pageTitle}</h1>
        </MotionDiv>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <p className="text-gray-700 text-lg font-medium">{t.intro}</p>
          <p className="text-gray-600 mt-3">{t.description}</p>

          <div className="mt-6 space-y-3">
            <Item icon={BarChart3} text={t.analytics} />
            <Item icon={User} text={t.forms} />
            <Item icon={Cookie} text={t.cookies} />
          </div>

          <ul className="mt-8 space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="text-amber-600 text-xl">•</span>
              <span>{t.point1}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 text-xl">•</span>
              <span>{t.point2}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 text-xl">•</span>
              <span>{t.point3}</span>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm">{t.lastUpdated}</div>
        </MotionDiv>
      </div>
    </div>
  )
}
