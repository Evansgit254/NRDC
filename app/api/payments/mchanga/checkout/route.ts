import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/mchanga'

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
        const reference = `NRDC-MC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Get the app URL from environment
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        // Initialize M-Changa payment
        const response = await initializePayment({
            reference,
            amount,
            email: donorEmail,
            name: donorName,
            phone: donorPhone,
            callbackUrl: `${appUrl}/donate/verify`,
            currency: 'KES',
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
                paymentMethod: 'mchanga',
                paymentStatus: 'pending',
                mchangaCheckoutId: reference,
                reference: reference, // Save reference to generic field
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
        console.error('M-Changa checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create payment link' },
            { status: 500 }
        )
    }
}
