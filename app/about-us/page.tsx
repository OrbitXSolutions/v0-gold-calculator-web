"use client"
import { Target, TrendingUp, GraduationCap, Users, Info } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { getAboutTranslation } from "@/lib/translations"
const MotionDiv: any = motion.div

export default function AboutUsPage() {
  const { language } = useLanguage()
  const t = getAboutTranslation(language)
  const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="section-spacing">
      <div className="container-max">
        <MotionDiv initial={fade.initial} animate={fade.animate} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#f8a219" }}
            >
              <Info className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{t.pageTitle}</h1>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4"
        >
          <p className="text-gray-700 leading-relaxed">{t.intro}</p>

          <div className="mt-6">
            <h3 className="text-gray-900 font-semibold text-lg">{t.missionTitle}</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span className="text-gray-700">{t.mission1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span className="text-gray-700">{t.mission2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span className="text-gray-700">{t.mission3}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span className="text-gray-700">{t.mission4}</span>
              </li>
            </ul>
            <p className="text-gray-500 italic mt-4 text-sm">{t.disclaimer}</p>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">{t.accuracyTitle}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.accuracyDesc}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">{t.transparencyTitle}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.transparencyDesc}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">{t.educationTitle}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.educationDesc}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">{t.communityTitle}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.communityDesc}</p>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}
