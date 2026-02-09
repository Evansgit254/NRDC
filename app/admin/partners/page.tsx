'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, X, Upload as UploadIcon, Image as ImageIcon, Search, Loader2, Upload, Handshake } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface Partner {
    id: string
    name: string
    logo: string
    website: string | null
    createdAt: string
    updatedAt: string
}

export default function AdminPartnersPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [partners, setPartners] = useState<Partner[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Partner | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredPartners = partners.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        website: '',
    })

    useEffect(() => {
        fetchPartners()
    }, [])

    async function fetchPartners() {
        const res = await fetch('/api/partners')
        const data = await res.json()
        setPartners(data)
        setLoading(false)
    }

    function openCreateForm() {
        setEditing(null)
        setFormData({
            name: '',
            logo: '',
            website: '',
        })
        setShowForm(true)
    }

    function openEditForm(partner: Partner) {
        setEditing(partner)
        setFormData({
            name: partner.name,
            logo: partner.logo,
            website: partner.website || '',
        })
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (editing) {
                // Update
                await fetch(`/api/partners/${editing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            } else {
                // Create
                await fetch('/api/partners', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            }

            setShowForm(false)
            fetchPartners()
            showToast(editing ? 'Partner updated successfully!' : 'Partner created successfully!', 'success')
        } catch (error) {
            console.error('Error saving partner:', error)
            showToast('Failed to save partner', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        const partner = partners.find(p => p.id === id)
        const name = partner ? partner.name : 'this partner'

        const confirmed = await confirm(
            `Are you sure you want to delete ${name}? This action cannot be undone.`,
            'Delete Partner'
        )

        if (!confirmed) return

        try {
            await fetch(`/api/partners/${id}`, { method: 'DELETE' })
            showToast('Partner deleted successfully!', 'success')
            fetchPartners()
        } catch (error) {
            console.error('Error deleting partner:', error)
            showToast('Failed to delete partner', 'error')
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nrdc_partners')

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: uploadFormData,
                }
            )

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error.message)
            }
            setFormData({ ...formData, logo: data.secure_url })
            showToast('Logo uploaded successfully!', 'success')
        } catch (error) {
            console.error('Error uploading logo:', error)
            showToast('Failed to upload logo', 'error')
        } finally {
            setUploading(false)
        }
    }

    if (loading && !showForm) {
        return <div className="text-center py-12">Loading partners...</div>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Handshake size={32} className="text-[#6E8C82]" />
                    Partner Management
                </h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openCreateForm}
                        className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                        disabled={uploading}
                    >
                        <Plus size={20} />
                        Add Partner
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mt-1 mb-8">Manage partners displayed on the homepage</p>


            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                    <div
                        key={partner.id}
                        className="bg-white rounded-xl shadow-sm border p-6"
                    >
                        <div className="text-center">
                            {partner.logo ? (
                                <div className="h-24 flex items-center justify-center mb-4">
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        width={120}
                                        height={60}
                                        className="max-h-full w-auto object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="h-24 rounded-lg mb-4 bg-gray-100 flex items-center justify-center text-gray-400">
                                    No Logo
                                </div>
                            )}
                            <h3 className="font-bold text-lg text-gray-900">{partner.name}</h3>
                            {partner.website && (
                                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[#6E8C82] text-sm hover:underline block mb-2 truncate">
                                    {partner.website}
                                </a>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => openEditForm(partner)}
                                className="flex-1 bg-[#6E8C82]/10 hover:bg-[#6E8C82]/20 text-[#587068] px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(partner.id)}
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
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editing ? 'Edit Partner' : 'Add Partner'}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Logo *
                                </label>
                                <div className="flex items-center gap-4">
                                    {formData.logo && (
                                        <div className="h-20 w-20 relative bg-gray-50 border rounded-lg flex items-center justify-center p-2">
                                            <Image
                                                src={formData.logo}
                                                alt="Preview"
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="partner-logo-upload"
                                        />
                                        <label
                                            htmlFor="partner-logo-upload"
                                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            {uploading ? (
                                                <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                                            ) : (
                                                <><Upload size={18} /> Upload Logo</>
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Recommended size: 200x100px (PNG/JPG)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                    placeholder="https://example.com"
                                />
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
                                    disabled={loading || uploading}
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
