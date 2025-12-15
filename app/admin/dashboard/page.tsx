'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { FileText, BookOpen, Image, Mail, TrendingUp, Activity, Users, Sparkles } from 'lucide-react'

interface Analytics {
    stats: {
        totalBlogs: number
        publishedBlogs: number
        totalPrograms: number
        totalTeamMembers: number
        totalGalleryImages: number
        totalResources: number
        totalTestimonials: number
        approvedTestimonials: number
        totalContacts: number
        newContacts: number
    }
    activityData: Array<{ date: string; count: number }>
    topCategories: Array<{ name: string; value: number }>
}

const COLORS = ['#6E8C82', '#2E8B57', '#FF8042', '#FFBB28', '#00C49F']

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    async function fetchAnalytics() {
        const res = await fetch('/api/analytics')
        if (res.ok) {
            const data = await res.json()
            setAnalytics(data)
        }
        setLoading(false)
    }

    if (loading) {
        return <div className="text-center py-12">Loading analytics...</div>
    }

    if (!analytics) {
        return <div className="text-center py-12 text-red-600">Failed to load analytics</div>
    }

    const statCards = [
        { label: 'Blog Posts', value: `${analytics.stats.publishedBlogs}/${analytics.stats.totalBlogs}`, subtext: 'Published', icon: BookOpen, color: 'bg-purple-500' },
        { label: 'Programs', value: analytics.stats.totalPrograms, subtext: 'Active', icon: FileText, color: 'bg-[#6E8C82]/100' },
        { label: 'Gallery', value: analytics.stats.totalGalleryImages, subtext: 'Images', icon: Image, color: 'bg-green-500' },
        { label: 'Team', value: analytics.stats.totalTeamMembers, subtext: 'Members', icon: Users, color: 'bg-orange-500' },
        { label: 'Testimonials', value: `${analytics.stats.approvedTestimonials}/${analytics.stats.totalTestimonials}`, subtext: 'Approved', icon: Sparkles, color: 'bg-pink-500' },
        { label: 'Contacts', value: analytics.stats.newContacts, subtext: `${analytics.stats.totalContacts} Total`, icon: Mail, color: 'bg-red-500' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your NRDC overview</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity size={16} className="text-green-600" />
                    <span>Analytics</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={20} className="text-[#6E8C82]" />
                        <h2 className="text-xl font-bold text-gray-900">Content Activity (Last 7 Days)</h2>
                    </div>
                    {analytics.activityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                    formatter={(value) => [`${value} posts`, 'Count']}
                                />
                                <Bar dataKey="count" fill="#6E8C82" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-500">No activity data yet</div>
                    )}
                </div>

                {/* Top Categories Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen size={20} className="text-[#2E8B57]" />
                        <h2 className="text-xl font-bold text-gray-900">Top Blog Categories</h2>
                    </div>
                    {analytics.topCategories.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.topCategories}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string, percent?: number }) => `${name || 'Unknown'} (${((percent || 0) * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.topCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-500">No category data yet</div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-[#6E8C82] to-[#2E8B57] rounded-xl shadow-sm p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/admin/blog" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors backdrop-blur-sm">
                        <BookOpen size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">New Blog Post</p>
                    </a>
                    <a href="/admin/programs" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors backdrop-blur-sm">
                        <FileText size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Add Program</p>
                    </a>
                    <a href="/admin/contact" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors backdrop-blur-sm">
                        <Mail size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">View Messages</p>
                    </a>
                    <a href="/admin/gallery" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors backdrop-blur-sm">
                        <Image size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Upload Image</p>
                    </a>
                </div>
            </div>
        </div>
    )
}
