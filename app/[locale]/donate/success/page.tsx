'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Share2, Heart } from 'lucide-react'

export default function DonateSuccessPage() {
    const searchParams = useSearchParams()
    const amount = searchParams?.get('amount')
    const currency = searchParams?.get('currency')
    const sessionId = searchParams?.get('session_id')
    const txnId = searchParams?.get('txn_id') || sessionId

    const [loading, setLoading] = useState(true)
    const [donation, setDonation] = useState<any>(null)

    useEffect(() => {
        if (amount && currency) {
            setDonation({ amount: parseFloat(amount), currency, id: txnId })
            setLoading(false)
        } else if (sessionId) {
            // Fallback for legacy or direct visits
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            setLoading(false)
        }
    }, [sessionId, amount, currency, txnId])

    const handleShare = async () => {
        const shareData = {
            title: 'I just donated to NRDC!',
            text: 'I just supported NRDC in their mission to help refugees and displaced communities. Join me in making a difference!',
            url: window.location.origin + '/donate',
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(shareData.url)
                alert('Donation link copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E8B57]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                        Thank You for Your Generosity!
                    </h1>
                    <p className="text-lg text-gray-600 text-center mb-8">
                        Your donation will help provide nutrition, healthcare, and hope to refugee and displaced communities around the world.
                    </p>

                    {/* Donation Details */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Donation Amount:</span>
                            <span className="text-2xl font-bold text-[#2E8B57]">
                                {donation ? `${donation.currency} ${donation.amount.toLocaleString()}` : 'Processing...'}
                            </span>
                        </div>
                        {txnId && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Transaction ID:</span>
                                <span className="text-gray-700 font-mono text-xs">{txnId.substring(0, 20)}...</span>
                            </div>
                        )}
                    </div>

                    {/* What Happens Next */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600">You&apos;ll receive an email confirmation with your donation receipt</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600">Your contribution will be put to work immediately helping those in need</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600">You&apos;ll receive updates on the impact your donation is making</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/donate"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <Heart size={20} />
                            Donate Again
                        </Link>
                    </div>

                    {/* Social Sharing */}
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600 mb-4">Help us reach more people</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Share2 size={20} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Impact Message */}
                <div className="mt-8 bg-gradient-to-r from-[#6E8C82] to-[#2E8B57] rounded-2xl p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Every Dollar Counts</h3>
                    <p className="text-white/90">
                        95% of all donations go directly to our programs helping refugees and displaced communities.
                    </p>
                </div>
            </div>
        </div>
    )
}
