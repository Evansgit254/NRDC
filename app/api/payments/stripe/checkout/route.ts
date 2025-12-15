import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: Request) {
    try {
        const { amount, donorEmail, donorName, donorPhone, tierId } = await request.json()

        // Validate amount
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }

        if (!donorEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Get the app URL from environment
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

        // Create Stripe checkout session
        const session = await createCheckoutSession({
            amount,
            donorEmail,
            donorName,
            successUrl: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${appUrl}/donate/cancel`,
            metadata: {
                tierId: tierId || '',
                donorPhone: donorPhone || '',
            },
        })

        // Create pending donation record
        const donation = await prisma.donation.create({
            data: {
                amount,
                currency: 'USD',
                donorEmail,
                donorName: donorName || null,
                donorPhone: donorPhone || null,
                paymentMethod: 'stripe',
                paymentStatus: 'pending',
                stripeSessionId: session.id,
                metadata: JSON.stringify({
                    tierId,
                    sessionUrl: session.url,
                }),
            },
        })

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            donationId: donation.id,
        })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
