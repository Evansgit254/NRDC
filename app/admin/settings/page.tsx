'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'
import { Loader2, Save } from 'lucide-react'

export default function AdminSettingsPage() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        core_values: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        // Bank details
        bank_account_name: '',
        bank_account_number: '',
        bank_branch: '',
        bank_code: '',
        bank_branch_code: '',
        bank_swift_code: '',
        bank_phone_number: '',
        bank_name: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const [settingsRes, bankRes] = await Promise.all([
                fetch('/api/settings'),
                fetch('/api/settings/bank')
            ])

            if (settingsRes.ok) {
                const data = await settingsRes.json()
                setSettings(prev => ({
                    ...prev,
                    ...data
                }))
            }

            if (bankRes.ok) {
                const bankData = await bankRes.json()
                if (bankData) {
                    setSettings(prev => ({
                        ...prev,
                        bank_account_name: bankData.accountName || '',
                        bank_account_number: bankData.accountNumber || '',
                        bank_branch: bankData.branch || '',
                        bank_code: bankData.bankCode || '',
                        bank_branch_code: bankData.branchCode || '',
                        bank_swift_code: bankData.swiftCode || '',
                        bank_phone_number: bankData.phoneNumber || '',
                        bank_name: bankData.bankName || ''
                    }))
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            showToast('Failed to load settings', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        try {
            // Save general settings
            const settingsRes = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    core_values: settings.core_values,
                    contact_email: settings.contact_email,
                    contact_phone: settings.contact_phone,
                    contact_address: settings.contact_address
                })
            })

            // Save bank details
            const bankRes = await fetch('/api/settings/bank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountName: settings.bank_account_name,
                    accountNumber: settings.bank_account_number,
                    branch: settings.bank_branch,
                    bankCode: settings.bank_code,
                    branchCode: settings.bank_branch_code,
                    swiftCode: settings.bank_swift_code,
                    phoneNumber: settings.bank_phone_number,
                    bankName: settings.bank_name
                })
            })

            if (settingsRes.ok && bankRes.ok) {
                showToast('Settings saved successfully!', 'success')
            } else {
                showToast('Failed to save some settings', 'error')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            showToast('Failed to save settings', 'error')
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#6E8C82] rounded-full"></span>
                        General Settings
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Core Values (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={settings.core_values}
                                onChange={e => setSettings({ ...settings, core_values: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="Integrity, Compassion, Sustainability..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                These values will be displayed on the About page.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#2E8B57] rounded-full"></span>
                        Contact Information
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="contact@nrdc.org"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.contact_phone}
                                onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="+254 727 001 702"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Physical Address
                            </label>
                            <textarea
                                value={settings.contact_address}
                                onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                rows={3}
                                placeholder="Enter physical address..."
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Account Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#2E8B57] rounded-full"></span>
                        Bank Account Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Name *
                            </label>
                            <input
                                type="text"
                                value={settings.bank_account_name}
                                onChange={e => setSettings({ ...settings, bank_account_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="NRDC"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                value={settings.bank_account_number}
                                onChange={e => setSettings({ ...settings, bank_account_number: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="01207150002"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                value={settings.bank_name}
                                onChange={e => setSettings({ ...settings, bank_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="ABC Bank"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch *
                            </label>
                            <input
                                type="text"
                                value={settings.bank_branch}
                                onChange={e => setSettings({ ...settings, bank_branch: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="Nairobi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Code
                            </label>
                            <input
                                type="text"
                                value={settings.bank_code}
                                onChange={e => setSettings({ ...settings, bank_code: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="19"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Code
                            </label>
                            <input
                                type="text"
                                value={settings.bank_branch_code}
                                onChange={e => setSettings({ ...settings, bank_branch_code: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Swift Code
                            </label>
                            <input
                                type="text"
                                value={settings.bank_swift_code}
                                onChange={e => setSettings({ ...settings, bank_swift_code: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="AFRIKENX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.bank_phone_number}
                                onChange={e => setSettings({ ...settings, bank_phone_number: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="972900"
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        These bank details will be displayed on the donation page for donors who prefer bank transfers.
                    </p>
                </div>
            </div>
        </div>
    )
}
