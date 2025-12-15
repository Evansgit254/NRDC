'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, X, Upload as UploadIcon, Image as ImageIcon, Search, Loader2, Upload, Users } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface TeamMember {
    id: string
    name: string
    title: string
    bio: string | null
    imageUrl: string | null
    order: number
    active: boolean
    createdAt: string
    updatedAt: string
}

export default function AdminTeamPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<TeamMember | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        imageUrl: '',
        order: 0,
        active: true,
    })

    useEffect(() => {
        fetchTeamMembers()
    }, [])

    async function fetchTeamMembers() {
        const res = await fetch('/api/team')
        const data = await res.json()
        setTeamMembers(data)
        setLoading(false)
    }

    function openCreateForm() {
        setEditing(null)
        setFormData({
            name: '',
            title: '',
            bio: '',
            imageUrl: '',
            order: teamMembers.length,
            active: true,
        })
        setShowForm(true)
    }

    function openEditForm(member: TeamMember) {
        setEditing(member)
        setFormData({
            name: member.name,
            title: member.title,
            bio: member.bio || '',
            imageUrl: member.imageUrl || '',
            order: member.order,
            active: member.active,
        })
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (editing) {
                // Update
                await fetch(`/api/team/${editing.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            } else {
                // Create
                await fetch('/api/team', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            }

            setShowForm(false)
            fetchTeamMembers()
            showToast(editing ? 'Team member updated successfully!' : 'Team member created successfully!', 'success')
        } catch (error) {
            console.error('Error saving team member:', error)
            showToast('Failed to save team member', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        // Find member name for confirmation message
        const member = teamMembers.find(m => m.id === id)
        const name = member ? member.name : 'this team member'

        const confirmed = await confirm(
            `Are you sure you want to delete ${name}? This action cannot be undone.`,
            'Delete Team Member'
        )

        if (!confirmed) return

        try {
            await fetch(`/api/team/${id}`, { method: 'DELETE' })
            showToast('Team member deleted successfully!', 'success')
            fetchTeamMembers()
        } catch (error) {
            console.error('Error deleting team member:', error)
            showToast('Failed to delete team member', 'error')
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nrdc_team')

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: uploadFormData,
                }
            )

            const data = await res.json()
            setFormData({ ...formData, imageUrl: data.secure_url })
            showToast('Image uploaded successfully!', 'success')
        } catch (error) {
            console.error('Error uploading image:', error)
            showToast('Failed to upload image', 'error')
        } finally {
            setUploading(false)
        }
    }

    if (loading && !showForm) {
        return <div className="text-center py-12">Loading team members...</div>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Users size={32} className="text-[#6E8C82]" />
                    Team Management
                </h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search team..."
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
                        Add Team Member
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mt-1 mb-8">Manage team members displayed on the About page</p>


            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                    <div
                        key={member.id}
                        className={`bg-white rounded-xl shadow-sm border p-6 ${!member.active ? 'opacity-50' : ''
                            }`}
                    >
                        <div className="text-center">
                            {member.imageUrl ? (
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    width={120}
                                    height={120}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                                    <Users size={40} className="text-gray-400" />
                                </div>
                            )}
                            <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                            <p className="text-[#6E8C82] text-sm mb-2">{member.title}</p>
                            {member.bio && (
                                <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => openEditForm(member)}
                                className="flex-1 bg-[#6E8C82]/10 hover:bg-[#6E8C82]/20 text-[#587068] px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
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
                                {editing ? 'Edit Team Member' : 'Add Team Member'}
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
                                    Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    {formData.imageUrl && (
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            {uploading ? (
                                                <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                                            ) : (
                                                <><Upload size={18} /> Upload Photo</>
                                            )}
                                        </label>
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
                                    Title/Position *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            setFormData({ ...formData, order: isNaN(val) ? 0 : val })
                                        }}
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
