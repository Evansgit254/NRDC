'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X, DollarSign, BarChart, Receipt, Filter, Download } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

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

interface DonationRecord {
    id: string
    amount: number
    currency: string
    donorName: string | null
    donorEmail: string
    donorPhone: string | null
    paymentMethod: string
    paymentStatus: string
    stripeSessionId: string | null
    createdAt: string
    updatedAt: string
}

export default function AdminDonationsPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [tiers, setTiers] = useState<DonationTier[]>([])
    const [stats, setStats] = useState<DonationStat[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'tiers' | 'stats' | 'history'>('tiers')

    // Donation records state
    const [donations, setDonations] = useState<DonationRecord[]>([])
    const [donationsTotal, setDonationsTotal] = useState(0)
    const [donationsLoading, setDonationsLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [methodFilter, setMethodFilter] = useState<string>('')

    // Form states
    const [showTierForm, setShowTierForm] = useState(false)
    const [tierForm, setTierForm] = useState({ amount: '', description: '', isPopular: false, order: 0 })
    const [editingTier, setEditingTier] = useState<DonationTier | null>(null)

    const [showStatForm, setShowStatForm] = useState(false)
    const [statForm, setStatForm] = useState({ value: '', label: '', order: 0 })
    const [editingStat, setEditingStat] = useState<DonationStat | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const [tiersRes, statsRes] = await Promise.all([
                fetch('/api/donations/tiers'),
                fetch('/api/donations/stats')
            ])

            if (tiersRes.ok) setTiers(await tiersRes.json())
            if (statsRes.ok) setStats(await statsRes.json())
        } catch (error) {
            console.error('Error fetching data:', error)
            showToast('Failed to load data', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Tier Handlers
    async function handleTierSubmit(e: React.FormEvent) {
        e.preventDefault()
        const url = '/api/donations/tiers'
        const method = editingTier ? 'PUT' : 'POST'
        const body = editingTier ? { ...tierForm, id: editingTier.id } : tierForm

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            showToast(`Donation tier ${editingTier ? 'updated' : 'created'} successfully`, 'success')
            setShowTierForm(false)
            setEditingTier(null)
            setTierForm({ amount: '', description: '', isPopular: false, order: 0 })
            fetchData()
        } else {
            showToast('Failed to save donation tier', 'error')
        }
    }

    async function deleteTier(id: string) {
        if (!await confirm('Are you sure you want to delete this donation tier?', 'Delete Tier')) return

        const res = await fetch(`/api/donations/tiers?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            showToast('Donation tier deleted', 'success')
            fetchData()
        } else {
            showToast('Failed to delete tier', 'error')
        }
    }

    // Stat Handlers
    async function handleStatSubmit(e: React.FormEvent) {
        e.preventDefault()
        const url = '/api/donations/stats'
        const method = editingStat ? 'PUT' : 'POST'
        const body = editingStat ? { ...statForm, id: editingStat.id } : statForm

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            showToast(`Statistic ${editingStat ? 'updated' : 'created'} successfully`, 'success')
            setShowStatForm(false)
            setEditingStat(null)
            setStatForm({ value: '', label: '', order: 0 })
            fetchData()
        } else {
            showToast('Failed to save statistic', 'error')
        }
    }

    async function deleteStat(id: string) {
        if (!await confirm('Are you sure you want to delete this statistic?', 'Delete Statistic')) return

        const res = await fetch(`/api/donations/stats?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            showToast('Statistic deleted', 'success')
            fetchData()
        } else {
            showToast('Failed to delete statistic', 'error')
        }
    }

    function startEditTier(tier: DonationTier) {
        setEditingTier(tier)
        setTierForm({
            amount: tier.amount.toString(),
            description: tier.description,
            isPopular: tier.isPopular,
            order: tier.order
        })
        setShowTierForm(true)
    }

    function startEditStat(stat: DonationStat) {
        setEditingStat(stat)
        setStatForm({
            value: stat.value,
            label: stat.label,
            order: stat.order
        })
        setShowStatForm(true)
    }

    // Fetch donation records
    async function fetchDonations() {
        setDonationsLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            if (methodFilter) params.append('method', methodFilter)

            const res = await fetch(`/api/donations/records?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setDonations(data.donations)
                setDonationsTotal(data.total)
            } else {
                showToast('Failed to load donations', 'error')
            }
        } catch (error) {
            console.error('Error fetching donations:', error)
            showToast('Failed to load donations', 'error')
        } finally {
            setDonationsLoading(false)
        }
    }

    // Update donation status
    async function updateDonationStatus(id: string, status: string) {
        if (!await confirm(`Are you sure you want to mark this donation as "${status}"?`)) return

        try {
            const res = await fetch('/api/donations/records', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })

            if (res.ok) {
                showToast('Donation status updated', 'success')
                fetchDonations()
            } else {
                showToast('Failed to update status', 'error')
            }
        } catch (error) {
            console.error('Error updating donation:', error)
            showToast('Failed to update status', 'error')
        }
    }

    // Load donations when history tab is active or filters change
    useEffect(() => {
        if (activeTab === 'history') {
            fetchDonations()
        }
    }, [activeTab, statusFilter, methodFilter])

    // Format currency
    function formatCurrency(amount: number, currency: string) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount)
    }

    // Format date
    function formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Get status badge color
    function getStatusColor(status: string) {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'failed': return 'bg-red-100 text-red-800'
            case 'refunded': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
                <p className="text-gray-600 mt-1">Manage donation tiers and impact statistics</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('tiers')}
                    className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'tiers'
                        ? 'border-b-2 border-[#6E8C82] text-[#6E8C82]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <DollarSign size={20} />
                    Donation Tiers
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'stats'
                        ? 'border-b-2 border-[#6E8C82] text-[#6E8C82]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BarChart size={20} />
                    Impact Statistics
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'history'
                        ? 'border-b-2 border-[#6E8C82] text-[#6E8C82]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Receipt size={20} />
                    Transaction History
                </button>
            </div>

            {activeTab === 'tiers' ? (
                <div>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => {
                                setEditingTier(null)
                                setTierForm({ amount: '', description: '', isPopular: false, order: 0 })
                                setShowTierForm(true)
                            }}
                            className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Tier
                        </button>
                    </div>

                    {showTierForm && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                            <h3 className="text-xl font-bold mb-4">{editingTier ? 'Edit Tier' : 'New Donation Tier'}</h3>
                            <form onSubmit={handleTierSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                            value={tierForm.amount}
                                            onChange={e => setTierForm({ ...tierForm, amount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                            value={tierForm.order}
                                            onChange={e => setTierForm({ ...tierForm, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                        value={tierForm.description}
                                        onChange={e => setTierForm({ ...tierForm, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPopular"
                                        className="w-4 h-4 text-[#6E8C82] rounded focus:ring-[#6E8C82]"
                                        checked={tierForm.isPopular}
                                        onChange={e => setTierForm({ ...tierForm, isPopular: e.target.checked })}
                                    />
                                    <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Mark as Most Popular</label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTierForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#6E8C82] text-white px-6 py-2 rounded-lg hover:bg-[#587068] transition-colors"
                                    >
                                        {editingTier ? 'Update Tier' : 'Create Tier'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tiers.map(tier => (
                            <div key={tier.id} className={`bg-white p-6 rounded-xl shadow-sm border-2 relative ${tier.isPopular ? 'border-[#2E8B57]' : 'border-gray-100'}`}>
                                {tier.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E8B57] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Popular
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-3xl font-bold text-[#6E8C82]">${tier.amount}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditTier(tier)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => deleteTier(tier.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{tier.description}</p>
                                <div className="mt-4 text-xs text-gray-400">Order: {tier.order}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'stats' ? (
                <div>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => {
                                setEditingStat(null)
                                setStatForm({ value: '', label: '', order: 0 })
                                setShowStatForm(true)
                            }}
                            className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Statistic
                        </button>
                    </div>

                    {showStatForm && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                            <h3 className="text-xl font-bold mb-4">{editingStat ? 'Edit Statistic' : 'New Statistic'}</h3>
                            <form onSubmit={handleStatSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Value (e.g. 95%)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                            value={statForm.value}
                                            onChange={e => setStatForm({ ...statForm, value: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                            value={statForm.order}
                                            onChange={e => setStatForm({ ...statForm, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                        value={statForm.label}
                                        onChange={e => setStatForm({ ...statForm, label: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#6E8C82] text-white px-6 py-2 rounded-lg hover:bg-[#587068] transition-colors"
                                    >
                                        {editingStat ? 'Update Statistic' : 'Create Statistic'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map(stat => (
                            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center relative group">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button onClick={() => startEditStat(stat)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => deleteStat(stat.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="text-4xl font-bold text-[#2E8B57] mb-2">{stat.value}</div>
                                <p className="text-gray-600">{stat.label}</p>
                                <div className="mt-2 text-xs text-gray-400">Order: {stat.order}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'history' ? (
                <div>
                    {/* Filters */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} className="text-gray-600" />
                            <h3 className="text-lg font-semibold">Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <select
                                    value={methodFilter}
                                    onChange={(e) => setMethodFilter(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                >
                                    <option value="">All Methods</option>
                                    <option value="paystack">Paystack</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="mpesa">M-Pesa</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setStatusFilter('')
                                        setMethodFilter('')
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-600">Total Donations</div>
                            <div className="text-2xl font-bold text-gray-900">{donationsTotal}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                            <div className="text-sm text-green-600">Completed</div>
                            <div className="text-2xl font-bold text-green-700">
                                {donations.filter(d => d.paymentStatus === 'completed').length}
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                            <div className="text-sm text-yellow-600">Pending</div>
                            <div className="text-2xl font-bold text-yellow-700">
                                {donations.filter(d => d.paymentStatus === 'pending').length}
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                            <div className="text-sm text-red-600">Failed</div>
                            <div className="text-2xl font-bold text-red-700">
                                {donations.filter(d => d.paymentStatus === 'failed').length}
                            </div>
                        </div>
                    </div>

                    {/* Donations Table */}
                    {donationsLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-[#6E8C82] border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading donations...</p>
                        </div>
                    ) : donations.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                            <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Donations Yet</h3>
                            <p className="text-gray-500">Donations will appear here once they start coming in.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {donations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(donation.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {donation.donorName || 'Anonymous'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                                                    {donation.donorPhone && (
                                                        <div className="text-xs text-gray-400">{donation.donorPhone}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {formatCurrency(donation.amount, donation.currency)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                    {donation.paymentMethod}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.paymentStatus)}`}>
                                                        {donation.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                                    {donation.stripeSessionId?.substring(0, 20)}...
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {donation.paymentStatus === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updateDonationStatus(donation.id, 'completed')}
                                                                className="text-green-600 hover:text-green-800 font-medium"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateDonationStatus(donation.id, 'failed')}
                                                                className="text-red-600 hover:text-red-800 font-medium"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    {donation.paymentStatus === 'completed' && (
                                                        <button
                                                            onClick={() => updateDonationStatus(donation.id, 'refunded')}
                                                            className="text-gray-600 hover:text-gray-800 font-medium"
                                                        >
                                                            Refund
                                                        </button>
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
            ) : null}
        </div>
    )
}
