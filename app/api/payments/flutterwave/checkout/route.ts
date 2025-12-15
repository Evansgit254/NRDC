import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentLink } from '@/lib/flutterwave'

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

        // Generate unique transaction reference
        const txRef = `NRDC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Get the app URL from environment
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

        // Create Flutterwave payment link
        const payment = await getPaymentLink({
            txRef,
            amount,
            email: donorEmail,
            name: donorName,
            phone: donorPhone,
            redirectUrl: `${appUrl}/donate/verify?tx_ref=${txRef}`,
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
                paymentMethod: 'flutterwave',
                paymentStatus: 'pending',
                stripeSessionId: txRef, // Reusing field for transaction reference
                metadata: JSON.stringify({
                    tierId,
                    paymentLink: payment.link,
                    txRef,
                }),
            },
        })

        return NextResponse.json({
            txRef,
            link: payment.link,
            donationId: donation.id,
        })
    } catch (error) {
        console.error('Flutterwave checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create payment link' },
            { status: 500 }
        )
    }
}
