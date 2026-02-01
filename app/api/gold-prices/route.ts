import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface GoldPrice {
  karat: string;
  price: number;
  currency: string;
}

export interface GoldPricesResponse {
  prices: GoldPrice[];
  date: string;
  source: string;
  lastUpdated: string;
  error?: string;
}

// Cache the prices for 5 minutes to avoid excessive requests
let cachedPrices: GoldPricesResponse | null = null;
let cacheTime: number = 0;
let cachedDate: string = '';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get current UAE date string
function getUAEDateString(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });
}

export async function GET() {
  try {
    const currentUAEDate = getUAEDateString();
    
    // Invalidate cache if date has changed (new day in UAE)
    if (cachedDate !== currentUAEDate) {
      cachedPrices = null;
      cacheTime = 0;
      cachedDate = currentUAEDate;
    }
    
    // Return cached prices if still valid
    if (cachedPrices && Date.now() - cacheTime < CACHE_DURATION && !cachedPrices.error) {
      return NextResponse.json(cachedPrices, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // Fetch from the DCOG API endpoint directly
    const formData = new URLSearchParams();
    formData.append('vendor_key', 'DCOG_KEY_964592976');

    const response = await fetch('https://dubaicityofgold.com/gold-rate-app/dcoggoldrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Origin': 'https://dubaicityofgold.com',
        'Referer': 'https://dubaicityofgold.com/',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "1") {
      // Parse the date from YYYY-MM-DD to DD-MM-YYYY
      const originalDate = data.gold_rate_date;
      const dateParts = originalDate.split('-');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const prices: GoldPrice[] = [
        { karat: '24K', price: parseFloat(data.gold_rate_24k), currency: 'AED' },
        { karat: '22K', price: parseFloat(data.gold_rate_22k), currency: 'AED' },
        { karat: '21K', price: parseFloat(data.gold_rate_21k), currency: 'AED' },
        { karat: '18K', price: parseFloat(data.gold_rate_18k), currency: 'AED' },
        { karat: '14K', price: parseFloat(data.gold_rate_14k), currency: 'AED' },
      ];

      const result: GoldPricesResponse = {
        prices,
        date: formattedDate,
        source: 'Dubai City of Gold',
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      cachedPrices = result;
      cacheTime = Date.now();

      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    } else {
      throw new Error(data.msg || 'Invalid response from DCOG API');
    }

  } catch (error) {
    console.error('Error fetching gold prices:', error);
    
    // Return fallback prices based on the current values from dubaicityofgold.com
    const fallbackResult: GoldPricesResponse = {
      prices: [
        { karat: '24K', price: 589.50, currency: 'AED' },
        { karat: '22K', price: 545.75, currency: 'AED' },
        { karat: '21K', price: 523.25, currency: 'AED' },
        { karat: '18K', price: 448.50, currency: 'AED' },
        { karat: '14K', price: 349.75, currency: 'AED' },
      ],
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      source: 'Dubai City of Gold (Cached)',
      lastUpdated: new Date().toISOString(),
      error: 'Using cached prices - live fetch temporarily unavailable'
    };

    return NextResponse.json(fallbackResult, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
}
