import Paystack from 'paystack'

if (!process.env.PAYSTACK_SECRET_KEY) {
    console.warn('PAYSTACK_SECRET_KEY not configured. Payment processing will not work.')
}

// Initialize Paystack with the secret key
// Note: The 'paystack' package exports a function that takes the secret key
const paystackKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy_key_for_build'
const paystack = Paystack(paystackKey)

export interface PaymentData {
    amount: number
    email: string
    name?: string
    phone?: string
    reference: string
    callbackUrl: string
    metadata?: Record<string, any>
    currency?: string
}

/**
 * Initialize a Paystack transaction
 */
export async function initializePayment(data: PaymentData) {
    try {
        const response = await paystack.transaction.initialize({
            amount: Math.round(data.amount * 100), // Convert to kobo/cents
            email: data.email,
            reference: data.reference,
            callback_url: data.callbackUrl,
            currency: data.currency || 'KES', // Default to Kenyan Shilling
            metadata: {
                custom_fields: [
                    {
                        display_name: "Donor Name",
                        variable_name: "donor_name",
                        value: data.name
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: data.phone
                    }
                ],
                ...data.metadata
            },
            channels: ['card', 'mobile_money']
        })

        return response
    } catch (error) {
        console.error('Paystack initialization error:', error)
        throw error
    }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyTransaction(reference: string) {
    try {
        const response = await paystack.transaction.verify(reference)
        return response
    } catch (error) {
        console.error('Paystack verification error:', error)
        throw error
    }
}

/**
 * Verify webhook signature
 */
export function verifyWebhook(signature: string, payload: string): boolean {
    const crypto = require('crypto')
    const secret = process.env.PAYSTACK_SECRET_KEY || ''

    const hash = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex')

    return hash === signature
}

export { paystack }
