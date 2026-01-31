import { NextResponse } from 'next/server';

// This endpoint is designed to be called by a cron job service
// For Vercel, you can configure this in vercel.json
// For other services, call this endpoint with a GET request

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://back.goldchecker.ae';

interface BackendGoldPayload {
  source: string;
  k24: number;
  k22: number;
  k21: number;
  k18: number;
  notes: string;
}

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  
  // If no secret is set, allow all requests (for development)
  if (!cronSecret) {
    return true;
  }
  
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  // Verify the request is from the cron service
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[CRON] Starting daily gold price sync...');

    // Fetch prices from Dubai City of Gold
    const formData = new URLSearchParams();
    formData.append('vendor_key', 'DCOG_KEY_964592976');

    const dcogResponse = await fetch('https://dubaicityofgold.com/gold-rate-app/dcoggoldrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://dubaicityofgold.com',
        'Referer': 'https://dubaicityofgold.com/',
      },
      body: formData,
    });

    if (!dcogResponse.ok) {
      throw new Error(`Failed to fetch from DCOG: ${dcogResponse.status}`);
    }

    const dcogData = await dcogResponse.json();

    if (dcogData.status !== "1") {
      throw new Error(dcogData.msg || 'Invalid response from DCOG API');
    }

    console.log('[CRON] Fetched prices from Dubai City of Gold:', {
      date: dcogData.gold_rate_date,
      k24: dcogData.gold_rate_24k,
      k22: dcogData.gold_rate_22k,
      k21: dcogData.gold_rate_21k,
      k18: dcogData.gold_rate_18k,
    });

    // Prepare payload for backend
    const payload: BackendGoldPayload = {
      source: 'Dubai City of Gold',
      k24: parseFloat(dcogData.gold_rate_24k),
      k22: parseFloat(dcogData.gold_rate_22k),
      k21: parseFloat(dcogData.gold_rate_21k),
      k18: parseFloat(dcogData.gold_rate_18k),
      notes: `Auto-synced via cron job on ${new Date().toISOString()}. DCOG date: ${dcogData.gold_rate_date}`,
    };

    // Send to backend
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/gold/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
    }

    const backendResult = await backendResponse.json();

    console.log('[CRON] Successfully synced prices to backend');

    return NextResponse.json({
      success: true,
      message: 'Daily gold price sync completed',
      data: {
        prices: {
          k24: payload.k24,
          k22: payload.k22,
          k21: payload.k21,
          k18: payload.k18,
        },
        dcogDate: dcogData.gold_rate_date,
        backendResponse: backendResult,
      },
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON] Error during daily gold price sync:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      syncedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also support POST for flexibility
export async function POST(request: Request) {
  return GET(request);
}
