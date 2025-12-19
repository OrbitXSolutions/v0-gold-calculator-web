"use client"
import { Calculator } from "lucide-react"
import { getCalculatorTranslation } from "../../lib/translations"

type Props = {
  selectedKarat: string
  weight: string
  shopPrice: string
  onKaratChange: (v: string) => void
  onWeightChange: (v: string) => void
  onShopPriceChange: (v: string) => void
  onCalculate: () => void
  language: "en" | "ar"
}

export function CalculatorCard(props: Props) {
  const t = getCalculatorTranslation(props.language)

  const karats = [
    { label: "24K (99.9% purity)", value: "24k" },
    { label: "22K", value: "22k" },
    { label: "21K", value: "21k" },
    { label: "20K", value: "20k" },
    { label: "18K", value: "18k" },
    { label: "14K", value: "14k" },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center gap-3 px-6 pt-6">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">{t.calculatorTitle}</h2>
          <p className="text-neutral-600 text-base">{t.calculatorDescription}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200" />
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-medium">
                1
              </span>{" "}
              {t.step1}
            </label>
            <select
              value={props.selectedKarat}
              onChange={(e) => props.onKaratChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 text-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            >
              {karats.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-medium">
                2
              </span>{" "}
              {t.step2}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="10"
                value={props.weight}
                onChange={(e) => props.onWeightChange(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-gray-100 text-neutral-900 placeholder-neutral-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              />
              <span className="text-neutral-600">{t.grams}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{t.step2Question}</p>
          </div>

          <div>
            <label className="mb-2 block flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-medium">
                3
              </span>{" "}
              {t.step3}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="3000"
                value={props.shopPrice}
                onChange={(e) => props.onShopPriceChange(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-gray-100 text-neutral-900 placeholder-neutral-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              />
              <span className="text-neutral-600">{t.aed}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{t.step3Question}</p>
          </div>

          <button
            onClick={props.onCalculate}
            className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-3 font-medium text-white transition-colors shadow"
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <Calculator className="h-4 w-4" />
              {t.calculateButton}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
