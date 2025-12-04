'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  price: number | string;
  nftId: string;
  nftTitle?: string;
  nftImage?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function StripeCheckout({ price, nftId, nftTitle, nftImage, onSuccess, onError }: StripeCheckoutProps) {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert('Please sign in to purchase NFTs');
      return;
    }

    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (!priceNum || priceNum <= 0) {
      alert('Invalid price');
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: priceNum,
          nftId,
          nftTitle,
          nftImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        // Use the checkout URL directly
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error?.message || 'Failed to process payment. Please try again.';
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !isSignedIn}
      className="btn-main"
      style={{ cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Processing...' : isSignedIn ? 'Buy Now' : 'Sign In to Buy'}
    </button>
  );
}

