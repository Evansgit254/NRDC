'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, X, Eye, EyeOff, Image as ImageIcon, Search, History } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'
import Editor from '@/components/Editor'
import Link from 'next/link'

interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    image: string | null
    category: string
    tags: string | null
    published: boolean
    createdAt: string
}

export default function AdminBlogPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        published: false,
        imageFile: null as File | null,
        imageUrl: ''
    })

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        setPosts(data)
        setLoading(false)
    }

    function handleAdd() {
        setFormData({ title: '', content: '', excerpt: '', category: '', tags: '', published: false, imageFile: null, imageUrl: '' })
        setImagePreview(null)
        setEditingId(null)
        setShowForm(true)
    }

    function handleEdit(post: BlogPost) {
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            category: post.category,
            tags: post.tags || '',
            published: post.published,
            imageFile: null,
            imageUrl: post.image || ''
        })
        setImagePreview(post.image || null)
        setEditingId(post.id)
        setShowForm(true)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, imageFile: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setUploading(true)

        try {
            let imageUrl = formData.imageUrl

            // Upload new image if selected
            if (formData.imageFile) {
                const uploadFormData = new FormData()
                uploadFormData.append('file', formData.imageFile)

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                })

                if (!uploadRes.ok) throw new Error('Upload failed')
                const { url } = await uploadRes.json()
                imageUrl = url
            }

            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

            const payload = {
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt,
                category: formData.category,
                tags: formData.tags,
                published: formData.published,
                image: imageUrl,
                slug
            }

            const url = editingId ? `/api/blogs?id=${editingId}` : '/api/blogs'
            const method = editingId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                showToast(editingId ? 'Post updated successfully!' : 'Post created successfully!', 'success')
                setShowForm(false)
                fetchPosts()
            } else {
                throw new Error('Failed to save post')
            }
        } catch (error) {
            showToast('Error saving post. Please try again.', 'error')
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete(id: string, title: string) {
        const confirmed = await confirm(
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            'Delete Post'
        )

        if (!confirmed) return

        const res = await fetch(`/api/blogs?id=${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            showToast('Post deleted successfully!', 'success')
            fetchPosts()
        } else {
            showToast('Failed to delete post', 'error')
        }
    }

    async function togglePublish(id: string, published: boolean) {
        const res = await fetch(`/api/blogs?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: !published })
        })

        if (res.ok) {
            fetchPosts()
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
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
                        Add Post
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Post</h2>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6E8C82] transition-colors">
                                {imagePreview ? (
                                    <div className="space-y-3">
                                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null)
                                                setFormData({ ...formData, imageFile: null, imageUrl: '' })
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <ImageIcon size={36} className="mx-auto text-gray-400 mb-2" />
                                        <label className="cursor-pointer">
                                            <span className="text-[#6E8C82] hover:underline font-medium">Click to upload image</span>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                placeholder="News, Stories, Updates"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Summary)</label>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <Editor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                placeholder="nutrition, health, community"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                className="w-4 h-4 text-[#6E8C82] rounded focus:ring-[#6E8C82]"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                            />
                            <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
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
                                    <>{editingId ? 'Update' : 'Create'} Post</>
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
                            <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="border-b border-gray-100 last:border-0">
                                <td className="p-4 font-medium text-gray-900">{post.title}</td>
                                <td className="p-4 text-gray-600">{post.category}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => togglePublish(post.id, post.published)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {post.published ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-[#6E8C82] hover:text-[#587068] p-2"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <Link
                                            href={`/admin/blog/${post.id}/history`}
                                            className="text-gray-600 hover:text-gray-800 p-2"
                                            title="History"
                                        >
                                            <History size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No blog posts yet. Create your first post!
                    </div>
                )}
            </div>
        </div>
    )
}
