'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, X, Upload as UploadIcon, Image as ImageIcon, Search } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface Program {
    id: string
    title: string
    slug: string
    description: string
    objectives: string
    metrics: string
    photos: string
    createdAt: string
}

export default function AdminProgramsPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredPrograms = programs.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        objectives: '',
        metrics: '',
        photoFile: null as File | null,
        photoUrl: ''
    })

    useEffect(() => {
        fetchPrograms()
    }, [])

    async function fetchPrograms() {
        const res = await fetch('/api/programs')
        const data = await res.json()
        setPrograms(data)
        setLoading(false)
    }

    function handleAdd() {
        setFormData({ title: '', description: '', objectives: '', metrics: '{}', photoFile: null, photoUrl: '' })
        setPhotoPreview(null)
        setEditingId(null)
        setShowForm(true)
    }

    function handleEdit(program: Program) {
        const photos = JSON.parse(program.photos || '[]')
        setFormData({
            title: program.title,
            description: program.description,
            objectives: program.objectives,
            metrics: program.metrics,
            photoFile: null,
            photoUrl: photos[0] || ''
        })
        setPhotoPreview(photos[0] || null)
        setEditingId(program.id)
        setShowForm(true)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, photoFile: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setUploading(true)

        try {
            let photoUrl = formData.photoUrl

            // Upload new image if selected
            if (formData.photoFile) {
                const uploadFormData = new FormData()
                uploadFormData.append('file', formData.photoFile)

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                })

                if (!uploadRes.ok) throw new Error('Upload failed')
                const { url } = await uploadRes.json()
                photoUrl = url
            }

            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

            const payload = {
                title: formData.title,
                description: formData.description,
                objectives: formData.objectives,
                metrics: formData.metrics,
                photos: photoUrl ? photoUrl : '',
                slug
            }

            const url = editingId ? `/api/programs?id=${editingId}` : '/api/programs'
            const method = editingId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                showToast(editingId ? 'Program updated successfully!' : 'Program created successfully!', 'success')
                setShowForm(false)
                fetchPrograms()
            } else {
                throw new Error('Failed to save program')
            }
        } catch (error) {
            showToast('Error saving program. Please try again.', 'error')
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete(id: string, title: string) {
        const confirmed = await confirm(
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            'Delete Program'
        )

        if (!confirmed) return

        const res = await fetch(`/api/programs?id=${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            showToast('Program deleted successfully!', 'success')
            fetchPrograms()
        } else {
            showToast('Failed to delete program', 'error')
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                        disabled={uploading}
                    >
                        <Plus size={20} />
                        Add Program
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Program</h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Program Cover Photo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6E8C82] transition-colors">
                                {photoPreview ? (
                                    <div className="space-y-3">
                                        <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPhotoPreview(null)
                                                setFormData({ ...formData, photoFile: null, photoUrl: '' })
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Photo
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <ImageIcon size={36} className="mx-auto text-gray-400 mb-2" />
                                        <label className="cursor-pointer">
                                            <span className="text-[#6E8C82] hover:underline font-medium">Click to upload photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Objectives (one per line)
                            </label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                placeholder="Provide nutritious meals&#10;Improve health outcomes&#10;Build community resilience"
                                value={formData.objectives}
                                onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter each objective on a new line</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Impact Metrics
                            </label>
                            <div className="space-y-3">
                                {(() => {
                                    try {
                                        const metricsObj = formData.metrics ? JSON.parse(formData.metrics) : {}
                                        const metricsArray = Object.entries(metricsObj)

                                        return (
                                            <>
                                                {metricsArray.map(([key, value], index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Metric name (e.g., people_served)"
                                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                                            value={key}
                                                            onChange={e => {
                                                                const newMetrics = { ...metricsObj }
                                                                delete newMetrics[key]
                                                                newMetrics[e.target.value] = value
                                                                setFormData({ ...formData, metrics: JSON.stringify(newMetrics) })
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Value (e.g., 5,000+)"
                                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                                            value={String(value)}
                                                            onChange={e => {
                                                                const newMetrics = { ...metricsObj, [key]: e.target.value }
                                                                setFormData({ ...formData, metrics: JSON.stringify(newMetrics) })
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newMetrics = { ...metricsObj }
                                                                delete newMetrics[key]
                                                                setFormData({ ...formData, metrics: JSON.stringify(newMetrics) })
                                                            }}
                                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newMetrics = { ...metricsObj, [`metric_${Date.now()}`]: '' }
                                                        setFormData({ ...formData, metrics: JSON.stringify(newMetrics) })
                                                    }}
                                                    className="text-[#6E8C82] hover:underline text-sm font-medium flex items-center gap-1"
                                                >
                                                    <Plus size={16} />
                                                    Add Metric
                                                </button>
                                            </>
                                        )
                                    } catch {
                                        return (
                                            <div className="text-red-600 text-sm">
                                                Invalid metrics format. <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, metrics: '{}' })}
                                                    className="underline"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Add metrics like &quot;people_served: 5,000+&quot; or &quot;locations: 12&quot;
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-[#2E8B57] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>{editingId ? 'Update' : 'Create'} Program</>
                                )}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Slug</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Created</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrograms.map((program) => (
                            <tr key={program.id} className="border-b border-gray-100 last:border-0">
                                <td className="p-4 font-medium text-gray-900">{program.title}</td>
                                <td className="p-4 text-gray-600">{program.slug}</td>
                                <td className="p-4 text-gray-600">
                                    {new Date(program.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(program)}
                                            className="text-[#6E8C82] hover:text-[#587068] p-2"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(program.id, program.title)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {programs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No programs yet. Create your first program!
                    </div>
                )}
            </div>
        </div>
    )
}
