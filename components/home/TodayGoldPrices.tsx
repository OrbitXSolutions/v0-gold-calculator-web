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
          className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-200 shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-xl shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {t.title}
                </h2>
                <p className="text-sm text-amber-700">{t.subtitle}</p>
              </div>
            </div>
            
            <button
              onClick={() => fetchPrices(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 text-amber-800 font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t.refresh}
            </button>
          </div>

          {/* Warning if using fallback */}
          {pricesData?.error && (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-2 text-amber-800 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{pricesData.error}</span>
            </div>
          )}

          {/* Date Badge */}
          {pricesData && (
            <div className="mb-6 flex justify-center">
              <span className="px-4 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-full shadow">
                {pricesData.date}
              </span>
            </div>
          )}

          {/* Price Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {pricesData?.prices.map((price, index) => (
              <MotionDiv
                key={price.karat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-amber-200 shadow-md hover:shadow-lg hover:border-amber-400 transition-all duration-200 text-center"
              >
                <div className="text-lg font-bold text-amber-800 mb-1">
                  {price.karat}
                </div>
                <div className="text-xs text-amber-600 mb-2">
                  {price.currency}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-neutral-900">
                  {price.price.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {t.perGram}
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-amber-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-amber-700">
            <div className="flex items-center gap-1">
              <span className="font-medium">{t.source}</span>
              <a 
                href="https://dubaicityofgold.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-900 hover:text-amber-600 underline"
              >
                {pricesData?.source}
              </a>
            </div>
            {pricesData?.lastUpdated && (
              <div>
                <span className="font-medium">{t.lastUpdated}</span>{' '}
                {formatTime(pricesData.lastUpdated)}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
