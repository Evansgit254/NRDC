import Flutterwave from 'flutterwave-node-v3'

const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-dummy'
const secretKey = process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-dummy'

if (!process.env.FLUTTERWAVE_PUBLIC_KEY || !process.env.FLUTTERWAVE_SECRET_KEY) {
    console.warn('FLUTTERWAVE keys not configured. Payment processing will not work.')
}

const flw = new Flutterwave(publicKey, secretKey)

export interface PaymentData {
    amount: number
    currency?: string
    email: string
    name?: string
    phone?: string
    txRef: string
    redirectUrl: string
    metadata?: Record<string, any>
}

/**
 * Initialize a Flutterwave payment
 */
export async function initializePayment(data: PaymentData) {
    try {
        const payload = {
            tx_ref: data.txRef,
            amount: data.amount,
            currency: data.currency || 'USD',
            redirect_url: data.redirectUrl,
            payment_options: 'card,mobilemoney,ussd,banktransfer',
            customer: {
                email: data.email,
                name: data.name || data.email,
                phonenumber: data.phone || '',
            },
            customizations: {
                title: 'NRDC Donation',
                description: 'Support nutrition and health programs for refugees',
                logo: process.env.NEXT_PUBLIC_APP_URL + '/images/nrdc-logo-v3.png',
            },
            meta: data.metadata || {},
        }

        const response = await flw.Charge.card(payload as any)
        return response
    } catch (error) {
        console.error('Flutterwave initialization error:', error)
        throw error
    }
}

/**
 * Verify a Flutterwave transaction
 */
export async function verifyTransaction(transactionId: string) {
    try {
        const response = await flw.Transaction.verify({ id: transactionId })
        return response
    } catch (error) {
        console.error('Flutterwave verification error:', error)
        throw error
    }
}

/**
 * Verify webhook signature
 */
export function verifyWebhook(signature: string, payload: string): boolean {
    const crypto = require('crypto')
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || ''

    const hash = crypto
        .createHmac('sha256', secretHash)
        .update(payload)
        .digest('hex')

    return hash === signature
}

/**
 * Get payment link for standard checkout
 */
export async function getPaymentLink(data: PaymentData) {
    try {
        const payload = {
            tx_ref: data.txRef,
            amount: data.amount.toString(),
            currency: data.currency || 'USD',
            redirect_url: data.redirectUrl,
            payment_options: 'card,mpesa,mobilemoney,ussd,banktransfer',
            customer: {
                email: data.email,
                name: data.name || data.email,
                phonenumber: data.phone || '',
            },
            customizations: {
                title: 'NRDC Donation',
                description: 'Support nutrition and health programs',
                logo: process.env.NEXT_PUBLIC_APP_URL + '/images/nrdc-logo-v3.png',
            },
            meta: data.metadata || {},
        }

        const response = await flw.PaymentLink.create(payload as any)

        if (response.status === 'success') {
            return {
                link: response.data.link,
                reference: data.txRef,
            }
        }

        throw new Error('Failed to create payment link')
    } catch (error) {
        console.error('Flutterwave payment link error:', error)
        throw error
    }
}

export { flw }
