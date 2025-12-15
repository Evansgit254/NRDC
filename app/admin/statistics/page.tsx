'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Plus, Edit, Trash2, X } from 'lucide-react'
import * as Icons from 'lucide-react'

interface Statistic {
    id: string
    label: string
    value: string
    icon: string
    order: number
    active: boolean
    createdAt: string
    updatedAt: string
}

const iconsAvailable = [
    'Users', 'Utensils', 'Sprout', 'Heart', 'Award', 'Target', 'TrendingUp', 'Gift', 'Home', 'Globe'
]

export default function AdminStatisticsPage() {
    const [statistics, setStatistics] = useState<Statistic[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Statistic | null>(null)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        label: '',
        value: '',
        icon: 'Users',
        order: 0,
        active: true,
    })

    useEffect(() => {
        fetchStatistics()
    }, [])

    async function fetchStatistics() {
        const res = await fetch('/api/statistics', { cache: 'no-store' })
        const data = await res.json()
        setStatistics(data)
        setLoading(false)
    }

    function openCreateForm() {
        setEditing(null)
        setFormData({
            label: '',
            value: '',
            icon: 'Users',
            order: statistics.length,
            active: true,
        })
        setShowForm(true)
    }

    function openEditForm(stat: Statistic) {
        setEditing(stat)
        setFormData({
            label: stat.label,
            value: stat.value,
            icon: stat.icon,
            order: stat.order,
            active: stat.active,
        })
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (editing) {
                await fetch(`/api/statistics/${editing.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            } else {
                await fetch('/api/statistics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            }

            setShowForm(false)
            fetchStatistics()
        } catch (error) {
            console.error('Error saving statistic:', error)
            alert('Failed to save statistic')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this statistic?')) return

        try {
            const res = await fetch(`/api/statistics/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to delete statistic')
            }
            fetchStatistics()
        } catch (error) {
            console.error('Error deleting statistic:', error)
            alert(error instanceof Error ? error.message : 'Failed to delete statistic')
        }
    }

    function getIconComponent(iconName: string) {
        const Icon = (Icons as any)[iconName] || Icons.BarChart3
        return <Icon size={24} />
    }

    if (loading && !showForm) {
        return <div className="text-center py-12">Loading statistics...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 size={32} className="text-[#6E8C82]" />
                        Statistics Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage impact numbers displayed on the homepage</p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Statistic
                </button>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statistics.map((stat) => (
                    <div
                        key={stat.id}
                        className={`bg-white rounded-xl shadow-sm border p-6 ${!stat.active ? 'opacity-50' : ''
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-[#6E8C82]/20 rounded-lg text-[#6E8C82]">
                                {getIconComponent(stat.icon)}
                            </div>
                            {!stat.active && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                    Inactive
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-gray-600 text-sm mb-4">{stat.label}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditForm(stat)}
                                className="flex-1 bg-[#6E8C82]/10 hover:bg-[#6E8C82]/20 text-[#587068] px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(stat.id)}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editing ? 'Edit Statistic' : 'Add Statistic'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Label *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Lives Impacted"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Value *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 50,000+"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Icon *
                                </label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                >
                                    {iconsAvailable.map((iconName) => (
                                        <option key={iconName} value={iconName}>
                                            {iconName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={formData.active ? 'active' : 'inactive'}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
