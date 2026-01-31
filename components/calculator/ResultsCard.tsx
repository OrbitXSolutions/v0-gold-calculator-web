"use client"
import { useState, useEffect } from "react"
import { BadgeDollarSign, Coins, LineChart, RefreshCw, Star } from "lucide-react"
import { getCalculatorTranslation } from "../../lib/translations"

export type CalculationResult = {
  goldWeightValue: number
  shopProfitPerGram: number
  totalProfitAmount: number
  marginPercentage: number
  marginStatus: "good" | "medium" | "high"
  karatPricePerGram: number
  selectedKarat: string
  weight: number
}

export function ResultsCard({ result, language }: { result: CalculationResult; language: "en" | "ar" }) {
  const t = getCalculatorTranslation(language)

  const statusStyles = {
    good: {
      badge: "bg-green-100 text-green-700",
      ring: "ring-green-200",
      section: "border-green-200 bg-green-50",
      icon: "bg-white text-green-600 ring-green-200",
      iconSymbol: "✓",
      stars: 5,
    },
    medium: {
      badge: "bg-amber-100 text-amber-700",
      ring: "ring-amber-200",
      section: "border-amber-200 bg-amber-50",
      icon: "bg-white text-amber-600 ring-amber-200",
      iconSymbol: "!",
      stars: 3,
    },
    high: {
      badge: "bg-red-100 text-red-700",
      ring: "ring-red-200",
      section: "border-red-200 bg-red-50",
      icon: "bg-white text-red-600 ring-red-200",
      iconSymbol: "✕",
      stars: 1,
    },
  } as const

  const current = statusStyles[result.marginStatus]
  const marginText =
    result.marginStatus === "good" ? t.lowMargin : result.marginStatus === "medium" ? t.mediumMargin : t.highMargin

  const statusText =
    result.marginStatus === "good" ? t.goodDeal : result.marginStatus === "medium" ? t.fairDeal : t.highMarginAlert

  // Helper function to render stars
  const renderStars = (count: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i < count ? 'fill-amber-400 text-amber-400' : 'fill-slate-600 text-slate-600'}`}
        />
      )
    }
    return stars
  }

  return (
    <section
      className={`mt-8 rounded-2xl border p-6 shadow-sm text-center ${current.section} ${current.ring}`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ${current.icon}`}>
          {current.iconSymbol}
        </span>
        <span className="text-sm text-neutral">{t.calculationResults}</span>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span className={`rounded-md px-3 py-1 text-xs font-medium ${current.badge}`}>{marginText}</span>
      </div>

      {/* Profit margin headline */}
      <div className="mt-4 rounded-xl bg-white p-6 text-center shadow-sm">
        <div className="text-xs text-neutral/60">{t.profitMargin}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">{result.marginPercentage.toFixed(2)}%</div>
      </div>

      {/* Good deal explanation - moved here under profit margin */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-amber-200 text-center">
        <div className="font-semibold text-amber-700">{statusText}</div>
        <p className="mt-2 text-sm text-neutral/70">
          {t.explanationText(
            `AED ${result.goldWeightValue.toFixed(2)}`,
            `AED ${result.shopProfitPerGram.toFixed(2)}`,
            `AED ${result.totalProfitAmount.toFixed(2)}`,
            result.marginStatus === "good"
              ? language === "en"
                ? "low"
                : "منخفض"
              : result.marginStatus === "medium"
                ? language === "en"
                  ? "medium"
                  : "متوسط"
                : language === "en"
                  ? "high"
                  : "مرتفع",
          )}
        </p>
      </div>

      {/* Market rate amber card */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-center text-white shadow-sm">
        <div className="text-xs opacity-90">
          {t.marketRate} – {result.selectedKarat.toUpperCase()} {t.gold}
        </div>
        <div className="mt-1 text-2xl font-bold">AED {result.karatPricePerGram.toFixed(2)}</div>
        <div className="text-[11px] opacity-90">{t.perGram}</div>
      </div>

      {/* Metric tiles */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Flip Card 1 - Official Gold Value */}
        <FlipProfitCard 
          key={`gold-${result.goldWeightValue}-${Date.now()}`}
          frontValue={result.goldWeightValue}
          frontLabel={t.officialGoldValue}
          frontSubtext={`${result.karatPricePerGram.toFixed(2)} × ${result.weight}g`}
          frontIcon="gold"
          backValue={result.karatPricePerGram}
          backLabel={t.marketRate}
          backSubtext={`${result.selectedKarat.toUpperCase()} per gram`}
          backIcon="gold"
          autoFlipDelay={1000}
        />

        {/* Flip Card 2 - Total Shop Profit (front) / Profit Per Gram (back) */}
        <FlipProfitCard 
          key={`profit-${result.totalProfitAmount}-${Date.now()}`}
          frontValue={result.totalProfitAmount}
          frontLabel={t.totalShopProfit}
          frontSubtext="Shop − Official value"
          frontIcon="total"
          backValue={result.shopProfitPerGram}
          backLabel={t.shopProfitPerGram}
          backSubtext={`Total ÷ ${result.weight}g`}
          backIcon="perGram"
          autoFlipDelay={2000}
        />

        {/* Flip Card 3 - Profit Per Gram (front) / Total Shop Profit (back) */}
        <FlipProfitCard 
          key={`pergram-${result.shopProfitPerGram}-${Date.now()}`}
          frontValue={result.shopProfitPerGram}
          frontLabel={t.shopProfitPerGram}
          frontSubtext={`Total ÷ ${result.weight}g`}
          frontIcon="perGram"
          backValue={result.totalProfitAmount}
          backLabel={t.totalShopProfit}
          backSubtext="Shop − Official value"
          backIcon="total"
          autoFlipDelay={3000}
        />
      </div>

      {/* Bottom insights strip */}
      <div className="mt-6 rounded-xl bg-slate-900 px-4 py-5 text-slate-100 text-center">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-xs text-slate-300">{t.shopPriceIs}</div>
            <div className="mt-1 text-lg font-semibold">{result.marginPercentage.toFixed(1)}%</div>
            <div className="text-[11px] text-slate-400">{t.aboveTodayRate}</div>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-xs text-slate-300">{t.typicalUAECharges}</div>
            <div className="mt-1 text-lg font-semibold">30–60</div>
            <div className="text-[11px] text-slate-400">{language === "en" ? "AED per gram" : "درهم للغرام"}</div>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-xs text-slate-300">{t.recommendation}</div>
            <div className="mt-2 flex items-center justify-center gap-1">
              {renderStars(current.stars)}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">
              {current.stars === 5 ? (language === "en" ? "Excellent Deal" : "صفقة ممتازة") : 
               current.stars === 3 ? (language === "en" ? "Fair Deal" : "صفقة مقبولة") : 
               (language === "en" ? "Consider Negotiating" : "يُنصح بالتفاوض")}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Flip Card Component for profit display with auto-flip
function FlipProfitCard({
  frontValue,
  frontLabel,
  frontSubtext,
  frontIcon,
  backValue,
  backLabel,
  backSubtext,
  backIcon,
  autoFlipDelay,
}: {
  frontValue: number
  frontLabel: string
  frontSubtext: string
  frontIcon: "total" | "perGram" | "gold"
  backValue: number
  backLabel: string
  backSubtext: string
  backIcon: "total" | "perGram" | "gold"
  autoFlipDelay?: number
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Auto-flip with delay
  useEffect(() => {
    if (autoFlipDelay) {
      const timer = setTimeout(() => {
        setIsFlipped(true)
      }, autoFlipDelay)
      return () => clearTimeout(timer)
    }
  }, [autoFlipDelay])

  const getIconStyles = (type: "total" | "perGram" | "gold") => {
    if (type === "total") {
      return { bg: "bg-green-100", text: "text-green-700", valueColor: "text-green-700", ring: "ring-green-100" }
    }
    if (type === "gold") {
      return { bg: "bg-amber-100", text: "text-amber-700", valueColor: "text-amber-700", ring: "ring-amber-100" }
    }
    return { bg: "bg-blue-100", text: "text-blue-700", valueColor: "text-blue-700", ring: "ring-blue-100" }
  }

  const getIcon = (type: "total" | "perGram" | "gold") => {
    if (type === "total") return <LineChart className="h-5 w-5" />
    if (type === "gold") return <Coins className="h-5 w-5" />
    return <BadgeDollarSign className="h-5 w-5" />
  }

  const frontStyles = getIconStyles(frontIcon)
  const backStyles = getIconStyles(backIcon)

  return (
    <div 
      className="relative h-[120px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-white p-4 shadow-sm ring-1 ${frontStyles.ring} text-center`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-neutral/70">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${frontStyles.bg} ${frontStyles.text}`}>
              {getIcon(frontIcon)}
            </span>
            {frontLabel}
            <RefreshCw className="h-3 w-3 ml-1 text-neutral/40" />
          </div>
          <div className={`mt-2 text-xl font-semibold ${frontStyles.valueColor}`}>AED {frontValue.toFixed(2)}</div>
          <div className="text-xs text-neutral/60">{frontSubtext}</div>
        </div>

        {/* Back Side */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-white p-4 shadow-sm ring-1 ${backStyles.ring} text-center`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-neutral/70">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${backStyles.bg} ${backStyles.text}`}>
              {getIcon(backIcon)}
            </span>
            {backLabel}
            <RefreshCw className="h-3 w-3 ml-1 text-neutral/40" />
          </div>
          <div className={`mt-2 text-xl font-semibold ${backStyles.valueColor}`}>AED {backValue.toFixed(2)}</div>
          <div className="text-xs text-neutral/60">{backSubtext}</div>
        </div>
      </div>
    </div>
  )
}
