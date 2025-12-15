'use client'

import { useEffect, useState } from 'react'
import { Edit3, Save, X } from 'lucide-react'
import { useToast } from '@/components/Toast'
import Editor from '@/components/Editor'

interface ContentItem {
    key: string
    value: string
    label: string
    description: string
    type: string
}

const contentItems: ContentItem[] = [
    {
        key: 'hero_title',
        value: '',
        label: 'Homepage Hero Title',
        description: 'Main heading on the homepage banner',
        type: 'TEXT',
    },
    {
        key: 'hero_subtitle',
        value: '',
        label: 'Homepage Hero Subtitle',
        description: 'Subtitle text below the main heading',
        type: 'TEXT',
    },
    {
        key: 'mission_statement',
        value: '',
        label: 'Mission Statement',
        description: 'Organization mission displayed on About page',
        type: 'RICH_TEXT',
    },
    {
        key: 'vision_statement',
        value: '',
        label: 'Vision Statement',
        description: 'Organization vision for the future',
        type: 'RICH_TEXT',
    },
]

export default function AdminContentPage() {
    const { showToast } = useToast()
    const [content, setContent] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [editing, setEditing] = useState<string | null>(null)
    const [editValue, setEditValue] = useState('')

    useEffect(() => {
        fetchContent()
    }, [])

    async function fetchContent() {
        const res = await fetch('/api/content')
        const data = await res.json()
        setContent(data)
        setLoading(false)
    }

    function startEdit(key: string) {
        setEditing(key)
        setEditValue(content[key] || '')
    }

    function cancelEdit() {
        setEditing(null)
        setEditValue('')
    }

    async function saveContent(key: string) {
        setSaving(key)
        try {
            const item = contentItems.find(i => i.key === key)
            await fetch(`/api/content/${key}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: editValue, type: item?.type || 'TEXT' }),
            })
            setContent({ ...content, [key]: editValue })
            setEditing(null)
            showToast('Content updated successfully!', 'success')
        } catch (error) {
            console.error('Error saving content:', error)
            showToast('Failed to save content', 'error')
        } finally {
            setSaving(null)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading site content...</div>
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Edit3 size={32} className="text-[#6E8C82]" />
                    Site Content Editor
                </h1>
                <p className="text-gray-600 mt-1">
                    Edit text content displayed across your website
                </p>
            </div>

            {/* Content Items */}
            <div className="space-y-6">
                {contentItems.map((item) => (
                    <div key={item.key} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{item.label}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            {editing !== item.key && (
                                <button
                                    onClick={() => startEdit(item.key)}
                                    className="bg-[#6E8C82]/10 hover:bg-[#6E8C82]/20 text-[#587068] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                            )}
                        </div>

                        {editing === item.key ? (
                            <div className="space-y-4">
                                {item.type === 'RICH_TEXT' ? (
                                    <Editor
                                        value={editValue}
                                        onChange={setEditValue}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                                    />
                                )}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => saveContent(item.key)}
                                        disabled={saving === item.key}
                                        className="bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving === item.key ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {content[item.key] || '(Not set)'}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-[#6E8C82]/10 border border-[#6E8C82]/30 rounded-lg">
                <p className="text-sm text-[#2C3B36]">
                    <strong>Note:</strong> Changes made here will be reflected across your website immediately.
                    Make sure to review your changes on the public pages.
                </p>
            </div>
        </div>
    )
}
