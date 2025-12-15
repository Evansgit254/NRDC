'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Clock, User, FileText } from 'lucide-react'

interface ErrorLog {
    id: string
    message: string
    stack?: string
    path?: string
    userId?: string
    createdAt: string
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<ErrorLog[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null)

    async function fetchLogs() {
        setLoading(true)
        try {
            const res = await fetch('/api/logs')
            const data = await res.json()
            setLogs(data)
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle size={32} className="text-red-600" />
                        System Logs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Monitor application errors and issues
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

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* Log List */}
                <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
                        Recent Errors
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {loading && logs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">Loading logs...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="flex justify-center mb-2">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                No errors found! System is healthy.
                            </div>
                        ) : (
                            logs.map((log) => (
                                <button
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${selectedLog?.id === log.id
                                            ? 'bg-red-50 border-red-200 shadow-sm'
                                            : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                        {log.path && (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">
                                                {log.path}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-medium text-gray-900 line-clamp-2 text-sm">
                                        {log.message}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Log Details */}
                <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
                        Error Details
                    </div>
                    <div className="overflow-y-auto flex-1 p-6">
                        {selectedLog ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {selectedLog.message}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {new Date(selectedLog.createdAt).toLocaleString()}
                                        </div>
                                        {selectedLog.path && (
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} />
                                                <code className="bg-gray-100 px-1 rounded">{selectedLog.path}</code>
                                            </div>
                                        )}
                                        {selectedLog.userId && (
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                User ID: {selectedLog.userId}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedLog.stack && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Stack Trace</h4>
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">
                                            {selectedLog.stack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Select an error log to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { CheckCircle } from 'lucide-react'
