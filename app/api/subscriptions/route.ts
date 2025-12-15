import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getOrCreatePlan, createSubscription } from '@/lib/paystack-subscriptions'

// GET - Fetch all subscriptions (Admin only)
export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        const where: any = {}
        if (status) where.status = status

        const subscriptions = await prisma.subscription.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        // Calculate metrics
        const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
        const monthlyRevenue = activeSubscriptions
            .filter(s => s.frequency === 'monthly')
            .reduce((sum, s) => sum + s.amount, 0)

        const yearlyRevenue = activeSubscriptions
            .filter(s => s.frequency === 'yearly')
            .reduce((sum, s) => sum + (s.amount / 12), 0) // Convert to monthly equivalent

        const mrr = monthlyRevenue + yearlyRevenue // Monthly Recurring Revenue

        return NextResponse.json({
            subscriptions,
            metrics: {
                total: subscriptions.length,
                active: activeSubscriptions.length,
                paused: subscriptions.filter(s => s.status === 'paused').length,
                cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
                mrr: Math.round(mrr * 100) / 100,
            },
        })
    } catch (error) {
        console.error('Error fetching subscriptions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subscriptions' },
            { status: 500 }
        )
    }
}

// POST - Create new subscription
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { amount, frequency, donorEmail, donorName, donorPhone } = body

        if (!amount || !frequency || !donorEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (!['monthly', 'yearly'].includes(frequency)) {
            return NextResponse.json(
                { error: 'Invalid frequency' },
                { status: 400 }
            )
        }

        // Get or create Paystack plan
        const planCode = await getOrCreatePlan(amount, frequency)

        // Create subscription on Paystack
        const paystackResponse = await createSubscription({
            customerEmail: donorEmail,
            planCode,
        })

        if (!paystackResponse.status || !paystackResponse.data) {
            throw new Error('Failed to create Paystack subscription')
        }

        // Calculate next charge date
        const nextChargeDate = new Date()
        if (frequency === 'monthly') {
            nextChargeDate.setMonth(nextChargeDate.getMonth() + 1)
        } else {
            nextChargeDate.setFullYear(nextChargeDate.getFullYear() + 1)
        }

        // Create subscription record
        const subscription = await prisma.subscription.create({
            data: {
                donorEmail,
                donorName,
                donorPhone,
                amount,
                currency: 'KES',
                frequency,
                status: 'active',
                nextChargeDate,
                paystackPlanCode: planCode,
                paystackSubscriptionCode: paystackResponse.data.subscription_code,
                paystackCustomerCode: paystackResponse.data.customer,
                metadata: JSON.stringify({
                    emailToken: paystackResponse.data.email_token,
                }),
            },
        })

        return NextResponse.json({
            subscription,
            authorizationUrl: paystackResponse.data.authorization?.authorization_url,
        })
    } catch (error) {
        console.error('Error creating subscription:', error)
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        )
    }
}
