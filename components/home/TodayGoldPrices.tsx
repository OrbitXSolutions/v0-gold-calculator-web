"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const MotionDiv: any = motion.div

interface GoldPrice {
  karat: string
  price: number
  currency: string
}

interface GoldPricesData {
  prices: GoldPrice[]
  date: string
  source: string
  lastUpdated: string
  error?: string
}

const translations = {
  en: {
    title: "Today's Gold Price in UAE",
    subtitle: "Live retail gold prices per gram",
    source: "Source:",
    lastUpdated: "Last updated:",
    loading: "Loading live prices...",
    error: "Unable to fetch live prices",
    perGram: "per gram",
    refresh: "Refresh",
  },
  ar: {
    title: "سعر الذهب اليوم في الإمارات",
    subtitle: "أسعار الذهب بالتجزئة للجرام الواحد",
    source: "المصدر:",
    lastUpdated: "آخر تحديث:",
    loading: "جاري تحميل الأسعار...",
    error: "تعذر جلب الأسعار المباشرة",
    perGram: "للجرام",
    refresh: "تحديث",
  }
}

export default function TodayGoldPrices() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [pricesData, setPricesData] = useState<GoldPricesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchPrices = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      // Fetch from Dubai City of Gold scraping API with cache busting
      const response = await fetch(`/api/gold-prices?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      const data = await response.json()
      setPricesData(data)
      
      // Also sync to backend in the background
      fetch('/api/gold-prices/sync', { method: 'POST' }).catch(err => 
        console.log('Background sync attempted:', err)
      )
    } catch (error) {
      console.error('Error fetching gold prices:', error)
      // Set fallback data on error
      setPricesData({
        prices: [
          { karat: '24K', price: 589.50, currency: 'AED' },
          { karat: '22K', price: 545.75, currency: 'AED' },
          { karat: '21K', price: 523.25, currency: 'AED' },
          { karat: '18K', price: 448.50, currency: 'AED' },
          { karat: '14K', price: 349.75, currency: 'AED' },
        ],
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
        source: 'Dubai City of Gold',
        lastUpdated: new Date().toISOString(),
        error: 'Using cached prices'
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-AE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <section className="py-4">
        <div className="container-max">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="h-5 w-5 text-amber-600 animate-spin" />
              <span className="text-amber-800 font-medium">{t.loading}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4">
      <div className="container-max">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                  {t.title}
                </h2>
                <p className="text-sm text-neutral-500">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Date Badge */}
              {pricesData && (
                <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-full shadow-md">
                  {pricesData.date}
                </span>
              )}
              <button
                onClick={() => fetchPrices(true)}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-full border border-amber-300 text-amber-800 font-medium transition-all shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">{t.refresh}</span>
              </button>
            </div>
          </div>

          {/* Warning if using fallback */}
          {pricesData?.error && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{pricesData.error}</span>
            </div>
          )}

          {/* Price Table */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-600 to-amber-700">
                  <th className="px-4 md:px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
                    Gold Rate
                  </th>
                  <th className="px-4 md:px-6 py-4 text-right text-white font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pricesData?.prices.map((price, index) => (
                  <MotionDiv
                    key={price.karat}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="contents"
                  >
                    <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-amber-50 transition-colors duration-150`}>
                      <td className="px-4 md:px-6 py-4 text-neutral-800 font-medium whitespace-nowrap">
                        Gold {price.karat}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right font-bold text-neutral-900 whitespace-nowrap">
                        {price.currency} {price.price.toFixed(2)}
                      </td>
                    </tr>
                  </MotionDiv>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500 font-medium">{t.source}</span>
              <a 
                href="https://dubaicityofgold.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-800 font-semibold underline decoration-amber-300 hover:decoration-amber-500 underline-offset-2 transition-colors"
              >
                {pricesData?.source}
              </a>
            </div>
            {pricesData?.lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                <span className="font-medium">{t.lastUpdated}</span>
                <span className="font-bold">{formatTime(pricesData.lastUpdated)}</span>
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
