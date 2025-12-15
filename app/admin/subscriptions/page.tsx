'use client'

import { useEffect, useState } from 'react'
import { Repeat, TrendingUp, Users, DollarSign, Pause, Play, X, Calendar } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface Subscription {
    id: string
    donorEmail: string
    donorName: string | null
    donorPhone: string | null
    amount: number
    currency: string
    frequency: string
    status: string
    nextChargeDate: string
    createdAt: string
    updatedAt: string
}

interface Metrics {
    total: number
    active: number
    paused: number
    cancelled: number
    mrr: number
}

export default function AdminSubscriptionsPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [metrics, setMetrics] = useState<Metrics>({
        total: 0,
        active: 0,
        paused: 0,
        cancelled: 0,
        mrr: 0,
    })
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('')

    useEffect(() => {
        fetchSubscriptions()
    }, [statusFilter])

    async function fetchSubscriptions() {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)

            const res = await fetch(`/api/subscriptions?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setSubscriptions(data.subscriptions)
                setMetrics(data.metrics)
            } else {
                showToast('Failed to load subscriptions', 'error')
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error)
            showToast('Failed to load subscriptions', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleAction(id: string, action: 'pause' | 'resume' | 'cancel') {
        const confirmMessages = {
            pause: 'Are you sure you want to pause this subscription?',
            resume: 'Are you sure you want to resume this subscription?',
            cancel: 'Are you sure you want to cancel this subscription? This cannot be undone.',
        }

        if (!await confirm(confirmMessages[action])) return

        try {
            const res = await fetch(`/api/subscriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            })

            if (res.ok) {
                showToast(`Subscription ${action}d successfully`, 'success')
                fetchSubscriptions()
            } else {
                showToast(`Failed to ${action} subscription`, 'error')
            }
        } catch (error) {
            console.error(`Error ${action}ing subscription:`, error)
            showToast(`Failed to ${action} subscription`, 'error')
        }
    }

    function formatCurrency(amount: number, currency: string) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'KES',
        }).format(amount)
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'paused':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    function getFrequencyBadge(frequency: string) {
        return frequency === 'monthly' ? (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#6E8C82]/20 text-blue-800">
                Monthly
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Yearly
            </span>
        )
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Recurring Donations</h1>
                <p className="text-gray-600 mt-1">Manage subscription donors and track recurring revenue</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.total}</p>
                        </div>
                        <Repeat className="w-10 h-10 text-gray-400" />
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Active</p>
                            <p className="text-3xl font-bold text-green-700 mt-2">{metrics.active}</p>
                        </div>
                        <Users className="w-10 h-10 text-green-400" />
                    </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600">Paused</p>
                            <p className="text-3xl font-bold text-yellow-700 mt-2">{metrics.paused}</p>
                        </div>
                        <Pause className="w-10 h-10 text-yellow-400" />
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-3xl font-bold text-gray-700 mt-2">{metrics.cancelled}</p>
                        </div>
                        <X className="w-10 h-10 text-gray-400" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#6E8C82] to-[#2E8B57] p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/90">MRR</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {formatCurrency(metrics.mrr, 'KES')}
                            </p>
                            <p className="text-xs text-white/75 mt-1">Monthly Recurring Revenue</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-white/80" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {statusFilter && (
                        <button
                            onClick={() => setStatusFilter('')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Subscriptions Table */}
            {subscriptions.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <Repeat size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Subscriptions Yet
                    </h3>
                    <p className="text-gray-500">
                        Recurring donations will appear here once donors set them up.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Donor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Frequency
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Next Charge
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Started
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {sub.donorName || 'Anonymous'}
                                            </div>
                                            <div className="text-sm text-gray-500">{sub.donorEmail}</div>
                                            {sub.donorPhone && (
                                                <div className="text-xs text-gray-400">{sub.donorPhone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {formatCurrency(sub.amount, sub.currency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getFrequencyBadge(sub.frequency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    sub.status
                                                )}`}
                                            >
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(sub.nextChargeDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(sub.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {sub.status === 'active' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(sub.id, 'pause')}
                                                        className="text-yellow-600 hover:text-yellow-800 font-medium flex items-center gap-1"
                                                        title="Pause subscription"
                                                    >
                                                        <Pause size={16} />
                                                        Pause
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(sub.id, 'cancel')}
                                                        className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                                                        title="Cancel subscription"
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            {sub.status === 'paused' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(sub.id, 'resume')}
                                                        className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                                                        title="Resume subscription"
                                                    >
                                                        <Play size={16} />
                                                        Resume
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(sub.id, 'cancel')}
                                                        className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                                                        title="Cancel subscription"
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            {sub.status === 'cancelled' && (
                                                <span className="text-gray-400 text-xs">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
