import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize Stripe only when needed (not during build)
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(secretKey);
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { price, nftId, nftTitle, nftImage, cartItems } = await request.json();

    // Ensure minimum price
    const priceNum = typeof price === 'number' ? price : parseFloat(price);
    if (!priceNum || priceNum < 0.5) {
      return NextResponse.json(
        { error: 'Minimum order amount is $0.50' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const stripe = getStripe();
    
    // If cartItems exist, create line items from cart
    let lineItems;
    let cancelUrl;
    let metadata: { userId: string; nftId?: string; cartItems?: string } = { userId };

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      // Cart checkout - multiple items
      lineItems = cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title || 'NFT',
            images: item.image ? [item.image] : [],
            description: `NFT ID: ${item.nftId}`,
          },
          unit_amount: Math.round(item.priceUSD * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));
      cancelUrl = `${request.nextUrl.origin}/explore`;
      metadata.cartItems = JSON.stringify(cartItems.map((item: any) => item.nftId));
    } else {
      // Single item checkout
      if (!nftId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: nftTitle || 'NFT Purchase',
              images: nftImage ? [nftImage] : [],
              description: `NFT ID: ${nftId}`,
            },
            unit_amount: Math.round(priceNum * 100), // Convert to cents
          },
          quantity: 1,
        },
      ];
      cancelUrl = `${request.nextUrl.origin}/item-details/${nftId}`;
      metadata.nftId = nftId;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

