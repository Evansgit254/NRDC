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
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const settingsRes = await fetch('/api/settings')
            if (settingsRes.ok) {
                const data = await settingsRes.json()
                setSettings(prev => ({
                    ...prev,
                    ...data
                }))
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

            if (settingsRes.ok) {
                showToast('Settings saved successfully!', 'success')
            } else {
                showToast('Failed to save settings', 'error')
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

            </div>
        </div>
    )
}
