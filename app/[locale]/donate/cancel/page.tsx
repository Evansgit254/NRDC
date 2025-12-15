'use client'

import Link from 'next/link'
import { XCircle, Home, Heart, ArrowLeft } from 'lucide-react'

export default function DonateCancelPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Cancel Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-orange-100 p-4 rounded-full">
                            <XCircle className="w-16 h-16 text-orange-600" />
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                        Donation Cancelled
                    </h1>
                    <p className="text-lg text-gray-600 text-center mb-8">
                        Your donation was not completed. No charges have been made to your account.
                    </p>

                    {/* Info Box */}
                    <div className="bg-[#6E8C82]/10 border border-[#6E8C82]/30 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-2">Why might donations fail?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Payment was cancelled by you</li>
                            <li>• Technical issues during payment processing</li>
                            <li>• Payment method declined</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link
                            href="/donate"
                            className="flex-1 bg-[#2E8B57] hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <Heart size={20} />
                            Try Again
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Return Home
                        </Link>
                    </div>

                    {/* Help Section */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">Need help or have questions?</p>
                        <Link
                            href="/contact"
                            className="text-[#6E8C82] hover:underline font-medium"
                        >
                            Contact our support team
                        </Link>
                    </div>
                </div>

                {/* Alternative Ways to Help */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Other Ways to Help</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/get-involved"
                            className="p-4 border border-gray-200 rounded-lg hover:border-[#6E8C82] hover:bg-[#6E8C82]/10 transition-all text-center"
                        >
                            <h4 className="font-semibold text-gray-900 mb-1">Volunteer</h4>
                            <p className="text-sm text-gray-600">Share your time and skills</p>
                        </Link>
                        <Link
                            href="/contact"
                            className="p-4 border border-gray-200 rounded-lg hover:border-[#6E8C82] hover:bg-[#6E8C82]/10 transition-all text-center"
                        >
                            <h4 className="font-semibold text-gray-900 mb-1">Partner With Us</h4>
                            <p className="text-sm text-gray-600">Corporate partnerships</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
