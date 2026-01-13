'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle, Mail, Copy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/components/Toast'

export default function BankTransferPage() {
    const searchParams = useSearchParams()
    const { showToast } = useToast()
    const reference = searchParams.get('reference')
    const [copied, setCopied] = useState(false)

    const copyReference = () => {
        if (reference) {
            navigator.clipboard.writeText(reference)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="pb-16">
            {/* Header */}
            <section className="bg-gradient-to-br from-[#6E8C82] to-[#2E8B57] text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <CheckCircle className="mx-auto mb-6 w-20 h-20 text-white" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Donation Initiated Successfully!</h1>
                    <p className="text-xl text-white/90">
                        Thank you for choosing to support NRDC through bank transfer.
                    </p>
                </div>
            </section>

            {/* Instructions */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>

                    <div className="space-y-6">
                        {/* Reference Number */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Your Reference Number
                            </h3>
                            <div className="flex items-center gap-3 mt-4">
                                <code className="flex-1 bg-white px-4 py-3 rounded-lg border border-blue-300 font-mono text-lg">
                                    {reference || 'N/A'}
                                </code>
                                <button
                                    onClick={copyReference}
                                    className="bg-[#2E8B57] hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Copy size={20} />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                                💡 Save this reference number for your records. You&apos;ll need it when sending proof of payment.
                            </p>
                        </div>

                        {/* Make Payment */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <span className="bg-[#2E8B57] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Make Your Bank Transfer
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Transfer your donation amount to the following bank account:
                            </p>
                            <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Name:</span>
                                    <span className="font-semibold">NRDC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Number:</span>
                                    <span className="font-semibold">01207150002</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-semibold">ABC Bank</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Branch:</span>
                                    <span className="font-semibold">Nairobi</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Swift Code:</span>
                                    <span className="font-semibold">AFRIKENX</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                                ⏱ Please include your reference number in the payment narration/description.
                            </p>
                        </div>

                        {/* Send Proof */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <span className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                Send Proof of Payment
                            </h3>
                            <p className="text-gray-700 mb-4">
                                After completing your transfer, please email proof of payment to:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={`mailto:donations@nrdc.org?subject=${encodeURIComponent(`Bank Transfer Donation - ${reference}`)}&body=${encodeURIComponent(`Please find attached proof of payment for my donation.\n\nReference: ${reference}`)}`}
                                    className="inline-flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    <Mail size={20} />
                                    Email Proof of Payment
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('donations@nrdc.org')
                                        showToast?.('Email address copied to clipboard', 'success')
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    <Copy size={20} />
                                    Copy Email Address
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                📎 Include: Bank receipt/confirmation, your reference number ({reference})
                            </p>
                        </div>

                        {/* Verification Timeline */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-3">⏰ What Happens Next?</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={20} className="text-[#2E8B57] mt-0.5 flex-shrink-0" />
                                    <span>Our team will verify your payment within 1-2 business days</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={20} className="text-[#2E8B57] mt-0.5 flex-shrink-0" />
                                    <span>You&apos;ll receive a confirmation email once verified</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={20} className="text-[#2E8B57] mt-0.5 flex-shrink-0" />
                                    <span>An official donation receipt will be sent for your records</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Return to Home
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                            href="/contact"
                            className="text-[#2E8B57] hover:text-green-700 transition-colors"
                        >
                            Need Help?
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
