'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CartItem {
  nftId: string;
  title: string;
  image: string;
  priceETH: number;
  priceUSD: number;
  quantity: number;
}

interface StripeCheckoutProps {
  price: number | string;
  nftId: string;
  nftTitle?: string;
  nftImage?: string;
  cartItems?: CartItem[];
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function StripeCheckout({ price, nftId, nftTitle, nftImage, cartItems, disabled, onSuccess, onError }: StripeCheckoutProps) {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isSignedIn) {
      // Don't show alert, just return - the button will show "Sign In to Buy"
      return;
    }

    if (disabled) {
      return;
    }

    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (!priceNum || priceNum <= 0) {
      alert('Invalid price');
      return;
    }

    // Ensure minimum price
    if (priceNum < 0.5) {
      alert('Minimum order amount is $0.50');
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
          cartItems, // Include cart items if this is a cart checkout
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        // Call onSuccess callback if provided (e.g., to clear cart)
        if (onSuccess) {
          onSuccess();
        }
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

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          className="btn-main"
          style={{ cursor: 'pointer', width: '100%' }}
        >
          Sign In to Buy
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className="btn-main"
      style={{ 
        cursor: (loading || disabled) ? 'not-allowed' : 'pointer', 
        width: '100%',
        opacity: disabled ? 0.6 : 1,
        padding: '8px 20px',
        fontSize: '14px',
      }}
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}

