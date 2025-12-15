'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, RotateCcw, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'
import Link from 'next/link'

interface PostHistory {
    id: string
    title: string
    content: string
    createdAt: string
    editorId: string
}

export default function PostHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [history, setHistory] = useState<PostHistory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    async function fetchHistory() {
        const res = await fetch(`/api/blogs/${id}/history`)
        if (res.ok) {
            const data = await res.json()
            setHistory(data)
        }
        setLoading(false)
    }

    async function handleRestore(version: PostHistory) {
        const confirmed = await confirm(
            `Are you sure you want to restore this version from ${new Date(version.createdAt).toLocaleString()}? Current content will be overwritten.`,
            'Restore Version'
        )

        if (!confirmed) return

        try {
            const res = await fetch(`/api/blogs?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: version.title,
                    content: version.content,
                })
            })

            if (res.ok) {
                showToast('Version restored successfully!', 'success')
                router.push('/admin/blog')
            } else {
                throw new Error('Failed to restore')
            }
        } catch (error) {
            showToast('Failed to restore version', 'error')
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading history...</div>
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Version History</h1>
                    <p className="text-gray-600">View and restore previous versions of this post</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {history.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No history available for this post.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {history.map((version) => (
                            <div key={version.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="font-medium text-gray-900">
                                                {new Date(version.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{version.title}</h3>
                                        <div className="text-sm text-gray-500 line-clamp-2 font-mono bg-gray-50 p-2 rounded">
                                            {version.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRestore(version)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6E8C82] bg-[#6E8C82]/10 hover:bg-[#6E8C82]/20 rounded-lg transition-colors"
                                    >
                                        <RotateCcw size={16} />
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
