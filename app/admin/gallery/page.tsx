'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface GalleryImage {
    id: string
    url: string
    caption: string | null
    category: string | null
    createdAt: string
}

export default function AdminGalleryPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        file: null as File | null,
        caption: '',
        category: ''
    })

    useEffect(() => {
        fetchImages()
    }, [])

    async function fetchImages() {
        const res = await fetch('/api/gallery')
        const data = await res.json()
        setImages(data)
        setLoading(false)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.file) {
            showToast('Please select an image', 'warning')
            return
        }

        setUploading(true)

        try {
            // Upload image to Cloudinary
            const uploadFormData = new FormData()
            uploadFormData.append('file', formData.file)

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData
            })

            if (!uploadRes.ok) {
                throw new Error('Upload failed')
            }

            const { url } = await uploadRes.json()

            // Save to gallery
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    caption: formData.caption,
                    category: formData.category
                })
            })

            if (res.ok) {
                setFormData({ file: null, caption: '', category: '' })
                setPreview(null)
                setShowForm(false)
                fetchImages()
                showToast('Image uploaded successfully!', 'success')
            }
        } catch (error) {
            showToast('Error uploading image. Please try again.', 'error')
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete(id: string) {
        const confirmed = await confirm(
            'Are you sure you want to delete this image? This action cannot be undone.',
            'Delete Image'
        )

        if (!confirmed) return

        const res = await fetch(`/api/gallery?id=${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            showToast('Image deleted successfully!', 'success')
            fetchImages()
        } else {
            showToast('Failed to delete image', 'error')
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    disabled={uploading}
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Upload Image'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6E8C82] transition-colors">
                                {preview ? (
                                    <div className="space-y-3">
                                        <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null)
                                                setFormData({ ...formData, file: null })
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
                                        <label className="cursor-pointer">
                                            <span className="text-[#6E8C82] hover:underline font-medium">Click to upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                placeholder="Photo caption..."
                                value={formData.caption}
                                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                placeholder="Programs, Events, Community"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
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
                                <>
                                    <Upload size={20} />
                                    Upload to Gallery
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                    <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="aspect-square relative bg-gray-200">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url("${image.url}")` }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        {image.caption && (
                            <div className="p-3">
                                <p className="text-sm text-gray-700">{image.caption}</p>
                                {image.category && (
                                    <p className="text-xs text-gray-500 mt-1">{image.category}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Upload size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No images in the gallery yet.</p>
                    <p className="text-sm">Click "Upload Image" to get started!</p>
                </div>
            )}
        </div>
    )
}
