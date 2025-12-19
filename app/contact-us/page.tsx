"use client"
import { Mail, MessageSquare, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { getContactTranslation } from "@/lib/translations"

const MotionDiv: any = motion.div
const MotionP: any = motion.p
const MotionH1: any = motion.h1

function ContactCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
        style={{ backgroundColor: "#f8a219" }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-gray-900 mt-1 font-semibold text-lg">{value}</p>
      </div>
    </div>
  )
}

export default function ContactUsPage() {
  const { language } = useLanguage()
  const t = getContactTranslation(language)

  const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="section-spacing">
      <div className="container-max">
        <MotionH1
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.4 }}
          className="text-gray-900 text-3xl font-bold text-balance mb-3"
        >
          {t.pageTitle}
        </MotionH1>
        <MotionP
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-gray-600 text-lg"
        >
          {t.pageDescription}
        </MotionP>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 space-y-4"
        >
          <ContactCard icon={Mail} label={t.emailLabel} value={t.emailValue} />
          <ContactCard icon={MessageSquare} label={t.whatsappLabel} value={t.whatsappValue} />
          <ContactCard icon={Clock} label={t.hoursLabel} value={t.hoursValue} />
        </MotionDiv>

        <MotionDiv
          initial={fade.initial}
          animate={fade.animate}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8"
        >
          <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-6 text-gray-700">
            <p className="font-medium">{t.responseTime}</p>
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}
