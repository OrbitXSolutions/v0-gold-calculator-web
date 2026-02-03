import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { LanguageProvider } from "@/lib/language-context"
import { ScrollToTop } from "@/components/ScrollToTop"

export const metadata: Metadata = {
  title: {
    default: "GoldChecker - Live Gold Price & Profit Calculator UAE | Today's Gold Rate Dubai",
    template: "%s | GoldChecker UAE",
  },
  description:
    "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live 24K, 22K, 21K, 18K gold rates in Dubai. Get today's gold price per gram, compare making charges, and know if you're getting a fair deal. Updated daily from Dubai City of Gold.",
  keywords: [
    // Primary keywords
    "gold price UAE",
    "gold price Dubai",
    "gold rate today UAE",
    "gold rate today Dubai",
    "gold calculator UAE",
    "gold profit calculator",
    // Karat-specific keywords
    "24K gold price UAE",
    "22K gold price UAE", 
    "21K gold price UAE",
    "18K gold price UAE",
    "24K gold rate Dubai",
    "22K gold rate Dubai",
    "21K gold rate Dubai",
    "18K gold rate Dubai",
    // Transaction keywords
    "buy gold Dubai",
    "buy gold UAE",
    "sell gold Dubai",
    "gold making charges UAE",
    "gold making charges Dubai",
    // Location keywords
    "Dubai gold souk prices",
    "Dubai City of Gold rates",
    "UAE gold market",
    "gold price per gram Dubai",
    "gold price per gram UAE",
    // Action keywords
    "gold price today",
    "live gold price UAE",
    "current gold rate Dubai",
    "daily gold price UAE",
    "gold price check",
    // Long-tail keywords
    "is gold price fair UAE",
    "gold profit margin calculator",
    "gold investment UAE",
    "best gold price Dubai",
    "gold price comparison UAE",
  ],
  authors: [{ name: "GoldChecker Team", url: "https://goldchecker.ae" }],
  creator: "GoldChecker",
  publisher: "GoldChecker",
  category: "Finance",
  classification: "Gold Price Calculator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://goldchecker.ae"),
  alternates: {
    canonical: "https://goldchecker.ae",
    languages: {
      "en-AE": "https://goldchecker.ae",
      "ar-AE": "https://goldchecker.ae",
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
      "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live 24K, 22K, 21K, 18K rates and know if you're getting a fair deal.",
    images: [
      {
        url: "https://goldchecker.ae/gold-investment.jpg",
        secureUrl: "https://goldchecker.ae/gold-investment.jpg",
        width: 1024,
        height: 1024,
        alt: "GoldChecker - Live Gold Price & Profit Calculator UAE",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@goldcheckerae",
    creator: "@goldcheckerae",
    title: "GoldChecker - Live Gold Price & Profit Calculator UAE",
    description: "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live 24K, 22K, 21K, 18K rates.",
    images: {
      url: "https://goldchecker.ae/gold-investment.jpg",
      alt: "GoldChecker - Live Gold Price & Profit Calculator UAE",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  appleWebApp: {
    capable: true,
    title: "GoldChecker",
    statusBarStyle: "black-translucent",
  },
  applicationName: "GoldChecker",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  other: {
    "msapplication-TileColor": "#f59e0b",
    "msapplication-config": "/browserconfig.xml",
    "apple-mobile-web-app-title": "GoldChecker",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
    "geo.region": "AE",
    "geo.placename": "Dubai",
    "og:price:currency": "AED",
    "business:contact_data:locality": "Dubai",
    "business:contact_data:country_name": "United Arab Emirates",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GoldChecker",
    applicationCategory: "FinanceApplication",
    description: "Calculate gold profit margins instantly with UAE's most accurate gold price calculator. Check live 24K, 22K, 21K, 18K gold rates in Dubai.",
    url: "https://goldchecker.ae",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: "GoldChecker",
      url: "https://goldchecker.ae",
    },
    publisher: {
      "@type": "Organization",
      name: "GoldChecker",
      logo: {
        "@type": "ImageObject",
        url: "https://goldchecker.ae/og-image.png",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    availableLanguage: ["English", "Arabic"],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GoldChecker",
    url: "https://goldchecker.ae",
    logo: "https://goldchecker.ae/og-image.png",
    sameAs: [
      "https://twitter.com/goldcheckerae",
      "https://facebook.com/goldcheckerae",
      "https://instagram.com/goldcheckerae",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GoldChecker",
    url: "https://goldchecker.ae",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://goldchecker.ae/calculator?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html data-theme="goldTheme" lang="en" dir="ltr">
      <head>
        <meta name="theme-color" content="#f59e0b" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f59e0b" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#d97706" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-dark-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dubaicityofgold.com" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
