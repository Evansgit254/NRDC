'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Briefcase, CheckCircle2, Circle } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'
import clsx from 'clsx'

interface Vacancy {
    id: string
    title: string
    type: 'PRO' | 'VOLUNTEER'
    location: string
    duration: string
    responsibilities: string[]
    requirements: {
        education: string[]
        experience: string[]
    }
    skills: string[]
    active: boolean
}

const emptyVacancy: Vacancy = {
    id: '',
    title: '',
    type: 'VOLUNTEER',
    location: 'Remote / Nairobi, Kenya',
    duration: 'Ongoing',
    responsibilities: [''],
    requirements: {
        education: [''],
        experience: ['']
    },
    skills: [''],
    active: true
}

export default function AdminCareersPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editing, setEditing] = useState<Vacancy | null>(null)

    useEffect(() => {
        fetchVacancies()
    }, [])

    async function fetchVacancies() {
        try {
            const res = await fetch('/api/content?keys=volunteer_vacancies')
            const data = await res.json()
            if (data.volunteer_vacancies) {
                const parsed = JSON.parse(data.volunteer_vacancies)
                setVacancies(Array.isArray(parsed) ? parsed : [])
            }
        } catch (error) {
            console.error('Error fetching vacancies:', error)
        } finally {
            setLoading(false)
        }
    }

    async function saveAllVacancies(updatedList: Vacancy[]) {
        setSaving(true)
        try {
            await fetch('/api/content/volunteer_vacancies', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: JSON.stringify(updatedList) }),
            })
            setVacancies(updatedList)
            showToast('Vacancies updated successfully!', 'success')
        } catch (error) {
            console.error('Error saving vacancies:', error)
            showToast('Failed to save vacancies', 'error')
        } finally {
            setSaving(false)
        }
    }

    const startAdd = () => {
        setEditing({ ...emptyVacancy, id: Date.now().toString() })
    }

    const startEdit = (vacancy: Vacancy) => {
        setEditing({ ...vacancy })
    }

    const handleDelete = async (id: string) => {
        if (await confirm('Are you sure you want to delete this vacancy?')) {
            const newList = vacancies.filter(v => v.id !== id)
            saveAllVacancies(newList)
        }
    }

    const handleToggleActive = (id: string) => {
        const newList = vacancies.map(v => v.id === id ? { ...v, active: !v.active } : v)
        saveAllVacancies(newList)
    }

    const saveEdit = () => {
        if (!editing) return
        const exists = vacancies.find(v => v.id === editing.id)
        let newList: Vacancy[]
        if (exists) {
            newList = vacancies.map(v => v.id === editing.id ? editing : v)
        } else {
            newList = [...vacancies, editing]
        }
        saveAllVacancies(newList)
        setEditing(null)
    }

    const updateField = (field: string, value: any) => {
        if (!editing) return
        setEditing({ ...editing, [field]: value })
    }

    const updateNestedField = (parent: 'requirements', child: string, value: any) => {
        if (!editing) return
        setEditing({
            ...editing,
            [parent]: { ...editing[parent], [child]: value }
        })
    }

    const addListItem = (list: string[], setFn: (newList: string[]) => void) => {
        setFn([...list, ''])
    }

    const removeListItem = (list: string[], index: number, setFn: (newList: string[]) => void) => {
        const newList = [...list]
        newList.splice(index, 1)
        setFn(newList)
    }

    const updateListItem = (list: string[], index: number, value: string, setFn: (newList: string[]) => void) => {
        const newList = [...list]
        newList[index] = value
        setFn(newList)
    }

    if (loading) return <div className="p-8 text-center italic">Loading vacancies...</div>

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Briefcase className="text-[#6E8C82]" size={32} />
                        Careers Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage professional and volunteer openings</p>
                </div>
                {!editing && (
                    <button
                        onClick={startAdd}
                        className="bg-[#6E8C82] hover:bg-[#587068] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:scale-105"
                    >
                        <Plus size={20} />
                        Add New Position
                    </button>
                )}
            </div>

            {editing ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            {vacancies.find(v => v.id === editing.id) ? 'Edit Position' : 'New Position'}
                        </h2>
                        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={editing.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                    placeholder="e.g. Business Development Manager"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                <select
                                    value={editing.type}
                                    onChange={(e) => updateField('type', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                >
                                    <option value="VOLUNTEER">Volunteer</option>
                                    <option value="PRO">Professional / Paid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editing.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                                <input
                                    type="text"
                                    value={editing.duration}
                                    onChange={(e) => updateField('duration', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                />
                            </div>
                        </div>

                        {/* List Sections */}
                        {[
                            { label: 'Responsibilities', field: 'responsibilities' },
                            { label: 'Education Requirements', field: 'education', nested: 'requirements' },
                            { label: 'Experience Requirements', field: 'experience', nested: 'requirements' },
                            { label: 'Key Skills', field: 'skills' }
                        ].map((section) => (
                            <div key={section.label} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">{section.label}</h3>
                                    <button
                                        onClick={() => {
                                            const list = section.nested
                                                ? (editing as any).requirements[section.field]
                                                : (editing as any)[section.field]
                                            const setFn = (newList: string[]) => {
                                                if (section.nested) updateNestedField('requirements', section.field, newList)
                                                else updateField(section.field, newList)
                                            }
                                            addListItem(list, setFn)
                                        }}
                                        className="text-[#6E8C82] hover:text-[#587068] text-sm font-bold flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {(section.nested ? (editing as any).requirements[section.field] : (editing as any)[section.field]).map((item: string, idx: number) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const list = section.nested
                                                        ? (editing as any).requirements[section.field]
                                                        : (editing as any)[section.field]
                                                    const setFn = (newList: string[]) => {
                                                        if (section.nested) updateNestedField('requirements', section.field, newList)
                                                        else updateField(section.field, newList)
                                                    }
                                                    updateListItem(list, idx, e.target.value, setFn)
                                                }}
                                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    const list = section.nested
                                                        ? (editing as any).requirements[section.field]
                                                        : (editing as any)[section.field]
                                                    const setFn = (newList: string[]) => {
                                                        if (section.nested) updateNestedField('requirements', section.field, newList)
                                                        else updateField(section.field, newList)
                                                    }
                                                    removeListItem(list, idx, setFn)
                                                }}
                                                className="text-red-400 hover:text-red-600 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="bg-[#6E8C82] hover:bg-[#587068] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save Position'}
                            </button>
                            <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="space-y-4">
                {vacancies.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">No vacancies found. Start by adding one!</p>
                    </div>
                ) : (
                    vacancies.map((v) => (
                        <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#6E8C82]/30 transition-all">
                            <div className="flex items-center gap-6">
                                <div className={clsx(
                                    "p-4 rounded-2xl",
                                    v.active ? "bg-green-50 text-[#2E8B57]" : "bg-gray-50 text-gray-400"
                                )}>
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{v.title}</h3>
                                        <span className={clsx(
                                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                                            v.type === 'PRO' ? "border-blue-200 text-blue-600 bg-blue-50" : "border-green-200 text-green-600 bg-green-50"
                                        )}>
                                            {v.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{v.location} • {v.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleToggleActive(v.id)}
                                    className={clsx(
                                        "p-2 rounded-lg transition-colors",
                                        v.active ? "text-[#2E8B57] bg-green-50" : "text-gray-400 bg-gray-50"
                                    )}
                                    title={v.active ? "Deactivate" : "Activate"}
                                >
                                    {v.active ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                </button>
                                <button
                                    onClick={() => startEdit(v)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(v.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
