import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { amount, donorEmail, donorName, donorPhone } = await request.json()

        // Validate amount
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }

        if (!donorEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Generate unique reference
        const reference = `NRDC-BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Create pending donation record
        const donation = await prisma.donation.create({
            data: {
                amount,
                currency: 'KES',
                donorEmail,
                donorName: donorName || null,
                donorPhone: donorPhone || null,
                paymentMethod: 'bank_transfer',
                paymentStatus: 'pending',
                reference: reference,
                bankTransferReference: reference,
                metadata: JSON.stringify({
                    instructions: 'Please email proof of payment to verify your donation'
                }),
            },
        })

        return NextResponse.json({
            reference,
            donationId: donation.id,
        })
    } catch (error) {
        console.error('Bank transfer donation error:', error)
        return NextResponse.json(
            { error: 'Failed to create donation record' },
            { status: 500 }
        )
    }
}
