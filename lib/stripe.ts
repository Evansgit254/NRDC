import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is not defined in environment variables. Stripe features will not work.')
}

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-11-17.clover',
})

/**
 * Create a Stripe Checkout Session for a donation
 */
export async function createCheckoutSession({
    amount,
    donorEmail,
    donorName,
    successUrl,
    cancelUrl,
    metadata = {},
}: {
    amount: number
    donorEmail?: string
    donorName?: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
}) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation to NRDC',
                        description: 'Support nutrition and health programs for refugees and displaced communities',
                    },
                    unit_amount: Math.round(amount * 100), // Convert to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: donorEmail,
        metadata: {
            ...metadata,
            donorName: donorName || '',
        },
    })

    return session
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
    }

    try {
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err) {
        throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string) {
    return await stripe.checkout.sessions.retrieve(sessionId)
}

/**
 * Create a refund for a payment
 */
export async function createRefund(paymentIntentId: string, amount?: number) {
    return await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
    })
}
