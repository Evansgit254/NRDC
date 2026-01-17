'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'
import { Loader2, Save, Building, CreditCard, Landmark } from 'lucide-react'

export default function BankSettingsPage() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        accountName: '',
        accountNumber: '',
        branch: '',
        bankCode: '',
        branchCode: '',
        swiftCode: '',
        phoneNumber: '',
        bankName: ''
    })

    useEffect(() => {
        fetchBankSettings()
    }, [])

    async function fetchBankSettings() {
        try {
            const res = await fetch('/api/settings/bank')
            if (res.ok) {
                const data = await res.json()
                if (data) {
                    setSettings({
                        accountName: data.accountName || '',
                        accountNumber: data.accountNumber || '',
                        branch: data.branch || '',
                        bankCode: data.bankCode || '',
                        branchCode: data.branchCode || '',
                        swiftCode: data.swiftCode || '',
                        phoneNumber: data.phoneNumber || '',
                        bankName: data.bankName || ''
                    })
                }
            }
        } catch (error) {
            console.error('Error fetching bank settings:', error)
            showToast('Failed to load bank settings', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch('/api/settings/bank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            if (res.ok) {
                showToast('Bank details updated successfully!', 'success')
            } else {
                const error = await res.json()
                showToast(error.error || 'Failed to save bank details', 'error')
            }
        } catch (error) {
            console.error('Error saving bank settings:', error)
            showToast('Failed to save bank settings', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#6E8C82]" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bank & Payment Settings</h1>
                    <p className="text-gray-500 mt-2">Manage the banking coordinates displayed to donors.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#2E8B57] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Details
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                        <Building size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Official Bank Coordinates</h2>
                        <p className="text-sm text-gray-500">Ensure these details are matching your official certificates.</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Account Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={settings.accountName}
                                onChange={e => setSettings({ ...settings, accountName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                placeholder="NRDC"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={settings.accountNumber}
                                onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                placeholder="01207150002"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bank Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Landmark size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={settings.bankName}
                                    onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                    placeholder="Bank of Africa"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Branch <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={settings.branch}
                                onChange={e => setSettings({ ...settings, branch: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                placeholder="Nairobi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bank Code
                            </label>
                            <input
                                type="text"
                                value={settings.bankCode}
                                onChange={e => setSettings({ ...settings, bankCode: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                placeholder="19"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Swift Code
                            </label>
                            <input
                                type="text"
                                value={settings.swiftCode}
                                onChange={e => setSettings({ ...settings, swiftCode: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent outline-none transition-all"
                                placeholder="AFRIKENX"
                            />
                        </div>

                        <div className="md:col-span-2 pt-4 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600" />
                                Mobile Music / M-Pesa
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Paybill / Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.phoneNumber}
                                onChange={e => setSettings({ ...settings, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="972900"
                            />
                        </div>
                    </div>

                    <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                        <div className="text-blue-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </div>
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> These details are used to generate the bank transfer instructions and donation receipts automatically. Changing them here will update the site immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
