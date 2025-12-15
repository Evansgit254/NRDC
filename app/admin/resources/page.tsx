'use client'

import { useEffect, useState } from 'react'
import { FileDown, Plus, Edit, Trash2, X, Upload, Loader2, Download } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface Resource {
    id: string
    title: string
    description: string | null
    fileUrl: string
    fileSize: string
    fileType: string
    category: string | null
    downloads: number
    active: boolean
    createdAt: string
    updatedAt: string
}

export default function AdminResourcesPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Resource | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileUrl: '',
        fileSize: '',
        fileType: 'PDF',
        category: '',
        active: true,
    })

    useEffect(() => {
        fetchResources()
    }, [])

    async function fetchResources() {
        const res = await fetch('/api/resources')
        const data = await res.json()
        setResources(data)
        setLoading(false)
    }

    function openCreateForm() {
        setEditing(null)
        setFormData({
            title: '',
            description: '',
            fileUrl: '',
            fileSize: '',
            fileType: 'PDF',
            category: '',
            active: true,
        })
        setShowForm(true)
    }

    function openEditForm(resource: Resource) {
        setEditing(resource)
        setFormData({
            title: resource.title,
            description: resource.description || '',
            fileUrl: resource.fileUrl,
            fileSize: resource.fileSize,
            fileType: resource.fileType,
            category: resource.category || '',
            active: resource.active,
        })
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (editing) {
                await fetch(`/api/resources/${editing.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            } else {
                await fetch('/api/resources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
            }

            setShowForm(false)
            fetchResources()
            showToast(editing ? 'Resource updated successfully!' : 'Resource created successfully!', 'success')
        } catch (error) {
            console.error('Error saving resource:', error)
            showToast('Failed to save resource', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        const confirmed = await confirm(
            'Are you sure you want to delete this resource? This action cannot be undone.',
            'Delete Resource'
        )

        if (!confirmed) return

        try {
            await fetch(`/api/resources/${id}`, { method: 'DELETE' })
            showToast('Resource deleted successfully!', 'success')
            fetchResources()
        } catch (error) {
            console.error('Error deleting resource:', error)
            showToast('Failed to delete resource', 'error')
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nrdc_resources')

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
                {
                    method: 'POST',
                    body: uploadFormData,
                }
            )

            const data = await res.json()
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)

            setFormData({
                ...formData,
                fileUrl: data.secure_url,
                fileSize: `${sizeInMB} MB`,
                fileType: file.type.split('/')[1].toUpperCase() || 'PDF',
            })
            showToast('File uploaded successfully!', 'success')
        } catch (error) {
            console.error('Error uploading file:', error)
            showToast('Failed to upload file', 'error')
        } finally {
            setUploading(false)
        }
    }

    if (loading && !showForm) {
        return <div className="text-center py-12">Loading resources...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FileDown size={32} className="text-[#6E8C82]" />
                        Resources Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage downloadable files on the About page</p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Resource
                </button>
            </div>

            {/* Resources Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Size</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Downloads</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((resource) => (
                            <tr key={resource.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{resource.title}</div>
                                    {resource.description && (
                                        <div className="text-sm text-gray-500 line-clamp-1">
                                            {resource.description}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">{resource.category || '-'}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-[#6E8C82]/20 text-[#587068] text-xs rounded">
                                        {resource.fileType}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">{resource.fileSize}</td>
                                <td className="p-4 text-gray-600">{resource.downloads}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${resource.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {resource.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditForm(resource)}
                                            className="text-[#6E8C82] hover:text-[#587068]"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resource.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <a
                                            href={resource.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {resources.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No resources yet. Add your first resource to get started.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editing ? 'Edit Resource' : 'Add Resource'}
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
                                    Upload File
                                </label>
                                <div>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit"
                                    >
                                        {uploading ? (
                                            <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Upload size={18} /> Upload File</>
                                        )}
                                    </label>
                                    {formData.fileUrl && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✓ File uploaded successfully
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Title *
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
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Annual Report"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                    disabled={loading || !formData.fileUrl}
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
