import { paystack } from './paystack'

export interface SubscriptionPlanParams {
    name: string
    amount: number // In smallest currency unit (kobo for NGN, cents for USD)
    interval: 'monthly' | 'yearly'
    currency?: string
}

export interface CreateSubscriptionParams {
    customerEmail: string
    planCode: string
    startDate?: Date
}

/**
 * Create a subscription plan on Paystack
 */
export async function createSubscriptionPlan(params: SubscriptionPlanParams) {
    try {
        const response = await paystack.plan.create({
            name: params.name,
            amount: params.amount,
            interval: params.interval,
            currency: params.currency || 'KES',
        })

        return response
    } catch (error) {
        console.error('Error creating subscription plan:', error)
        throw error
    }
}

/**
 * Subscribe a customer to a plan
 */
export async function createSubscription(params: CreateSubscriptionParams) {
    try {
        const response = await paystack.subscription.create({
            customer: params.customerEmail,
            plan: params.planCode,
            start_date: params.startDate,
        })

        return response
    } catch (error) {
        console.error('Error creating subscription:', error)
        throw error
    }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionCode: string) {
    try {
        const response = await paystack.subscription.get(subscriptionCode)
        return response
    } catch (error) {
        console.error('Error fetching subscription:', error)
        throw error
    }
}

/**
 * Disable/cancel a subscription
 */
export async function cancelSubscription(params: {
    subscriptionCode: string
    emailToken: string
}) {
    try {
        const response = await paystack.subscription.disable({
            code: params.subscriptionCode,
            token: params.emailToken,
        })

        return response
    } catch (error) {
        console.error('Error canceling subscription:', error)
        throw error
    }
}

/**
 * Enable a subscription
 */
export async function enableSubscription(params: {
    subscriptionCode: string
    emailToken: string
}) {
    try {
        const response = await paystack.subscription.enable({
            code: params.subscriptionCode,
            token: params.emailToken,
        })

        return response
    } catch (error) {
        console.error('Error enabling subscription:', error)
        throw error
    }
}

/**
 * Get or create plan code for a specific amount and frequency
 */
export async function getOrCreatePlan(amount: number, frequency: 'monthly' | 'yearly') {
    const planName = `NRDC ${frequency} $${amount}`
    const amountInKobo = Math.round(amount * 100)

    try {
        // Try to create the plan
        const response = await createSubscriptionPlan({
            name: planName,
            amount: amountInKobo,
            interval: frequency,
            currency: 'KES',
        })

        if (response.status && response.data) {
            return response.data.plan_code
        }

        throw new Error('Failed to create plan')
    } catch (error: any) {
        // If plan already exists, Paystack might return the existing one
        // In production, you'd want to list plans and find the matching one
        console.error('Plan creation error:', error)
        throw error
    }
}
