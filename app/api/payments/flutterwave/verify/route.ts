import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTransaction } from '@/lib/flutterwave'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const txRef = searchParams.get('tx_ref')
        const transactionId = searchParams.get('transaction_id')

        if (!txRef && !transactionId) {
            return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 })
        }

        // Verify with Flutterwave
        const verification = await verifyTransaction(transactionId || txRef!)

        if (verification.status === 'success' && verification.data.status === 'successful') {
            // Update donation status
            await prisma.donation.updateMany({
                where: { stripeSessionId: txRef || transactionId },
                data: {
                    paymentStatus: 'completed',
                    metadata: JSON.stringify({
                        transactionId: verification.data.id,
                        flutterwaveId: verification.data.flw_ref,
                        amount: verification.data.amount,
                        currency: verification.data.currency,
                        paymentType: verification.data.payment_type,
                    }),
                },
            })

            return NextResponse.json({
                status: 'successful',
                amount: verification.data.amount,
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
