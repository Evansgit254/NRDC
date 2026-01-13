'use client'

import { Heart, CreditCard, Building, Repeat, Gift, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DonationTier {
    id: string
    amount: number
    description: string
    isPopular: boolean
    order: number
}

interface DonationStat {
    id: string
    value: string
    label: string
    order: number
}

export default function DonatePage() {
    const [tiers, setTiers] = useState<DonationTier[]>([])
    const [stats, setStats] = useState<DonationStat[]>([])
    const [loading, setLoading] = useState(true)
    const [customAmount, setCustomAmount] = useState('')
    const [processingAmount, setProcessingAmount] = useState<number | null>(null)
    const [isRecurring, setIsRecurring] = useState(false)
    const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly')
    const [paymentMethod, setPaymentMethod] = useState<'mchanga' | 'bank_transfer'>('mchanga')
    const [bankDetails, setBankDetails] = useState<any>(null)
    const [showBankDetails, setShowBankDetails] = useState(false)

    const params = useParams()
    const locale = params.locale as string

    useEffect(() => {
        async function fetchData() {
            try {
                const localeQuery = locale ? `?locale=${locale}` : ''
                const [tiersRes, statsRes, bankRes] = await Promise.all([
                    fetch(`/api/donations/tiers${localeQuery}`),
                    fetch(`/api/donations/stats${localeQuery}`),
                    fetch('/api/settings/bank')
                ])

                if (tiersRes.ok) setTiers(await tiersRes.json())
                if (statsRes.ok) setStats(await statsRes.json())
                if (bankRes.ok) {
                    const data = await bankRes.json()
                    setBankDetails(data)
                }
            } catch (error) {
                console.error('Error fetching donation data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [locale])

    async function handleDonate(amount: number, tierId?: string) {
        if (processingAmount) return // Prevent double clicks

        setProcessingAmount(amount)

        try {
            // Check payment method
            if (paymentMethod === 'bank_transfer') {
                // Bank transfer donation
                const donorEmail = prompt('Please enter your email:') || ''
                const donorName = prompt('Please enter your name (optional):') || null
                const donorPhone = prompt('Please enter your phone number (optional):') || null

                if (!donorEmail) {
                    alert('Email is required for bank transfer donations')
                    setProcessingAmount(null)
                    return
                }

                const res = await fetch('/api/payments/bank-transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount,
                        donorEmail,
                        donorName,
                        donorPhone
                    }),
                })

                if (!res.ok) {
                    throw new Error('Failed to create bank transfer donation')
                }

                const { reference } = await res.json()

                // Redirect to bank transfer instructions page
                window.location.href = `/donate/bank-transfer?reference=${reference}`
            } else {
                // M-Changa payment (existing logic)
                const res = await fetch('/api/payments/mchanga/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount,
                        donorEmail: prompt('Please enter your email to proceed:') || '',
                        donorName: prompt('Please enter your name (optional):') || null,
                        donorPhone: prompt('Please enter your phone number (for payment):') || null,
                        tierId: tierId || null,
                    }),
                })

                if (!res.ok) {
                    throw new Error('Failed to create payment link')
                }

                const { link } = await res.json()

                // Redirect to M-Changa payment page
                window.location.href = link
            }
        } catch (error) {
            console.error('Payment error:', error)
            alert('Failed to process payment. Please try again.')
            setProcessingAmount(null)
        }
    }

    function handleCustomDonate() {
        const amount = parseFloat(customAmount)
        if (isNaN(amount) || amount < 1) {
            alert('Please enter a valid amount')
            return
        }
        handleDonate(amount)
    }

    return (
        <div className="pb-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#6E8C82] to-[#2E8B57] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Heart className="mx-auto mb-6 w-16 h-16 text-white/80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Make a Difference Today</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/90">
                        Your donation helps provide nutrition, healthcare, and hope to refugee and displaced communities around the world.
                    </p>
                </div>
            </section>

            {/* Donation Options */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Choose Your Impact</h2>
                <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                    Every contribution, no matter the size, makes a real difference in someone&apos;s life.
                </p>

                {/* Payment Method Selector */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Choose Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setPaymentMethod('mchanga')
                                setShowBankDetails(false)
                            }}
                            className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === 'mchanga'
                                ? 'border-[#2E8B57] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <CreditCard className={`mx-auto mb-3 w-10 h-10 ${paymentMethod === 'mchanga' ? 'text-[#2E8B57]' : 'text-gray-400'}`} />
                            <h4 className="font-bold text-lg mb-2">M-PESA / Mobile Money</h4>
                            <p className="text-sm text-gray-600">Pay instantly via M-PESA, Airtel Money, or card</p>
                        </button>

                        <button
                            onClick={() => {
                                setPaymentMethod('bank_transfer')
                                setShowBankDetails(true)
                            }}
                            className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === 'bank_transfer'
                                ? 'border-[#2E8B57] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Building className={`mx-auto mb-3 w-10 h-10 ${paymentMethod === 'bank_transfer' ? 'text-[#2E8B57]' : 'text-gray-400'}`} />
                            <h4 className="font-bold text-lg mb-2">Bank Transfer</h4>
                            <p className="text-sm text-gray-600">Direct bank deposit for larger donations</p>
                        </button>
                    </div>

                    {/* Bank Details Display */}
                    {showBankDetails && bankDetails && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-600" />
                                Bank Account Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Account Name:</p>
                                    <p className="font-semibold">{bankDetails.accountName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Account Number:</p>
                                    <p className="font-semibold">{bankDetails.accountNumber}</p>
                                </div>
                                {bankDetails.bankName && (
                                    <div>
                                        <p className="text-gray-600">Bank:</p>
                                        <p className="font-semibold">{bankDetails.bankName}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-gray-600">Branch:</p>
                                    <p className="font-semibold">{bankDetails.branch}</p>
                                </div>
                                {bankDetails.swiftCode && (
                                    <div>
                                        <p className="text-gray-600">Swift Code:</p>
                                        <p className="font-semibold">{bankDetails.swiftCode}</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                💡 After donating through bank transfer, you&apos;ll receive instructions to email proof of payment for verification.
                            </p>
                        </div>
                    )}
                </div>

                {/* Recurring Donation Toggle Removed as it was Paystack-dependent */}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E8C82] mx-auto"></div>
                    </div>
                ) : tiers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {tiers.map((option) => (
                            <div
                                key={option.id}
                                className={`relative bg-white rounded-2xl shadow-lg border-2 p-6 transition-all hover:shadow-xl hover:scale-105 ${option.isPopular ? 'border-[#2E8B57]' : 'border-gray-100'
                                    }`}
                            >
                                {option.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E8B57] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#6E8C82] mb-2">
                                        KES {option.amount}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {option.description}
                                    </p>
                                    <button
                                        onClick={() => handleDonate(option.amount, option.id)}
                                        disabled={processingAmount !== null}
                                        className={`w-full bg-[#6E8C82] hover:bg-[#587068] text-white py-3 rounded-lg font-semibold transition-colors ${processingAmount === option.amount ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {processingAmount === option.amount ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            `Donate KES ${option.amount}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No donation tiers available at the moment.</p>
                    </div>
                )}

                {/* Custom Amount */}
                <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Custom Amount</h3>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">KES</span>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full pl-16 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none text-xl"
                                    min="1"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleCustomDonate}
                            disabled={processingAmount !== null}
                            className={`bg-[#2E8B57] hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap ${processingAmount !== null ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {processingAmount && parseFloat(customAmount) === processingAmount ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Donate Now'
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Ways to Give</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <CreditCard className="mx-auto mb-4 w-12 h-12 text-[#6E8C82]" />
                            <h3 className="font-bold text-lg mb-2">Credit/Debit Card</h3>
                            <p className="text-gray-600 text-sm">Secure online payment via M-PESA and Mobile Money</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <Building className="mx-auto mb-4 w-12 h-12 text-[#6E8C82]" />
                            <h3 className="font-bold text-lg mb-2">Bank Transfer</h3>
                            <p className="text-gray-600 text-sm">Direct bank transfer for larger donations</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <Gift className="mx-auto mb-4 w-12 h-12 text-[#6E8C82]" />
                            <h3 className="font-bold text-lg mb-2">Support Our Programs</h3>
                            <p className="text-gray-600 text-sm">Your contribution directly funds our primary initiatives</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Your Donation at Work</h2>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E8C82] mx-auto"></div>
                        </div>
                    ) : stats.length > 0 ? (
                        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 text-center`}>
                            {stats.map((stat) => (
                                <div key={stat.id}>
                                    <div className="text-4xl font-bold text-[#2E8B57] mb-2">{stat.value}</div>
                                    <p className="text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-[#2E8B57] mb-2">95%</div>
                                <p className="text-gray-600">Goes directly to programs</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#2E8B57] mb-2">50K+</div>
                                <p className="text-gray-600">People helped annually</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#2E8B57] mb-2">12</div>
                                <p className="text-gray-600">Countries reached</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#2E8B57] mb-2">100%</div>
                                <p className="text-gray-600">Transparency guaranteed</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="bg-[#6E8C82] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={24} />
                            <span>Tax Deductible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={24} />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={24} />
                            <span>Certified Non-Profit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={24} />
                            <span>Instant Receipt</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Ways */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Gift className="mx-auto mb-4 w-12 h-12 text-[#2E8B57]" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Help</h2>
                    <p className="text-gray-600 mb-8">
                        Can&apos;t donate right now? There are other meaningful ways to support our mission.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/get-involved"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Volunteer Your Time
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Become a Partner
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
