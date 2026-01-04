"use client"
import { useState, useEffect } from "react"
import { HeroSection } from "../../components/calculator/HeroSection"
import { CalculatorCard } from "../../components/calculator/CalculatorCard"
import { ResultsCard, type CalculationResult } from "../../components/calculator/ResultsCard"
import { useLanguage } from "../../lib/language-context"

export default function CalculatorPage() {
  const { language } = useLanguage()

  const [selectedKarat, setSelectedKarat] = useState<string>("24k")
  const [weight, setWeight] = useState<string>("")
  const [shopPrice, setShopPrice] = useState<string>("")
  const [result, setResult] = useState<CalculationResult | null>(null)

  // Base gold price (24K) in AED per gram - fetched from API
  const [baseGoldPrice, setBaseGoldPrice] = useState<number>(285.5)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [priceSuccess, setPriceSuccess] = useState<boolean>(false)

  // Fetch gold price from GoldAPI
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const myHeaders = new Headers()
        myHeaders.append("x-access-token", "goldapi-f2bsmjzwbxie-io")
        myHeaders.append("Content-Type", "application/json")

        const requestOptions: RequestInit = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        }

        const response = await fetch("https://www.goldapi.io/api/XAU/AED", requestOptions)
        const data = await response.json()

        if (data.price_gram_24k) {
          const price24k = data.price_gram_24k
          setBaseGoldPrice(price24k)
          setPriceError(null)
          setPriceSuccess(true)
          console.log("Gold price fetched successfully:", price24k, "AED per gram")
        } else {
          throw new Error("Invalid API response")
        }
      } catch (error) {
        console.error("Error fetching gold price:", error)
        setPriceError("Can not read current gold price")
        // Keep using fallback price
      }
    }

    fetchGoldPrice()
  }, [])

  const goldKarats = [
    { value: "24k", priceMultiplier: 1 },
    { value: "22k", priceMultiplier: 22 / 24 },
    { value: "21k", priceMultiplier: 21 / 24 },
    { value: "20k", priceMultiplier: 20 / 24 },
    { value: "18k", priceMultiplier: 18 / 24 },
    { value: "14k", priceMultiplier: 14 / 24 },
  ]

  const handleCalculate = () => {
    const weightNum = Number.parseFloat(weight)
    const shopPriceNum = Number.parseFloat(shopPrice)

    if (isNaN(weightNum) || isNaN(shopPriceNum) || weightNum <= 0 || shopPriceNum <= 0) {
      return
    }

    const karat = goldKarats.find((k) => k.value === selectedKarat)
    if (!karat) return

    const pricePerGram = baseGoldPrice * karat.priceMultiplier
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <HeroSection
        selectedKarat={selectedKarat}
        onKaratChange={setSelectedKarat}
        baseGoldPrice={baseGoldPrice}
        language={language}
      />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {priceError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {priceError}
          </div>
        )}
        
        {priceSuccess && !priceError && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            Current gold price ({selectedKarat.toUpperCase()}): {(baseGoldPrice * (goldKarats.find(k => k.value === selectedKarat)?.priceMultiplier || 1)).toFixed(2)} AED per gram
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
