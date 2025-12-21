'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function VerifyPaymentPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
    const [message, setMessage] = useState('Verifying your payment...')
    const reference = searchParams?.get('reference')

    useEffect(() => {
        async function verifyPayment() {
            if (!reference) {
                setStatus('failed')
                setMessage('Invalid payment reference')
                setTimeout(() => router.push('/donate'), 3000)
                return
            }

            try {
                // Update donation status based on transaction
                const response = await fetch(`/api/payments/mchanga/verify?reference=${reference}`)

                if (response.ok) {
                    const data = await response.json()

                    if (data.status === 'successful') {
                        setStatus('success')
                        setMessage('Payment successful!')
                        setTimeout(() => router.push(`/donate/success?reference=${reference}`), 2000)
                    } else {
                        setStatus('failed')
                        setMessage('Payment verification failed')
                        setTimeout(() => router.push('/donate/cancel'), 3000)
                    }
                } else {
                    setStatus('failed')
                    setMessage('Could not verify payment')
                    setTimeout(() => router.push('/donate/cancel'), 3000)
                }
            } catch (error) {
                console.error('Verification error:', error)
                setStatus('failed')
                setMessage('An error occurred')
                setTimeout(() => router.push('/donate/cancel'), 3000)
            }
        }

        verifyPayment()
    }, [reference, router])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <>
                        <Loader className="w-16 h-16 text-[#6E8C82] mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">Redirecting...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}
            </div>
        </div>
    )
}
