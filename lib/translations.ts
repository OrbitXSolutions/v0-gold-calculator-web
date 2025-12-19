export type Language = "en" | "ar"

export const translations = {
  en: {
    // Navigation
    home: "Home",
    calculator: "Calculator",
    blog: "Blog",
    aboutUs: "About Us",
    contactUs: "Contact Us",

    // Header
    title: "Today's Gold Price Chart",
    subtitle: "Real-time market tracking for informed decisions",
    currentRate: "Current Rate",
    perGram: "per gram",
    karatType: "Karat Type:",
    yesterdayChange: "vs Yesterday",
    allKaratPrices: "Today's Gold Prices by Karat",
    karat: "Karat",
    purity: "Purity",
    pricePerGram: "Price per Gram",

    // Calculator
    calculatorTitle: "Gold Profit Calculator",
    calculatorDescription: "Calculate the margin between market price and shop price",
    step1: "Choose Gold Karat",
    step2: "Enter Weight (Grams)",
    step2Question: "How many grams do you want to buy?",
    step3: "Shop's Offered Price",
    step3Question: "What is the shop's total price for this item?",
    calculateButton: "Calculate Profit Margin",
    tooltipText: "Margin is calculated based on market price vs shop price.",

    // Karats
    purity: "purity",
    grams: "grams",

    // Results
    calculationResults: "Calculation Results",
    profitMargin: "Profit Margin",
    marketRate: "Market Rate",
    goldValue: "Official Gold Value",
    goldValueDesc: "Market rate × weight",
    profitPerGram: "Shop Profit Per Gram",
    profitPerGramDesc: "Shop's markup rate",
    totalProfit: "Total Shop Profit",
    totalProfitDesc: "Shop's total markup",

    // Margin Status
    lowMargin: "Low Margin - Good Deal",
    mediumMargin: "Medium Margin",
    highMargin: "High Margin - Expensive",

    // Detailed Analysis
    officialValue: "Official Gold Value",
    shopProfitPerGram: "Shop Profit Per Gram",
    totalShopProfit: "Total Shop Profit",

    // Customer Summary
    goodDeal: "Good deal!",
    reasonablePrice: "Reasonable price.",
    highMarginAlert: "High margin alert.",

    lowMarginText: (officialValue: string, profitPerGram: string, totalProfit: string) =>
      `The official gold value is ${officialValue}, and the shop is only adding ${profitPerGram} per gram, totaling ${totalProfit}. This is considered a low margin — the price is very close to today's gold rate.`,

    mediumMarginText: (profitPerGram: string, totalProfit: string) =>
      `The shop's profit is ${profitPerGram} per gram (total ${totalProfit}). This is average for UAE jewelry shops. You may negotiate a bit.`,

    highMarginText: (profitPerGram: string, totalProfit: string) =>
      `The shop is adding ${profitPerGram} per gram, with total extra profit of ${totalProfit}. This is high compared to the market — consider negotiating or comparing other shops.`,

    // Insights
    priceAboveRate: "Shop price is",
    aboveMarketRate: "above today's rate",
    typicalCharges: "Typical UAE making charges:",
    perGramRange: "per gram",
    recommendation: "Recommendation:",

    // Footer
    poweredBy: "Your trusted source for accurate gold pricing in the UAE",
    disclaimer:
      "Live gold prices updated regularly. For informational purposes only. Always verify with dealers before purchase.",
  },

  ar: {
    // Navigation
    home: "الرئيسية",
    calculator: "الحاسبة",
    blog: "المدونة",
    aboutUs: "من نحن",
    contactUs: "اتصل بنا",

    // Header
    title: "مخطط سعر الذهب اليوم",
    subtitle: "متابعة السوق مباشرة لاتخاذ قرارات مدروسة",
    currentRate: "السعر الحالي",
    perGram: "للغرام",
    karatType: "نوع العيار:",
    yesterdayChange: "مقارنة بالأمس",
    allKaratPrices: "أسعار الذهب اليوم حسب العيار",
    karat: "العيار",
    purity: "النقاء",
    pricePerGram: "السعر للغرام",

    // Calculator
    calculatorTitle: "حاسبة ربح الذهب",
    calculatorDescription: "احسب الفرق بين سعر السوق وسعر المحل",
    step1: "اختر عيار الذهب",
    step2: "أدخل الوزن (غرام)",
    step2Question: "كم غراماً تريد شراءه؟",
    step3: "سعر المحل المعروض",
    step3Question: "ما هو السعر الإجمالي للمحل لهذا العنصر؟",
    calculateButton: "احسب هامش الربح",
    tooltipText: "يتم حساب الهامش بناءً على سعر السوق مقابل سعر المحل.",

    // Karats
    purity: "نقاء",
    grams: "غرام",

    // Results
    calculationResults: "نتائج الحساب",
    profitMargin: "هامش الربح",
    marketRate: "سعر السوق",
    goldValue: "القيمة الرسمية للذهب",
    goldValueDesc: "سعر اليوم × الوزن",
    profitPerGram: "ربح المحل لكل غرام",
    profitPerGramDesc: "معدل زيادة المحل",
    totalProfit: "إجمالي ربح المحل",
    totalProfitDesc: "الزيادة الكلية للمحل",

    // Margin Status
    lowMargin: "هامش منخفض - صفقة جيدة",
    mediumMargin: "هامش متوسط",
    highMargin: "هامش مرتفع - غالي",

    // Detailed Analysis
    officialValue: "القيمة الرسمية للذهب",
    shopProfitPerGram: "ربح المحل لكل غرام",
    totalShopProfit: "إجمالي ربح المحل",

    // Customer Summary
    goodDeal: "صفقة ممتازة!",
    reasonablePrice: "سعر مقبول.",
    highMarginAlert: "تنبيه: هامش مرتفع!",

    lowMarginText: (officialValue: string, profitPerGram: string, totalProfit: string) =>
      `القيمة الحقيقية للذهب ${officialValue}، والمحل يضيف فقط ${profitPerGram} لكل غرام، بإجمالي ${totalProfit}. هذا الهامش يُعتبر منخفضاً جداً، والسعر قريب من سعر الذهب الحقيقي.`,

    mediumMarginText: (profitPerGram: string, totalProfit: string) =>
      `ربح المحل ${profitPerGram} لكل غرام (بإجمالي ${totalProfit}). هذا ضمن المعدل الطبيعي لمحلات الذهب في الإمارات. يمكنك التفاوض قليلاً.`,

    highMarginText: (profitPerGram: string, totalProfit: string) =>
      `المحل يضيف ${profitPerGram} لكل غرام، بإجمالي ربح ${totalProfit}. هذا المبلغ أعلى من السوق — يفضّل التفاوض أو مقارنة الأسعار.`,

    // Insights
    priceAboveRate: "سعر المحل أعلى بنسبة",
    aboveMarketRate: "عن السعر الرسمي",
    typicalCharges: "تكلفة المصنعية المعتادة:",
    perGramRange: "للغرام",
    recommendation: "التوصية",

    // Footer
    poweredBy: "مصدرك الموثوق للحصول على أسعار دقيقة للذهب في الإمارات",
    disclaimer: "يتم تحديث أسعار الذهب المباشرة بانتظام. لأغراض إعلامية فقط. تحقق دائمًا مع التجار قبل الشراء.",
  },
}

export const calculatorTranslations = {
  en: {
    // Calculator labels and steps
    calculatorTitle: "Gold Profit Calculator",
    calculatorDescription: "Calculate the margin between market price and shop price",
    step1: "Choose Gold Karat",
    step2: "Enter Weight (Grams)",
    step2Question: "How many grams do you want to buy?",
    step3: "Shop's Offered Price",
    step3Question: "What is the shop's total price for this item?",
    calculateButton: "Calculate Profit Margin",
    grams: "Grams",
    aed: "AED",

    // Results
    calculationResults: "Calculation Results",
    profitMargin: "Profit Margin",
    marketRate: "Market Rate",
    gold: "Gold",
    perGram: "per gram",

    // Detailed metrics
    officialGoldValue: "Official Gold Value",
    shopProfitPerGram: "Shop Profit Per Gram",
    totalShopProfit: "Total Shop Profit",

    // Status messages
    lowMargin: "Low Margin – Good Deal",
    mediumMargin: "Medium Margin",
    highMargin: "High Margin",
    goodDeal: "Good deal!",
    fairDeal: "Fair deal",
    highMarginAlert: "High margin",

    // Explanation
    explanationText: (goldValue: string, profitPerGram: string, totalProfit: string, status: string) =>
      `The official gold value is ${goldValue}, and the shop is adding ${profitPerGram} per gram, totaling ${totalProfit}. This is considered a ${status} margin.`,

    // Insights
    shopPriceIs: "Shop price is",
    aboveTodayRate: "above today's rate",
    typicalUAECharges: "Typical UAE making charges",
    recommendation: "Recommendation",
  },

  ar: {
    // Calculator labels and steps
    calculatorTitle: "حاسبة ربح الذهب",
    calculatorDescription: "احسب الفرق بين سعر السوق وسعر المحل",
    step1: "اختر عيار الذهب",
    step2: "أدخل الوزن (غرام)",
    step2Question: "كم غراماً تريد شراءه؟",
    step3: "سعر المحل المعروض",
    step3Question: "ما هو السعر الإجمالي للمحل لهذا العنصر؟",
    calculateButton: "احسب هامش الربح",
    grams: "غرام",
    aed: "درهم",

    // Results
    calculationResults: "نتائج الحساب",
    profitMargin: "هامش الربح",
    marketRate: "سعر السوق",
    gold: "ذهب",
    perGram: "للغرام",

    // Detailed metrics
    officialGoldValue: "القيمة الرسمية للذهب",
    shopProfitPerGram: "ربح المحل لكل غرام",
    totalShopProfit: "إجمالي ربح المحل",

    // Status messages
    lowMargin: "هامش منخفض – صفقة جيدة",
    mediumMargin: "هامش متوسط",
    highMargin: "هامش مرتفع",
    goodDeal: "صفقة ممتازة!",
    fairDeal: "صفقة مقبولة",
    highMarginAlert: "هامش مرتفع",

    // Explanation
    explanationText: (goldValue: string, profitPerGram: string, totalProfit: string, status: string) =>
      `القيمة الرسمية للذهب ${goldValue}، والمحل يضيف ${profitPerGram} لكل غرام، بإجمالي ${totalProfit}. هذا الهامش يُعتبر ${status}.`,

    // Insights
    shopPriceIs: "سعر المحل أعلى بنسبة",
    aboveTodayRate: "عن سعر اليوم",
    typicalUAECharges: "رسوم المصنعية المعتادة",
    recommendation: "التوصية",
  },
}

export function getTranslation(lang: Language) {
  return translations[lang]
}

export function getCalculatorTranslation(lang: Language) {
  return calculatorTranslations[lang]
}

export const homeTranslations = {
  en: {
    heroTitle: "Live Gold Price & Profit Margin Calculator",
    heroSubtitle:
      "Welcome to the UAE's most accurate and easy-to-use gold profit margin calculator. Check today's gold prices, compare shop offers, and instantly know if you're getting a good deal.",
    feature1: "Live gold price (24K, 22K, 21K, 18K, 14K)",
    feature2: "Smart analysis with low/medium/high margin labels",
    feature3: "Calculate shop profit per gram",
    feature4: "Arabic + English support",
    goToCalculator: "Go to Calculator",
    whyUseTitle: "Why Use Our Calculator?",
    whyFeature1Title: "Avoid overpaying for gold",
    whyFeature1Subtitle: "Know exactly what you're paying for",
    whyFeature2Title: "Know the real market rate instantly",
    whyFeature2Subtitle: "Up-to-date prices for all karats",
    whyFeature3Title: "Understand making charges clearly",
    whyFeature3Subtitle: "See shop profit breakdown per gram",
    whyFeature4Title: "Make smarter buying decisions",
    whyFeature4Subtitle: "Get instant analysis and recommendations",
    ctaTitle: "Start Calculating",
    ctaSubtitle: "Use the calculator below to check your gold deal within seconds.",
  },
  ar: {
    heroTitle: "حاسبة سعر الذهب وهامش الربح المباشرة",
    heroSubtitle:
      "مرحباً بك في حاسبة هامش ربح الذهب الأكثر دقة وسهولة في الاستخدام في الإمارات. تحقق من أسعار الذهب اليوم، قارن عروض المحلات، واعرف على الفور إذا كنت تحصل على صفقة جيدة.",
    feature1: "سعر الذهب المباشر (24، 22، 21، 18، 14 قيراط)",
    feature2: "تحليل ذكي مع تصنيفات الهامش المنخفض/المتوسط/المرتفع",
    feature3: "احسب ربح المحل لكل غرام",
    feature4: "دعم اللغة العربية والإنجليزية",
    goToCalculator: "اذهب إلى الحاسبة",
    whyUseTitle: "لماذا تستخدم حاسبتنا؟",
    whyFeature1Title: "تجنب دفع أكثر من اللازم للذهب",
    whyFeature1Subtitle: "اعرف بالضبط ما تدفع مقابله",
    whyFeature2Title: "اعرف سعر السوق الحقيقي فوراً",
    whyFeature2Subtitle: "أسعار محدثة لجميع العيارات",
    whyFeature3Title: "افهم رسوم المصنعية بوضوح",
    whyFeature3Subtitle: "شاهد تفصيل ربح المحل لكل غرام",
    whyFeature4Title: "اتخذ قرارات شراء أذكى",
    whyFeature4Subtitle: "احصل على تحليل وتوصيات فورية",
    ctaTitle: "ابدأ الحساب",
    ctaSubtitle: "استخدم الحاسبة أدناه للتحقق من صفقة الذهب الخاصة بك في ثوانٍ.",
  },
}

export const blogTranslations = {
  en: {
    pageTitle: "Gold Knowledge Hub",
    pageDescription: "Educational articles to help you make informed decisions about gold purchases.",
    searchPlaceholder: "Search articles...",
    searchButton: "Search",
    showingResults: "Showing results for",
    noArticles: "No articles available right now. Please check back later.",
    readArticle: "Read Article",
    minRead: "min read",
    by: "By",
    prevButton: "Prev",
    nextButton: "Next",
    ctaTitle: "Ready to Calculate Your Gold Purchase?",
    ctaDescription:
      "Use our professional gold profit calculator to instantly analyze shop offers, compare prices with market rates, and make informed decisions before you buy. Get accurate margin calculations in seconds.",
    ctaButton: "Start Calculating Now",
    ctaBenefit1: "Live gold prices updated daily",
    ctaBenefit2: "Instant profit margin analysis",
    ctaBenefit3: "Smart buying recommendations",
    shareButton: "Share",
    copyLink: "Copy Link",
    copied: "Copied!",
  },
  ar: {
    pageTitle: "مركز المعرفة الذهبية",
    pageDescription: "مقالات تعليمية لمساعدتك على اتخاذ قرارات مستنيرة بشأن شراء الذهب.",
    searchPlaceholder: "البحث في المقالات...",
    searchButton: "بحث",
    showingResults: "عرض النتائج لـ",
    noArticles: "لا توجد مقالات متاحة الآن. يرجى المراجعة لاحقًا.",
    readArticle: "اقرأ المقال",
    minRead: "دقيقة قراءة",
    by: "بواسطة",
    prevButton: "السابق",
    nextButton: "التالي",
    ctaTitle: "هل أنت مستعد لحساب شراء الذهب؟",
    ctaDescription:
      "استخدم حاسبة ربح الذهب الاحترافية للتحليل الفوري لعروض المحلات، ومقارنة الأسعار مع أسعار السوق، واتخاذ قرارات مستنيرة قبل الشراء. احصل على حسابات هامش الربح الدقيقة في ثوانٍ.",
    ctaButton: "ابدأ الحساب الآن",
    ctaBenefit1: "أسعار الذهب المباشرة محدثة يومياً",
    ctaBenefit2: "تحليل فوري لهامش الربح",
    ctaBenefit3: "توصيات شراء ذكية",
    shareButton: "مشاركة",
    copyLink: "نسخ الرابط",
    copied: "تم النسخ!",
  },
}

export const aboutTranslations = {
  en: {
    pageTitle: "About Us",
    intro:
      "We created this platform to help buyers in the UAE and GCC understand gold pricing clearly and transparently. Gold is a valuable purchase, and many buyers pay more than necessary because they don't know the actual market price.",
    missionTitle: "Our Mission:",
    mission1: "Provide accurate gold price data",
    mission2: "Offer a smart, easy calculator",
    mission3: "Help customers avoid overpriced deals",
    mission4: "Increase transparency in the gold market",
    disclaimer: "We are continuously adding new features such as alerts, charts, and educational articles.",
    accuracyTitle: "Accuracy",
    accuracyDesc: "Providing real-time, accurate gold prices",
    transparencyTitle: "Transparency",
    transparencyDesc: "Clear breakdown of costs and margins",
    educationTitle: "Education",
    educationDesc: "Helping users understand gold pricing",
    communityTitle: "Community",
    communityDesc: "Building trust with UAE gold buyers",
  },
  ar: {
    pageTitle: "من نحن",
    intro:
      "أنشأنا هذه المنصة لمساعدة المشترين في الإمارات ودول مجلس التعاون الخليجي على فهم تسعير الذهب بوضوح وشفافية. الذهب عملية شراء قيمة، والعديد من المشترين يدفعون أكثر من اللازم لأنهم لا يعرفون سعر السوق الفعلي.",
    missionTitle: "مهمتنا:",
    mission1: "توفير بيانات دقيقة لأسعار الذهب",
    mission2: "تقديم حاسبة ذكية وسهلة",
    mission3: "مساعدة العملاء على تجنب الصفقات المبالغ فيها",
    mission4: "زيادة الشفافية في سوق الذهب",
    disclaimer: "نحن نضيف باستمرار ميزات جديدة مثل التنبيهات والرسوم البيانية والمقالات التعليمية.",
    accuracyTitle: "الدقة",
    accuracyDesc: "توفير أسعار الذهب الدقيقة في الوقت الفعلي",
    transparencyTitle: "الشفافية",
    transparencyDesc: "تفصيل واضح للتكاليف والهوامش",
    educationTitle: "التعليم",
    educationDesc: "مساعدة المستخدمين على فهم تسعير الذهب",
    communityTitle: "المجتمع",
    communityDesc: "بناء الثقة مع مشتري الذهب في الإمارات",
  },
}

export const contactTranslations = {
  en: {
    pageTitle: "Contact Us",
    pageDescription: "Have a question, suggestion, or partnership request? We'd love to hear from you.",
    emailLabel: "Email:",
    emailValue: "support@goldcheck.com",
    whatsappLabel: "WhatsApp:",
    whatsappValue: "+971 5X XXX XXXX",
    hoursLabel: "Business Hours:",
    hoursValue: "9:00am – 6:00pm (GST)",
    responseTime: "We typically respond within 24 hours during business days.",
  },
  ar: {
    pageTitle: "اتصل بنا",
    pageDescription: "هل لديك سؤال أو اقتراح أو طلب شراكة؟ نحن نحب أن نسمع منك.",
    emailLabel: "البريد الإلكتروني:",
    emailValue: "support@goldcheck.com",
    whatsappLabel: "واتساب:",
    whatsappValue: "+971 5X XXX XXXX",
    hoursLabel: "ساعات العمل:",
    hoursValue: "9:00 صباحاً – 6:00 مساءً (توقيت الخليج)",
    responseTime: "نحن نرد عادة في غضون 24 ساعة خلال أيام العمل.",
  },
}

export const privacyTranslations = {
  en: {
    pageTitle: "Privacy Policy",
    intro: "We respect your privacy.",
    description: "This website collects minimal information to improve your experience, including:",
    analytics: "Anonymous usage analytics",
    forms: "Form submissions (when contacting us)",
    cookies: "Cookies for user preferences",
    point1: "We do not sell or share your personal data with third parties.",
    point2: "Your information is stored securely and used only for improving our services.",
    point3: "If you wish to delete your data, you may contact us anytime at support@goldcheck.com.",
    lastUpdated: "Last updated: November 2025",
  },
  ar: {
    pageTitle: "سياسة الخصوصية",
    intro: "نحن نحترم خصوصيتك.",
    description: "يجمع هذا الموقع معلومات ضئيلة لتحسين تجربتك، بما في ذلك:",
    analytics: "تحليلات الاستخدام المجهولة",
    forms: "إرسال النماذج (عند الاتصال بنا)",
    cookies: "ملفات تعريف الارتباط لتفضيلات المستخدم",
    point1: "نحن لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة.",
    point2: "يتم تخزين معلوماتك بشكل آمن وتستخدم فقط لتحسين خدماتنا.",
    point3: "إذا كنت ترغب في حذف بياناتك، يمكنك الاتصال بنا في أي وقت على support@goldcheck.com.",
    lastUpdated: "آخر تحديث: نوفمبر 2025",
  },
}

export const termsTranslations = {
  en: {
    pageTitle: "Terms & Conditions",
    intro: "By using this website, you agree to the following:",
    rule1: "Gold prices are obtained from reliable sources, but may vary slightly across markets.",
    rule2: "The profit margin analysis is for informational purposes only.",
    rule3: "We are not responsible for financial decisions made based on the calculator.",
    rule4: "Users must verify prices with the gold shop before purchasing.",
    rule5: "The website content may be updated at any time without prior notice.",
    important:
      "Important: Always verify gold prices and quality certificates with authorized dealers before making a purchase.",
    lastUpdated: "Last updated: November 2025",
  },
  ar: {
    pageTitle: "الشروط والأحكام",
    intro: "باستخدام هذا الموقع، فإنك توافق على ما يلي:",
    rule1: "يتم الحصول على أسعار الذهب من مصادر موثوقة، ولكن قد تختلف قليلاً عبر الأسواق.",
    rule2: "تحليل هامش الربح هو لأغراض إعلامية فقط.",
    rule3: "نحن لسنا مسؤولين عن القرارات المالية المتخذة بناءً على الحاسبة.",
    rule4: "يجب على المستخدمين التحقق من الأسعار مع محل الذهب قبل الشراء.",
    rule5: "قد يتم تحديث محتوى الموقع في أي وقت دون إشعار مسبق.",
    important: "مهم: تحقق دائمًا من أسعار الذهب وشهادات الجودة مع التجار المعتمدين قبل إجراء عملية شراء.",
    lastUpdated: "آخر تحديث: نوفمبر 2025",
  },
}

export function getHomeTranslation(lang: Language) {
  return homeTranslations[lang]
}

export function getBlogTranslation(lang: Language) {
  return blogTranslations[lang]
}

export function getAboutTranslation(lang: Language) {
  return aboutTranslations[lang]
}

export function getContactTranslation(lang: Language) {
  return contactTranslations[lang]
}

export function getPrivacyTranslation(lang: Language) {
  return privacyTranslations[lang]
}

export function getTermsTranslation(lang: Language) {
  return termsTranslations[lang]
}
