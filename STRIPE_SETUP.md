# Stripe Integration Setup Guide

## ✅ Yes, you can reuse your Stripe keys!

Your Stripe API keys are tied to your Stripe account, not to a specific project. You can safely use the same keys across multiple projects.

## Environment Variables Setup

1. Create a `.env.local` file in the root of your project:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_key_here

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

2. **For Vercel Deployment:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add all the variables above
   - Make sure to add them for Production, Preview, and Development environments

## Stripe Webhook Setup (for production)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the "Signing secret" and add it to `STRIPE_WEBHOOK_SECRET` in your environment variables

## How It Works

1. **User clicks "Buy Now"** → Must be signed in with Clerk
2. **Stripe Checkout Session created** → API route creates a secure checkout session
3. **User redirected to Stripe** → Secure payment page
4. **Payment processed** → Stripe handles the payment
5. **Webhook received** → Your app is notified of successful payment
6. **User redirected to success page** → Confirmation shown

## Testing

Use Stripe's test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date, any CVC, any ZIP

## Security Notes

- ✅ Secret keys are only used in server-side API routes
- ✅ Publishable keys are safe to expose in client-side code
- ✅ Webhook signature verification prevents unauthorized requests
- ✅ Clerk authentication ensures only signed-in users can purchase

