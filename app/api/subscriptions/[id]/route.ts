import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { cancelSubscription, enableSubscription } from '@/lib/paystack-subscriptions'

// GET - Get subscription details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const subscription = await prisma.subscription.findUnique({
            where: { id },
        })

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
        }

        return NextResponse.json(subscription)
    } catch (error) {
        console.error('Error fetching subscription:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        )
    }
}

// PATCH - Update subscription (pause/resume/cancel)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { action } = body // 'pause', 'resume', 'cancel'

        const subscription = await prisma.subscription.findUnique({
            where: { id },
        })

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
        }

        const metadata = JSON.parse(subscription.metadata || '{}')
        const emailToken = metadata.emailToken

        if (!subscription.paystackSubscriptionCode || !emailToken) {
            return NextResponse.json(
                { error: 'Missing Paystack subscription data' },
                { status: 400 }
            )
        }

        let newStatus = subscription.status

        if (action === 'cancel') {
            await cancelSubscription({
                subscriptionCode: subscription.paystackSubscriptionCode,
                emailToken,
            })
            newStatus = 'cancelled'
        } else if (action === 'pause') {
            await cancelSubscription({
                subscriptionCode: subscription.paystackSubscriptionCode,
                emailToken,
            })
            newStatus = 'paused'
        } else if (action === 'resume') {
            await enableSubscription({
                subscriptionCode: subscription.paystackSubscriptionCode,
                emailToken,
            })
            newStatus = 'active'
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        // Update subscription status
        const updatedSubscription = await prisma.subscription.update({
            where: { id },
            data: { status: newStatus },
        })

        return NextResponse.json(updatedSubscription)
    } catch (error) {
        console.error('Error updating subscription:', error)
        return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
        )
    }
}

// DELETE - Cancel subscription (same as PATCH with action='cancel')
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return PATCH(request, { params })
}
