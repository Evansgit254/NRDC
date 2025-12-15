import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyWebhook } from '@/lib/paystack'
import { sendDonationReceipt, sendDonationAlertToAdmin } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const signature = (await headers()).get('x-paystack-signature')

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
        if (event.event === 'charge.success') {
            const reference = event.data.reference

            // Update donation status
            const donation = await prisma.donation.findFirst({
                where: { stripeSessionId: reference }
            })

            if (donation) {
                await prisma.donation.updateMany({
                    where: { stripeSessionId: reference },
                    data: {
                        paymentStatus: 'completed',
                        metadata: JSON.stringify({
                            ...JSON.parse(donation.metadata || '{}'),
                            transactionId: event.data.id,
                            paystackId: event.data.id,
                            amountCharged: event.data.amount / 100,
                            currency: event.data.currency,
                            channel: event.data.channel,
                            authorization: event.data.authorization
                        }),
                    },
                })

                // Send email notifications
                try {
                    // Send receipt to donor
                    await sendDonationReceipt({
                        donorEmail: donation.donorEmail,
                        donorName: donation.donorName || 'Friend',
                        amount: donation.amount,
                        currency: donation.currency,
                        transactionId: reference,
                        date: new Date(),
                        paymentMethod: donation.paymentMethod,
                    })

                    // Send alert to admin
                    await sendDonationAlertToAdmin({
                        donorEmail: donation.donorEmail,
                        donorName: donation.donorName || 'Anonymous',
                        amount: donation.amount,
                        currency: donation.currency,
                        transactionId: reference,
                        paymentMethod: donation.paymentMethod,
                    })

                    console.log(`✅ Payment completed and emails sent for: ${reference}`)
                } catch (emailError) {
                    console.error('Email sending failed:', emailError)
                    // Don't fail the webhook if email fails
                }
            }
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
