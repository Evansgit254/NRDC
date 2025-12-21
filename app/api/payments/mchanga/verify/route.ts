import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTransaction } from '@/lib/mchanga'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference')

        if (!reference) {
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
        }

        // Verify with M-Changa
        const verification = await verifyTransaction(reference)

        if (verification.status) {
            // Update donation record
            await prisma.donation.update({
                where: { reference },
                data: {
                    paymentStatus: 'completed',
                    updatedAt: new Date(),
                }
            })

            return NextResponse.json({ status: 'successful', message: 'Payment verified' })
        } else {
            // Update as failed
            await prisma.donation.update({
                where: { reference },
                data: {
                    paymentStatus: 'failed',
                    updatedAt: new Date(),
                }
            })
            return NextResponse.json({ status: 'failed', message: 'Payment verification failed' }, { status: 400 })
        }
    } catch (error) {
        console.error('M-Changa verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
