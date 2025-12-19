import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { LanguageProvider } from "@/lib/language-context"
import { ScrollToTop } from "@/components/ScrollToTop"

export const metadata: Metadata = {
  title: {
    default: "GoldChecker - Live Gold Price & Profit Calculator UAE",
    template: "%s | GoldChecker",
  },
  description:
    "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live 24K, 22K, 21K, 18K gold rates and know if you're getting a fair deal.",
  keywords: [
    "gold price UAE",
    "gold calculator",
    "gold profit margin",
    "24K gold price",
    "22K gold price",
    "Dubai gold rate",
    "gold making charges",
    "UAE gold market",
    "gold price today",
    "buy gold UAE",
  ],
  authors: [{ name: "GoldChecker Team" }],
  creator: "GoldChecker",
  publisher: "GoldChecker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://goldchecker.ae"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    url: "https://goldchecker.ae",
    siteName: "GoldChecker",
    title: "GoldChecker - Live Gold Price & Profit Calculator UAE",
    description:
      "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live rates and know if you're getting a fair deal.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GoldChecker Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoldChecker - Live Gold Price & Profit Calculator UAE",
    description: "Calculate gold profit margins instantly with UAE's most accurate gold price calculator.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="goldTheme" lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body>
        <LanguageProvider>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-[calc(100vh-var(--navbar-height))]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
