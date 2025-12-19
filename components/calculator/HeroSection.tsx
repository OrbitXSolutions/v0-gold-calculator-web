"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"
import { figmaChartData } from "../../lib/figmaChartData"
import { goldKarats } from "../../lib/goldKarats"
import { getCalculatorTranslation } from "../../lib/translations"

type Language = "en" | "ar"

const mockData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  price: 282 + Math.sin(i / 2) * 6 + (i > 12 ? (i - 12) * 0.4 : 0),
}))

export function HeroSection({
  selectedKarat,
  onKaratChange,
  baseGoldPrice,
  language,
}: {
  selectedKarat: string
  onKaratChange: (v: string) => void
  baseGoldPrice: number
  language: Language
}) {
  const t = getCalculatorTranslation(language)

  const karats = goldKarats.map((k) => ({
    label: `${k.label} (${k.purity})`,
    value: k.value,
    multiplier: k.priceMultiplier,
  }))

  return (
    <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
      <div className="container mx-auto max-w-5xl px-5 md:px-6 py-10 md:py-12">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {language === "ar" ? "مخطط سعر الذهب اليوم" : "Today's Gold Price Chart"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {language === "ar"
              ? "متابعة السوق مباشرة لاتخاذ قرارات مدروسة"
              : "Real-time market tracking for informed decisions"}
          </p>
        </div>

        <div className="rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 md:px-7 py-5 md:py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm md:text-base opacity-90">
                  {language === "ar" ? "السعر الحالي" : "Current Rate"}
                </div>
                <div className="text-2xl md:text-3xl font-bold leading-tight">24K AED {baseGoldPrice.toFixed(2)}</div>
                <div className="text-xs md:text-sm opacity-95">
                  {language === "ar" ? "للغرام مقارنة بالأمس" : "per gram vs Yesterday"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
              <span>{language === "ar" ? "نوع العيار:" : "Karat Type:"}</span>
              <select
                value={selectedKarat}
                onChange={(e) => onKaratChange(e.target.value)}
                className="rounded-md bg-white/90 text-amber-900 px-2.5 py-1.5 text-xs md:text-sm"
              >
                {karats.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-card text-card-foreground p-5 md:p-6">
            <ChartContainer
              config={{
                price: { label: "Price", color: "#f59e0b" },
              }}
              className="aspect-[16/6]"
            >
              <AreaChart data={figmaChartData?.length ? figmaChartData : mockData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  ticks={["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  ticks={[282, 284, 286, 288, 290]}
                  domain={[282, 290]}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  isAnimationActive={true}
                />
                <ChartTooltip
                  cursor={{ stroke: "#f59e0b", strokeDasharray: "3 3", strokeOpacity: 0.6 }}
                  content={
                    <ChartTooltipContent
                      unit="AED"
                      hideLabel
                      labelFormatter={(label) => <span className="text-muted-foreground">{label}</span>}
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </div>
          {/* Karat prices table */}
          <div className="px-6 md:px-7 pb-6 md:pb-8">
            <div className="mt-4 md:mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-amber-50 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base font-medium text-amber-700 border-b border-gray-200">
                {language === "ar" ? "أسعار الذهب اليوم حسب العيار" : "Today's Gold Prices by Karat"}
              </div>
              <div className="flex items-center justify-between px-4 md:px-5 py-3 text-sm md:text-lg text-neutral-700 border-b border-gray-200">
                <span className="font-medium">{language === "ar" ? "العيار" : "Karat"}</span>
                <span className="font-medium">{language === "ar" ? "السعر للغرام" : "Price per Gram"}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {karats.map((k) => {
                  const pricePerGram = (baseGoldPrice * k.multiplier).toFixed(2)
                  return (
                    <div
                      key={k.value}
                      className={`flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-t border-gray-100 transition-colors hover:bg-gray-50 ${k.value === "24k" ? "bg-amber-50" : ""}`}
                    >
                      <span className="text-neutral-900 font-medium text-sm md:text-base">
                        {k.label.replace(/\s*$$.*$$/, "")}
                      </span>
                      <span className="text-amber-700 font-medium text-sm md:text-base">AED {pricePerGram}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
