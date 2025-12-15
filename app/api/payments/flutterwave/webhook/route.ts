import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyWebhook } from '@/lib/flutterwave'

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const signature = (await headers()).get('verif-hash')

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 })
        }

        // Verify webhook signature
        const isValid = verifyWebhook(signature, body)

        if (!isValid) {
            console.error('Invalid webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const event = JSON.parse(body)

        // Handle successful payment
        if (event.event === 'charge.completed' && event.data.status === 'successful') {
            const txRef = event.data.tx_ref

            // Update donation status
            await prisma.donation.updateMany({
                where: { stripeSessionId: txRef }, // Using stripeSessionId field for txRef
                data: {
                    paymentStatus: 'completed',
                    metadata: JSON.stringify({
                        ...JSON.parse(await prisma.donation.findFirst({
                            where: { stripeSessionId: txRef },
                            select: { metadata: true }
                        }).then(d => d?.metadata || '{}') as string),
                        transactionId: event.data.id,
                        flutterwaveId: event.data.flw_ref,
                        amountCharged: event.data.charged_amount,
                        currency: event.data.currency,
                    }),
                },
            })

            console.log(`✅ Payment completed for txRef: ${txRef}`)
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
