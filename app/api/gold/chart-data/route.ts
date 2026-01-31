import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://back.goldchecker.ae';

export interface ChartDataPoint {
  date: string;
  capturedAt: string;
  source: string;
  rates: {
    k24: number;
    k22: number;
    k21: number;
    k18: number;
  };
}

export interface ChartDataResponse {
  period: string;
  from: string;
  to: string;
  karat: string;
  totalDays: number;
  data: ChartDataPoint[];
}

// Cache for 10 minutes
let cachedData: { [key: string]: ChartDataResponse } = {};
let cacheTime: { [key: string]: number } = {};
const CACHE_DURATION = 10 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const karat = searchParams.get('karat') || 'all';
    const period = searchParams.get('period') || 'month';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    const cacheKey = `${karat}-${period}-${from}-${to}`;

    // Return cached data if still valid
    if (cachedData[cacheKey] && Date.now() - (cacheTime[cacheKey] || 0) < CACHE_DURATION) {
      return NextResponse.json(cachedData[cacheKey]);
    }

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.set('karat', karat);
    queryParams.set('period', period);
    if (from) queryParams.set('from', from);
    if (to) queryParams.set('to', to);

    const response = await fetch(`${BACKEND_API_URL}/api/gold/chart-data?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data: ChartDataResponse = await response.json();
    
    // Cache the result
    cachedData[cacheKey] = data;
    cacheTime[cacheKey] = Date.now();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    
    // Generate fallback data for the last 30 days
    const fallbackData: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic looking price variations
      const basePrice = 560 + Math.sin(i / 5) * 30 + (29 - i) * 0.8;
      
      fallbackData.push({
        date: date.toISOString().split('T')[0],
        capturedAt: date.toISOString(),
        source: 'fallback',
        rates: {
          k24: Math.round(basePrice * 100) / 100,
          k22: Math.round(basePrice * 0.916 * 100) / 100,
          k21: Math.round(basePrice * 0.875 * 100) / 100,
          k18: Math.round(basePrice * 0.75 * 100) / 100,
        },
      });
    }

    const fallbackResponse: ChartDataResponse = {
      period: 'month',
      from: fallbackData[0].date,
      to: fallbackData[fallbackData.length - 1].date,
      karat: 'all',
      totalDays: 30,
      data: fallbackData,
    };

    return NextResponse.json(fallbackResponse);
  }
}
