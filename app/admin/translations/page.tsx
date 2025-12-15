'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Save, Trash2, X } from 'lucide-react'

interface Translation {
    id: string
    namespace: string
    key: string
    locale: string
    value: string
}

export default function TranslationsPage() {
    const [translations, setTranslations] = useState<Translation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLocale, setSelectedLocale] = useState('en')
    const [selectedNamespace, setSelectedNamespace] = useState('')

    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [editValue, setEditValue] = useState('')

    const [isAdding, setIsAdding] = useState(false)
    const [newTranslation, setNewTranslation] = useState({
        namespace: 'common',
        key: '',
        locale: 'en',
        value: ''
    })

    useEffect(() => {
        fetchTranslations()
    }, [selectedLocale, selectedNamespace])

    async function fetchTranslations() {
        setLoading(true)
        try {
            let url = `/api/translations?locale=${selectedLocale}`
            if (selectedNamespace) url += `&namespace=${selectedNamespace}`

            const res = await fetch(url)
            const data = await res.json()
            setTranslations(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching translations:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave(id: string, key: string, namespace: string, locale: string, value: string) {
        try {
            const res = await fetch('/api/translations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, namespace, locale, value })
            })

            if (res.ok) {
                setTranslations(translations.map(t => t.id === id ? { ...t, value } : t))
                setIsEditing(null)
            }
        } catch (error) {
            console.error('Error saving translation:', error)
        }
    }

    async function handleAdd() {
        try {
            const res = await fetch('/api/translations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTranslation)
            })

            if (res.ok) {
                const added = await res.json()
                setTranslations([...translations, added])
                setIsAdding(false)
                setNewTranslation({ namespace: 'common', key: '', locale: 'en', value: '' })
            }
        } catch (error) {
            console.error('Error adding translation:', error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this translation?')) return

        try {
            const res = await fetch(`/api/translations?id=${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setTranslations(translations.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error('Error deleting translation:', error)
        }
    }

    const filteredTranslations = translations.filter(t =>
        t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.value.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Translations Management</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-[#6E8C82] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#587068] transition-colors"
                >
                    <Plus size={20} />
                    Add Translation
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search keys or values..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E8C82]"
                        />
                    </div>
                    <select
                        value={selectedLocale}
                        onChange={(e) => setSelectedLocale(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E8C82]"
                    >
                        <option value="en">English (en)</option>
                        <option value="fr">French (fr)</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Filter by namespace..."
                        value={selectedNamespace}
                        onChange={(e) => setSelectedNamespace(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E8C82]"
                    />
                </div>
            </div>

            {isAdding && (
                <div className="bg-[#6E8C82]/10 p-4 rounded-xl border border-blue-100 mb-6">
                    <h3 className="font-semibold mb-4">New Translation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Namespace (e.g. common)"
                            value={newTranslation.namespace}
                            onChange={(e) => setNewTranslation({ ...newTranslation, namespace: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Key (e.g. hero.title)"
                            value={newTranslation.key}
                            onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        />
                        <select
                            value={newTranslation.locale}
                            onChange={(e) => setNewTranslation({ ...newTranslation, locale: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Value"
                            value={newTranslation.value}
                            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-[#6E8C82] text-white rounded-lg hover:bg-[#587068]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Namespace</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Key</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading translations...</td>
                            </tr>
                        ) : filteredTranslations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No translations found.</td>
                            </tr>
                        ) : (
                            filteredTranslations.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">{t.namespace}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.key}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {isEditing === t.id ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#6E8C82]"
                                                autoFocus
                                            />
                                        ) : (
                                            t.value
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isEditing === t.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSave(t.id, t.key, t.namespace, t.locale, editValue)}
                                                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(null)}
                                                    className="text-gray-400 hover:bg-gray-100 p-1 rounded"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(t.id)
                                                        setEditValue(t.value)
                                                    }}
                                                    className="text-[#6E8C82] hover:bg-[#6E8C82]/10 p-1 rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
