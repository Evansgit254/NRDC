import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const signature = (await headers()).get('stripe-signature')

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 })
        }

        // Verify webhook signature
        const event = verifyWebhookSignature(body, signature)

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session

                // Update donation status
                await prisma.donation.updateMany({
                    where: { stripeSessionId: session.id },
                    data: {
                        paymentStatus: 'completed',
                        metadata: JSON.stringify({
                            ...JSON.parse(await prisma.donation.findFirst({
                                where: { stripeSessionId: session.id },
                                select: { metadata: true }
                            }).then(d => d?.metadata || '{}') as string),
                            paymentIntentId: session.payment_intent,
                            amountTotal: session.amount_total,
                            customerEmail: session.customer_email,
                        }),
                    },
                })

                console.log(`✅ Payment completed for session: ${session.id}`)
                break
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session

                // Update donation status to failed
                await prisma.donation.updateMany({
                    where: { stripeSessionId: session.id },
                    data: { paymentStatus: 'failed' },
                })

                console.log(`❌ Payment session expired: ${session.id}`)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook handler failed' },
            { status: 400 }
        )
    }
}
