'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Check, X as XIcon, Trash2, Star } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface Testimonial {
    id: string
    name: string
    role: string | null
    message: string
    imageUrl: string | null
    rating: number | null
    status: string
    order: number
    createdAt: string
    updatedAt: string
}

export default function AdminTestimonialsPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
    const [loading, setLoading] = useState(true)
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        const res = await fetch('/api/testimonials?status=ALL')
        const data = await res.json()
        setTestimonials(data)
        setLoading(false)
    }

    async function updateStatus(id: string, status: string) {
        try {
            await fetch(`/api/testimonials/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            fetchTestimonials()
            setSelectedTestimonial(null)
            showToast(`Testimonial ${status.toLowerCase()} successfully!`, 'success')
        } catch (error) {
            console.error('Error updating testimonial:', error)
            showToast('Failed to update testimonial', 'error')
        }
    }

    async function handleDelete(id: string) {
        const confirmed = await confirm(
            'Are you sure you want to delete this testimonial? This action cannot be undone.',
            'Delete Testimonial'
        )

        if (!confirmed) return

        try {
            await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
            showToast('Testimonial deleted successfully!', 'success')
            fetchTestimonials()
        } catch (error) {
            console.error('Error deleting testimonial:', error)
            showToast('Failed to delete testimonial', 'error')
        }
    }

    const filteredTestimonials = filter === 'ALL'
        ? testimonials
        : testimonials.filter(t => t.status === filter)

    const pendingCount = testimonials.filter(t => t.status === 'PENDING').length

    if (loading) {
        return <div className="text-center py-12">Loading testimonials...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare size={32} className="text-[#6E8C82]" />
                        Testimonials Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Review and approve testimonials from users
                        {pendingCount > 0 && (
                            <span className="ml-2 bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-medium">
                                {pendingCount} pending
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                            ? 'bg-[#6E8C82] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {status}
                        {status !== 'ALL' && (
                            <span className="ml-2">
                                ({testimonials.filter(t => t.status === status).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className={`bg-white rounded-xl shadow-sm border-2 p-6 ${testimonial.status === 'PENDING'
                            ? 'border-orange-200'
                            : testimonial.status === 'APPROVED'
                                ? 'border-green-200'
                                : 'border-red-200'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                                {testimonial.role && (
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                )}
                            </div>
                            {testimonial.rating && (
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <p className="text-gray-700 text-sm line-clamp-4 mb-4">{testimonial.message}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                            <span
                                className={`px-2 py-1 rounded ${testimonial.status === 'PENDING'
                                    ? 'bg-orange-100 text-orange-700'
                                    : testimonial.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {testimonial.status}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {testimonial.status !== 'APPROVED' && (
                                <button
                                    onClick={() => updateStatus(testimonial.id, 'APPROVED')}
                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <Check size={16} />
                                    Approve
                                </button>
                            )}
                            {testimonial.status !== 'REJECTED' && (
                                <button
                                    onClick={() => updateStatus(testimonial.id, 'REJECTED')}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <XIcon size={16} />
                                    Reject
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTestimonials.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No {filter.toLowerCase()} testimonials found.
                </div>
            )}
        </div>
    )
}
