'use client';

import { useState, useEffect } from 'react';

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/eth-price');
        if (!response.ok) {
          throw new Error('Failed to fetch ETH price');
        }
        const data = await response.json();
        setEthPrice(data.ethPrice);
      } catch (err: any) {
        console.error('Error fetching ETH price:', err);
        setError(err.message);
        // Fallback to reasonable default
        setEthPrice(2500);
      } finally {
        setLoading(false);
      }
    };

    fetchEthPrice();
    // Refresh every 5 minutes
    const interval = setInterval(fetchEthPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertEthToUsd = (ethAmount: number): number => {
    if (!ethPrice) return 0;
    return ethAmount * ethPrice;
  };

  const ensureMinimumPrice = (usdPrice: number): number => {
    return Math.max(usdPrice, 0.5);
  };

  return {
    ethPrice,
    loading,
    error,
    convertEthToUsd,
    ensureMinimumPrice,
  };
}

