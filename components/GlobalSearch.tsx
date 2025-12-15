'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, X, FileText, BookOpen, Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    type: 'Blog Post' | 'Program' | 'Site Content'
    title: string
    subtitle?: string
    url: string
    badge?: string
}

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()

    // Handle Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
                setQuery('')
                setResults([])
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Handle arrow navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(i => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(i => Math.max(i - 1, 0))
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault()
                navigateTo(results[selectedIndex])
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, results, selectedIndex])

    // Search function
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        setLoading(true)
        const timer = setTimeout(async () => {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            if (res.ok) {
                const data = await res.json()
                setResults(data.results)
                setSelectedIndex(0)
            }
            setLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const navigateTo = useCallback((result: SearchResult) => {
        router.push(result.url)
        setIsOpen(false)
        setQuery('')
        setResults([])
    }, [router])

    const getIcon = (type: string) => {
        switch (type) {
            case 'Blog Post': return BookOpen
            case 'Program': return FileText
            case 'Site Content': return Edit3
            default: return Search
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24 px-4" onClick={() => setIsOpen(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search blogs, programs, content... (Cmd+K)"
                        className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {loading && (
                        <div className="p-8 text-center text-gray-500">Searching...</div>
                    )}

                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No results found</div>
                    )}

                    {!loading && query.length < 2 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Type at least 2 characters to search
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="divide-y divide-gray-100">
                            {results.map((result, index) => {
                                const Icon = getIcon(result.type)
                                return (
                                    <button
                                        key={result.id}
                                        onClick={() => navigateTo(result)}
                                        className={`w-full text-left p-4 flex items-center gap-4 transition-colors ${index === selectedIndex ? 'bg-[#6E8C82]/10' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Icon size={20} className="text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900 truncate">{result.title}</p>
                                                {result.badge && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${result.badge === 'Published'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {result.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {result.subtitle && (
                                                <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">{result.type}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>ESC Close</span>
                    </div>
                    <span>{results.length} results</span>
                </div>
            </div>
        </div>
    )
}
