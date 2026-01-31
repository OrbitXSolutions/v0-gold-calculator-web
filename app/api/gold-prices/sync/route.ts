import { NextResponse } from 'next/server';

// Backend API URL - update this to your actual backend URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://back.goldchecker.ae';

interface BackendGoldPayload {
  source: string;
  k24: number;
  k22: number;
  k21: number;
  k18: number;
  notes: string;
}

interface DCOGResponse {
  status: string;
  msg: string;
  gold_rate_date: string;
  gold_rate_id: string;
  gold_rate_24k: string;
  gold_rate_22k: string;
  gold_rate_21k: string;
  gold_rate_18k: string;
  gold_rate_14k: string;
}

// Function to fetch prices from Dubai City of Gold
async function fetchDCOGPrices(): Promise<DCOGResponse> {
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
    throw new Error(`Failed to fetch from DCOG: ${response.status}`);
  }

  return response.json();
}

// Function to send prices to backend
async function sendToBackend(payload: BackendGoldPayload): Promise<Response> {
  const response = await fetch(`${BACKEND_API_URL}/api/gold/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  return response;
}

// POST endpoint - manually trigger sync
export async function POST(request: Request) {
  try {
    // Optional: Verify API key for security
    const authHeader = request.headers.get('x-api-key');
    const expectedKey = process.env.SYNC_API_KEY;
    
    if (expectedKey && authHeader !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch prices from Dubai City of Gold
    const dcogData = await fetchDCOGPrices();

    if (dcogData.status !== "1") {
      throw new Error(dcogData.msg || 'Invalid response from DCOG API');
    }

    // Prepare payload for backend
    const payload: BackendGoldPayload = {
      source: 'Dubai City of Gold',
      k24: parseFloat(dcogData.gold_rate_24k),
      k22: parseFloat(dcogData.gold_rate_22k),
      k21: parseFloat(dcogData.gold_rate_21k),
      k18: parseFloat(dcogData.gold_rate_18k),
      notes: `Scraped from dubaicityofgold.com on ${dcogData.gold_rate_date}. Rate ID: ${dcogData.gold_rate_id}`,
    };

    // Send to backend
    const backendResponse = await sendToBackend(payload);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
    }

    const backendResult = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Gold prices synced successfully',
      data: {
        prices: payload,
        dcogDate: dcogData.gold_rate_date,
        backendResponse: backendResult,
      },
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error syncing gold prices:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      syncedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}

// GET endpoint - check sync status and last synced prices
export async function GET() {
  try {
    // Fetch current prices from DCOG
    const dcogData = await fetchDCOGPrices();

    if (dcogData.status !== "1") {
      throw new Error(dcogData.msg || 'Invalid response from DCOG API');
    }

    return NextResponse.json({
      success: true,
      currentPrices: {
        source: 'Dubai City of Gold',
        date: dcogData.gold_rate_date,
        k24: parseFloat(dcogData.gold_rate_24k),
        k22: parseFloat(dcogData.gold_rate_22k),
        k21: parseFloat(dcogData.gold_rate_21k),
        k18: parseFloat(dcogData.gold_rate_18k),
        k14: parseFloat(dcogData.gold_rate_14k),
      },
      backendUrl: BACKEND_API_URL,
      checkedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error checking gold prices:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
