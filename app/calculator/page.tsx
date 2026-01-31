"use client"
import { useState, useCallback } from "react"
import { HeroSection } from "../../components/calculator/HeroSection"
import { CalculatorCard } from "../../components/calculator/CalculatorCard"
import { ResultsCard, type CalculationResult } from "../../components/calculator/ResultsCard"
import { useLanguage } from "../../lib/language-context"

interface BackendPrices {
  k24: number
  k22: number
  k21: number
  k18: number
}

export default function CalculatorPage() {
  const { language } = useLanguage()

  const [selectedKarat, setSelectedKarat] = useState<string>("24k")
  const [weight, setWeight] = useState<string>("")
  const [shopPrice, setShopPrice] = useState<string>("")
  const [result, setResult] = useState<CalculationResult | null>(null)

  // Gold prices from backend
  const [backendPrices, setBackendPrices] = useState<BackendPrices | null>(null)

  // Callback when HeroSection loads prices from backend
  const handlePricesLoaded = useCallback((prices: BackendPrices) => {
    setBackendPrices(prices)
    console.log("Backend prices loaded:", prices)
  }, [])

  const goldKarats = [
    { value: "24k", priceMultiplier: 1 },
    { value: "22k", priceMultiplier: 22 / 24 },
    { value: "21k", priceMultiplier: 21 / 24 },
    { value: "18k", priceMultiplier: 18 / 24 },
    { value: "14k", priceMultiplier: 14 / 24 },
  ]

  // Get actual price from backend data or calculate from 24K base
  const getKaratPrice = (karatValue: string): number => {
    if (backendPrices) {
      const karatKey = `k${karatValue.replace('k', '')}` as keyof BackendPrices
      if (backendPrices[karatKey]) {
        return backendPrices[karatKey]
      }
      // For karats not in backend (14k), calculate from 24k
      const karat = goldKarats.find(k => k.value === karatValue)
      return backendPrices.k24 * (karat?.priceMultiplier || 1)
    }
    
    // Fallback price if backend not loaded yet
    const fallbackBasePrice = 589.50
    const karat = goldKarats.find(k => k.value === karatValue)
    return fallbackBasePrice * (karat?.priceMultiplier || 1)
  }

  const handleCalculate = () => {
    const weightNum = Number.parseFloat(weight)
    const shopPriceNum = Number.parseFloat(shopPrice)

    if (isNaN(weightNum) || isNaN(shopPriceNum) || weightNum <= 0 || shopPriceNum <= 0) {
      return
    }

    const pricePerGram = getKaratPrice(selectedKarat)
    const goldWeightValue = pricePerGram * weightNum

    const totalProfitAmount = shopPriceNum - goldWeightValue
    const shopProfitPerGram = totalProfitAmount / weightNum
    const marginPercentage = (totalProfitAmount / goldWeightValue) * 100

    let marginStatus: "good" | "medium" | "high"
    if (marginPercentage <= 10) {
      marginStatus = "good"
    } else if (marginPercentage <= 25) {
      marginStatus = "medium"
    } else {
      marginStatus = "high"
    }

    setResult({
      goldWeightValue,
      shopProfitPerGram,
      totalProfitAmount,
      marginPercentage,
      marginStatus,
      karatPricePerGram: pricePerGram,
      selectedKarat,
      weight: weightNum,
    })
  }

  const currentKaratPrice = getKaratPrice(selectedKarat)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <HeroSection
        selectedKarat={selectedKarat}
        onKaratChange={setSelectedKarat}
        language={language}
        onPricesLoaded={handlePricesLoaded}
      />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {backendPrices && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <div className="flex flex-col gap-1">
              <span>Current gold price ({selectedKarat.toUpperCase()}): <strong>{currentKaratPrice.toFixed(2)} AED</strong> per gram</span>
              <span className="text-sm text-green-600">Source: Backend Database (Live)</span>
            </div>
          </div>
        )}
        
        <CalculatorCard
          selectedKarat={selectedKarat}
          weight={weight}
          shopPrice={shopPrice}
          onKaratChange={setSelectedKarat}
          onWeightChange={setWeight}
          onShopPriceChange={setShopPrice}
          onCalculate={handleCalculate}
          language={language}
        />

        {result && <ResultsCard result={result} language={language} />}
      </main>
    </div>
  )
}
