import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://back.goldchecker.ae';

export interface TodayVsYesterdayResponse {
  today: {
    date: string;
    rates: {
      k24: number;
      k22: number;
      k21: number;
      k18: number;
    };
    source: string;
    capturedAt: string;
  };
  yesterday: {
    date: string;
    rates: {
      k24: number;
      k22: number;
      k21: number;
      k18: number;
    };
    source: string;
    capturedAt: string;
  };
  changes: {
    k24: { absolute: number; percentage: number };
    k22: { absolute: number; percentage: number };
    k21: { absolute: number; percentage: number };
    k18: { absolute: number; percentage: number };
  };
}

// Cache for 1 minute
let cachedData: TodayVsYesterdayResponse | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 1 * 60 * 1000;

export async function GET() {
  try {
    // Return cached data if still valid
    if (cachedData && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    const response = await fetch(`${BACKEND_API_URL}/api/gold/today-vs-yesterday`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable fetch caching
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data: TodayVsYesterdayResponse = await response.json();
    
    // Cache the result
    cachedData = data;
    cacheTime = Date.now();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching today vs yesterday data:', error);
    
    // Return fallback data
    const fallbackData: TodayVsYesterdayResponse = {
      today: {
        date: new Date().toISOString().split('T')[0],
        rates: { k24: 589.50, k22: 545.75, k21: 523.25, k18: 448.50 },
        source: 'fallback',
        capturedAt: new Date().toISOString(),
      },
      yesterday: {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        rates: { k24: 594.00, k22: 550.00, k21: 527.50, k18: 452.00 },
        source: 'fallback',
        capturedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      changes: {
        k24: { absolute: -4.50, percentage: -0.76 },
        k22: { absolute: -4.25, percentage: -0.77 },
        k21: { absolute: -4.25, percentage: -0.81 },
        k18: { absolute: -3.50, percentage: -0.77 },
      },
    };

    return NextResponse.json(fallbackData);
  }
}
