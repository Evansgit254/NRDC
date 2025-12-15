'use client'

import { useEffect, useState } from 'react'
import { Activity, RefreshCw, Clock, User, FileText, PlusCircle, Edit2, Trash2, LogIn } from 'lucide-react'

interface AuditLog {
    id: string
    action: string
    entity: string
    entityId: string | null
    details: string | null
    userId: string | null
    createdAt: string
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchLogs() {
        setLoading(true)
        try {
            const res = await fetch('/api/audit')
            const data = await res.json()
            // Ensure data is an array before setting
            setLogs(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch audit logs:', error)
            setLogs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    function getActionIcon(action: string) {
        switch (action) {
            case 'CREATE': return <PlusCircle size={16} className="text-green-600" />
            case 'UPDATE': return <Edit2 size={16} className="text-[#6E8C82]" />
            case 'DELETE': return <Trash2 size={16} className="text-red-600" />
            case 'LOGIN': return <LogIn size={16} className="text-purple-600" />
            default: return <Activity size={16} className="text-gray-600" />
        }
    }

    function getActionColor(action: string) {
        switch (action) {
            case 'CREATE': return 'bg-green-50 border-green-200 text-green-700'
            case 'UPDATE': return 'bg-[#6E8C82]/10 border-[#6E8C82]/30 text-[#587068]'
            case 'DELETE': return 'bg-red-50 border-red-200 text-red-700'
            case 'LOGIN': return 'bg-purple-50 border-purple-200 text-purple-700'
            default: return 'bg-gray-50 border-gray-200 text-gray-700'
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity size={32} className="text-[#6E8C82]" />
                        Audit Logs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track administrative actions and changes
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden flex-1">
                <div className="overflow-y-auto flex-1 p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700 w-48">Timestamp</th>
                                <th className="p-4 font-semibold text-gray-700 w-32">Action</th>
                                <th className="p-4 font-semibold text-gray-700 w-32">Entity</th>
                                <th className="p-4 font-semibold text-gray-700 w-48">User</th>
                                <th className="p-4 font-semibold text-gray-700">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">Loading logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">No audit logs found.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)}
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-800">
                                            {log.entity}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {log.userId ? (
                                                <span className="flex items-center gap-1.5">
                                                    <User size={14} className="text-gray-400" />
                                                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{log.userId.substring(0, 8)}...</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">System</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {log.details && (
                                                <code className="bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs font-mono block overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
                                                    {log.details}
                                                </code>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
