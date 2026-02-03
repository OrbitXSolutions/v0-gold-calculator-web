"use client"
import { useState, useEffect } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Calendar, RefreshCw } from "lucide-react"
import { goldKarats } from "../../lib/goldKarats"

type Language = "en" | "ar"

interface TodayVsYesterdayData {
  today: {
    date: string
    rates: { k24: number; k22: number; k21: number; k18: number }
    source: string
    capturedAt: string
  }
  yesterday: {
    date: string
    rates: { k24: number; k22: number; k21: number; k18: number }
    source: string
    capturedAt: string
  }
  changes: {
    k24: { absolute: number; percentage: number }
    k22: { absolute: number; percentage: number }
    k21: { absolute: number; percentage: number }
    k18: { absolute: number; percentage: number }
  }
}

interface ChartDataPoint {
  date: string
  capturedAt: string
  source: string
  rates: { k24: number; k22: number; k21: number; k18: number }
}

interface ChartDataResponse {
  period: string
  from: string
  to: string
  karat: string
  totalDays: number
  data: ChartDataPoint[]
}

interface HistoryRecord {
  date: string
  k24: number
  k22: number
  k21: number
  k18: number
}

export function HeroSection({
  selectedKarat,
  onKaratChange,
  language,
  onPricesLoaded,
}: {
  selectedKarat: string
  onKaratChange: (v: string) => void
  language: Language
  onPricesLoaded?: (prices: { k24: number; k22: number; k21: number; k18: number }) => void
}) {
  const [todayData, setTodayData] = useState<TodayVsYesterdayData | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [historyLimit, setHistoryLimit] = useState(5)
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('month')

  const karats = goldKarats.map((k) => ({
    label: `${k.label} (${k.purity})`,
    value: k.value,
    multiplier: k.priceMultiplier,
  }))

  // Fetch today vs yesterday data and check if sync is needed
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        // First, fetch database prices
        const response = await fetch('/api/gold/today-vs-yesterday')
        const data: TodayVsYesterdayData = await response.json()
        setTodayData(data)
        
        // Notify parent component of the loaded prices
        if (onPricesLoaded && data.today?.rates) {
          onPricesLoaded(data.today.rates)
        }

        // Then, fetch live prices and compare
        const liveResponse = await fetch(`/api/gold-prices?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const liveData = await liveResponse.json()
        
        if (liveData.prices && liveData.prices.length > 0) {
          const liveK24 = liveData.prices.find((p: { karat: string }) => p.karat === '24K')?.price
          const dbK24 = data.today?.rates?.k24
          
          // If live price differs from database by more than 0.01, trigger sync
          if (liveK24 && dbK24 && Math.abs(liveK24 - dbK24) > 0.01) {
            console.log(`[Price Sync] Mismatch detected - Live: ${liveK24}, DB: ${dbK24}. Triggering sync...`)
            fetch('/api/gold-prices/sync', { method: 'POST' }).catch(err => 
              console.log('Background sync attempted:', err)
            )
            
            // Update local state with live prices
            const updatedData = {
              ...data,
              today: {
                ...data.today,
                rates: {
                  k24: liveData.prices.find((p: { karat: string }) => p.karat === '24K')?.price || data.today.rates.k24,
                  k22: liveData.prices.find((p: { karat: string }) => p.karat === '22K')?.price || data.today.rates.k22,
                  k21: liveData.prices.find((p: { karat: string }) => p.karat === '21K')?.price || data.today.rates.k21,
                  k18: liveData.prices.find((p: { karat: string }) => p.karat === '18K')?.price || data.today.rates.k18,
                }
              }
            }
            setTodayData(updatedData)
            
            // Notify parent with updated prices
            if (onPricesLoaded) {
              onPricesLoaded(updatedData.today.rates)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching today vs yesterday data:', error)
      }
    }

    fetchTodayData()
  }, [onPricesLoaded])

  // Fetch chart data - reload when period or karat changes
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true)
      setHistoryLimit(5) // Reset limit when period changes
      try {
        const response = await fetch(`/api/gold/chart-data?karat=all&period=${chartPeriod}`)
        const data: ChartDataResponse = await response.json()
        setChartData(data.data || [])
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [chartPeriod, selectedKarat])

  // Get current price based on selected karat
  const getCurrentPrice = (): number => {
    if (!todayData) return 0
    const karatKey = `k${selectedKarat.replace('k', '')}` as keyof typeof todayData.today.rates
    return todayData.today.rates[karatKey] || todayData.today.rates.k24
  }

  // Get price change for selected karat
  const getPriceChange = () => {
    if (!todayData) return { absolute: 0, percentage: 0 }
    const karatKey = `k${selectedKarat.replace('k', '')}` as keyof typeof todayData.changes
    return todayData.changes[karatKey] || { absolute: 0, percentage: 0 }
  }

  // Transform chart data for the selected karat
  const getChartDataForKarat = () => {
    const karatKey = `k${selectedKarat.replace('k', '')}` as keyof ChartDataPoint['rates']
    return chartData.map(point => ({
      date: formatDate(point.date),
      fullDate: point.date,
      price: point.rates[karatKey] || point.rates.k24,
    }))
  }

  // Calculate Y-axis domain based on karat type
  const getYAxisDomain = (): [number, number] => {
    const data = getChartDataForKarat()
    if (data.length === 0) {
      // Default ranges based on karat type
      const karatNum = parseInt(selectedKarat.replace('k', ''))
      if (karatNum === 24) return [500, 650]
      if (karatNum === 22) return [450, 600]
      if (karatNum === 21) return [430, 580]
      if (karatNum === 18) return [370, 500]
      if (karatNum === 14) return [290, 400]
      return [300, 600]
    }
    
    const prices = data.map(d => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    
    // Round to nice values based on karat price range
    const karatNum = parseInt(selectedKarat.replace('k', ''))
    let baseMin: number
    
    // Set base starting points based on karat type
    if (karatNum === 24) {
      baseMin = Math.floor(min / 50) * 50 // Round down to nearest 50 (e.g., 500, 550)
    } else if (karatNum === 22) {
      baseMin = Math.floor(min / 50) * 50 // Round down to nearest 50 (e.g., 450, 500)
    } else if (karatNum === 21) {
      baseMin = Math.floor(min / 50) * 50 // Round down to nearest 50 (e.g., 400, 450)
    } else if (karatNum === 18) {
      baseMin = Math.floor(min / 50) * 50 // Round down to nearest 50 (e.g., 350, 400)
    } else {
      baseMin = Math.floor(min / 50) * 50 // Round down to nearest 50 (e.g., 300, 350)
    }
    
    const baseMax = Math.ceil(max / 50) * 50 + 50 // Round up to nearest 50 + padding
    
    return [Math.max(baseMin - 20, 0), baseMax]
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }

  // Format full date for table
  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const suffix = getDaySuffix(day)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/^\d+/, `${day}${suffix}`)
  }

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  // Get history records for table (reversed so newest first)
  const getHistoryRecords = (): HistoryRecord[] => {
    return [...chartData]
      .reverse()
      .slice(0, historyLimit)
      .map(point => ({
        date: point.date,
        k24: point.rates.k24,
        k22: point.rates.k22,
        k21: point.rates.k21,
        k18: point.rates.k18,
      }))
  }

  const currentPrice = getCurrentPrice()
  const priceChange = getPriceChange()
  const isPositive = priceChange.absolute >= 0
  const chartDataForKarat = getChartDataForKarat()
  const [yMin, yMax] = getYAxisDomain()
  const historyRecords = getHistoryRecords()

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
          {/* Header with price and karat selector */}
          <div className="flex items-center justify-between px-6 md:px-7 py-5 md:py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </span>
              <div>
                <div className="text-sm md:text-base opacity-90">
                  {language === "ar" ? "السعر الحالي" : "Current Rate"}
                </div>
                <div className="text-2xl md:text-3xl font-bold leading-tight">
                  {selectedKarat.toUpperCase()} AED {currentPrice.toFixed(2)}
                </div>
                <div className="text-xs md:text-sm opacity-95 flex items-center gap-2">
                  <span>{language === "ar" ? "للغرام مقارنة بالأمس" : "per gram vs Yesterday"}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{priceChange.absolute.toFixed(2)} ({priceChange.percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
              <span>{language === "ar" ? "نوع العيار:" : "Karat Type:"}</span>
              <select
                value={selectedKarat}
                onChange={(e) => onKaratChange(e.target.value)}
                className="rounded-md bg-white/90 text-amber-900 px-2.5 py-1.5 text-xs md:text-sm font-medium"
              >
                {karats.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-card text-card-foreground p-5 md:p-6">
            {/* Period selector */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "الفترة الزمنية" : "Time Period"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartPeriod('week')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    chartPeriod === 'week'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {language === "ar" ? "أسبوع" : "Week"}
                </button>
                <button
                  onClick={() => setChartPeriod('month')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    chartPeriod === 'month'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {language === "ar" ? "شهر" : "Month"}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  price: { label: "Price", color: "#f59e0b" },
                }}
                className="aspect-[16/6]"
              >
                <AreaChart data={chartDataForKarat}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    interval={chartPeriod === 'week' ? 0 : 4}
                  />
                  <YAxis
                    domain={[yMin, yMax]}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickFormatter={(value) => value.toFixed(0)}
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
                        unit=" AED"
                        hideLabel
                        labelFormatter={(label) => <span className="text-muted-foreground">{label}</span>}
                      />
                    }
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </div>

          {/* Price History Table */}
          <div className="px-6 md:px-7 pb-6 md:pb-8">
            <div className="mt-4 md:mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-amber-50 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base font-medium text-amber-700 border-b border-gray-200">
                {language === "ar" ? "سجل أسعار الذهب" : "Gold Price History"}
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-2 px-4 md:px-5 py-3 text-sm font-medium text-neutral-700 border-b border-gray-200 bg-gray-50">
                <span>{language === "ar" ? "التاريخ" : "Date"}</span>
                <span className="text-center text-amber-600">24 Carat</span>
                <span className="text-center text-blue-600">22 Carat</span>
                <span className="text-center text-green-600">21 Carat</span>
                <span className="text-center text-purple-600">18 Carat</span>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 max-h-80 overflow-auto">
                {historyRecords.map((record, idx) => (
                  <div
                    key={record.date}
                    className={`grid grid-cols-5 gap-2 px-4 md:px-5 py-3 text-sm transition-colors hover:bg-gray-50 ${idx === 0 ? 'bg-amber-50/50' : ''}`}
                  >
                    <span className="text-neutral-700 font-medium">{formatFullDate(record.date)}</span>
                    <span className="text-center text-amber-600 font-semibold">{record.k24.toFixed(2)}</span>
                    <span className="text-center text-blue-600">{record.k22.toFixed(2)}</span>
                    <span className="text-center text-green-600">{record.k21.toFixed(2)}</span>
                    <span className="text-center text-purple-600">{record.k18.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {chartData.length > 5 && historyLimit < chartData.length && (
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => setHistoryLimit(prev => Math.min(prev + 10, chartData.length))}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <ChevronDown className="h-4 w-4" />
                    {language === "ar" ? "تحميل المزيد" : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
