import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/paystack'

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
        const reference = `NRDC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Get the app URL from environment
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

        // Initialize Paystack payment
        const response = await initializePayment({
            reference,
            amount,
            email: donorEmail,
            name: donorName,
            phone: donorPhone,
            callbackUrl: `${appUrl}/donate/verify`,
            currency: 'KES', // Use KES for Kenya
            metadata: {
                tierId: tierId || '',
                donorPhone: donorPhone || '',
            },
        })

        if (!response.status) {
            throw new Error(response.message)
        }

        // Create pending donation record
        const donation = await prisma.donation.create({
            data: {
                amount,
                currency: 'KES',
                donorEmail,
                donorName: donorName || null,
                donorPhone: donorPhone || null,
                paymentMethod: 'paystack',
                paymentStatus: 'pending',
                stripeSessionId: reference, // Reusing field for transaction reference
                metadata: JSON.stringify({
                    tierId,
                    authorizationUrl: response.data.authorization_url,
                    reference,
                    accessCode: response.data.access_code
                }),
            },
        })

        return NextResponse.json({
            reference,
            link: response.data.authorization_url,
            donationId: donation.id,
        })
    } catch (error) {
        console.error('Paystack checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create payment link' },
            { status: 500 }
        )
    }
}
