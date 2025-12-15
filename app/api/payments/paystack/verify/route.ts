import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTransaction } from '@/lib/paystack'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference') || searchParams.get('trxref')

        if (!reference) {
            return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 })
        }

        // Verify with Paystack
        const verification = await verifyTransaction(reference)

        if (verification.status && verification.data.status === 'success') {
            // Update donation status
            await prisma.donation.updateMany({
                where: { stripeSessionId: reference },
                data: {
                    paymentStatus: 'completed',
                    metadata: JSON.stringify({
                        transactionId: verification.data.id,
                        paystackId: verification.data.id,
                        amount: verification.data.amount / 100,
                        currency: verification.data.currency,
                        channel: verification.data.channel,
                        authorization: verification.data.authorization
                    }),
                },
            })

            return NextResponse.json({
                status: 'successful',
                amount: verification.data.amount / 100,
                currency: verification.data.currency,
            })
        }

        return NextResponse.json({
            status: 'failed',
            message: 'Payment not successful',
        })
    } catch (error) {
        console.error('Verification error:', error)
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        )
    }
}
