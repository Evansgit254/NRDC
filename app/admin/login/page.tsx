'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await res.json()

            if (res.ok) {
                router.push('/admin/dashboard')
            } else {
                setError(result.error || 'Login failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6E8C82] via-[#2E8B57] to-[#6E8C82] animate-gradient-xy flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <Image
                        src="/images/nrdc-logo-v3.png"
                        alt="NRDC Logo"
                        width={240}
                        height={120}
                        className="h-24 w-auto mx-auto mb-4 rounded-xl"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Sign in to manage your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                required
                                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6E8C82] hover:bg-[#587068] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        Sign In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/admin/forgot-password"
                        className="text-sm text-[#6E8C82] hover:text-[#587068] font-medium transition-colors"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    )
}
