import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import TodayGoldPrices from '@/components/home/TodayGoldPrices'
import Features from '@/components/home/Features'
import CTA from '@/components/home/CTA'

export const metadata: Metadata = {
  title: 'Live Gold Price & Profit Margin Calculator | GoldCheck',
  description:
    "Check live UAE gold prices (24K, 22K, 21K, 18K, 14K), analyze shop profit per gram, and get clear low/medium/high margin labels.",
  keywords: [
    'gold price UAE',
    'gold calculator',
    'gold profit margin',
    'gold rates 24K 22K',
    'gold shop profit',
    'gold UAE calculator',
  ],
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TodayGoldPrices />
      <Features />
      <CTA />
    </div>
  )
}
