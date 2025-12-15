'use client'

import { useEffect, useState } from 'react'
import { Download, Mail, X, Eye, Copy, Check } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface ContactSubmission {
    id: string
    name: string
    email: string
    message: string
    status: string
    createdAt: string
}

export default function AdminContactPage() {
    const { showToast } = useToast()
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchSubmissions()
    }, [])

    async function fetchSubmissions() {
        const res = await fetch('/api/contact')
        const data = await res.json()
        setSubmissions(data)
        setLoading(false)
    }

    function exportToCSV() {
        const headers = ['Name', 'Email', 'Message', 'Status', 'Date']
        const rows = submissions.map(sub => [
            sub.name,
            sub.email,
            sub.message.replace(/"/g, '""'), // Escape quotes
            sub.status,
            new Date(sub.createdAt).toLocaleString()
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        a.click()
        URL.revokeObjectURL(url)
        showToast('Export started successfully!', 'success')
    }

    const handleCopyEmail = () => {
        if (selectedMessage) {
            navigator.clipboard.writeText(selectedMessage.email)
            setCopied(true)
            showToast('Email copied to clipboard', 'success')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <button
                    onClick={exportToCSV}
                    className="bg-[#2E8B57] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Download size={20} />
                    Export to CSV
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Message</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission) => (
                                <tr key={submission.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{submission.name}</td>
                                    <td className="p-4 text-gray-600">
                                        <a href={`mailto:${submission.email}`} className="text-[#6E8C82] hover:underline flex items-center gap-1">
                                            <Mail size={16} />
                                            {submission.email}
                                        </a>
                                    </td>
                                    <td className="p-4 text-gray-700 max-w-md">
                                        <p className="line-clamp-2">{submission.message}</p>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm whitespace-nowrap">
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedMessage(submission)}
                                            className="text-[#6E8C82] hover:text-[#587068] flex items-center gap-1 text-sm font-medium transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Full
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {submissions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No contact submissions yet.
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">From:</label>
                                <p className="text-gray-900 font-medium">{selectedMessage.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Email:</label>
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="text-[#6E8C82] hover:underline flex items-center gap-2"
                                >
                                    <Mail size={18} />
                                    {selectedMessage.email}
                                </a>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Message:</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
                            <button
                                onClick={handleCopyEmail}
                                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                                {copied ? 'Copied!' : 'Copy Email'}
                            </button>
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Re: Contact Form Submission`}
                                className="flex-1 bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <Mail size={20} />
                                Reply via Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
