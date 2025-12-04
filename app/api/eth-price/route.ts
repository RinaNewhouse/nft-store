import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    // Fetch ETH price from CoinGecko (free, no API key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch ETH price');
    }

    const data = await response.json();
    const ethPrice = data.ethereum?.usd;

    if (!ethPrice) {
      throw new Error('Invalid ETH price data');
    }

    return NextResponse.json({ ethPrice });
  } catch (error: any) {
    console.error('Error fetching ETH price:', error);
    // Fallback to a reasonable default if API fails
    return NextResponse.json({ ethPrice: 2500 }, { status: 200 });
  }
}

