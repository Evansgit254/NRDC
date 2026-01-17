'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SeedTranslationsPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSeed() {
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const res = await fetch('/api/admin/seed-translations', {
                method: 'POST',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to seed translations')
            }

            setResult(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Seed Program Translations
                    </h1>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-900 font-medium mb-2">
                            ℹ️ What does this do?
                        </p>
                        <p className="text-blue-800 text-sm">
                            This will add Spanish and Arabic translations for all programs in the database.
                            You only need to run this <strong>once</strong> to fix the language switching issue.
                        </p>
                    </div>

                    <button
                        onClick={handleSeed}
                        disabled={loading || !!result}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${loading || result
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Seeding Translations...' : result ? '✓ Already Seeded' : 'Seed Translations Now'}
                    </button>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-900 font-medium">Error:</p>
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-900 font-medium mb-2">
                                ✓ Success!
                            </p>
                            <p className="text-green-800 text-sm mb-2">
                                {result.message}
                            </p>
                            <p className="text-green-700 text-xs">
                                {result.details}
                            </p>
                            <button
                                onClick={() => router.push('/admin/programs')}
                                className="mt-4 text-green-700 underline hover:text-green-800"
                            >
                                Go to Programs →
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-sm text-gray-600">
                        <p className="mb-2"><strong>Programs that will be translated:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Emergency Nutrition</li>
                            <li>Community Gardens</li>
                            <li>Mobile Health Clinics</li>
                        </ul>
                        <p className="mt-4"><strong>Languages:</strong> French, Spanish, Arabic</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
