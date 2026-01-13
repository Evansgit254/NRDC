'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, User, Shield, Edit, X, Check } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useConfirm } from '@/components/ConfirmDialog'

interface UserData {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

const ROLES = ['ADMIN', 'EDITOR', 'VIEWER']

export default function AdminUsersPage() {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editRole, setEditRole] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EDITOR'
    })
    const [error, setError] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const res = await fetch('/api/users')
        if (res.ok) {
            const data = await res.json()
            setUsers(data)
        }
        setLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            setShowForm(false)
            setFormData({ name: '', email: '', password: '', role: 'EDITOR' })
            fetchUsers()
            showToast('User created successfully!', 'success')
        } else {
            const data = await res.json()
            setError(data.error || 'Failed to create user')
        }
    }

    async function handleDelete(id: string, name: string) {
        const confirmed = await confirm(
            `Are you sure you want to delete ${name || 'this user'}? This action cannot be undone.`,
            'Delete User'
        )

        if (!confirmed) return

        const res = await fetch(`/api/users?id=${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            fetchUsers()
            showToast('User deleted successfully!', 'success')
        } else {
            const data = await res.json()
            showToast(data.error || 'Failed to delete user', 'error')
        }
    }

    async function handleUpdateRole(id: string) {
        const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, role: editRole }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            setEditingId(null)
            fetchUsers()
            showToast('User role updated successfully!', 'success')
        } else {
            const data = await res.json()
            showToast(data.error || 'Failed to update role', 'error')
        }
    }

    function startEditRole(user: UserData) {
        setEditingId(user.id)
        setEditRole(user.role)
    }

    function cancelEdit() {
        setEditingId(null)
        setEditRole('')
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#6E8C82] hover:bg-[#587068] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {/* Role Legend */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-medium">ADMIN</span>
                        <span className="text-gray-600">Full access to all features, user management, and settings</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="bg-[#6E8C82]/20 text-[#587068] px-2 py-1 rounded font-medium">EDITOR</span>
                        <span className="text-gray-600">Can create and edit content (blogs, programs, gallery)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">VIEWER</span>
                        <span className="text-gray-600">Read-only access to dashboard and analytics</span>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Create New User</h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="bg-[#2E8B57] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Create User
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-[#6E8C82]/10 p-3 rounded-full text-[#6E8C82]">
                                <User size={24} />
                            </div>

                            {editingId === user.id ? (
                                <div className="flex items-center gap-2">
                                    <select
                                        className="px-2 py-1 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-[#6E8C82] outline-none"
                                        value={editRole}
                                        onChange={e => setEditRole(e.target.value)}
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleUpdateRole(user.id)}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Save"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                        title="Cancel"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => startEditRole(user)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${user.role === 'ADMIN'
                                        ? 'bg-red-100 text-red-700'
                                        : user.role === 'EDITOR'
                                            ? 'bg-[#6E8C82]/20 text-[#587068]'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}
                                    title="Click to edit role"
                                >
                                    <Shield size={12} />
                                    {user.role}
                                    <Edit size={10} className="ml-1" />
                                </button>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{user.name || 'Unnamed User'}</h3>
                        <p className="text-gray-600 text-sm mb-4">{user.email}</p>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No users found. Click &quot;Add User&quot; to create one.
                </div>
            )}
        </div>
    )
}
