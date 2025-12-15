'use client'

import { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'

export default function TestimonialForm() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [rating, setRating] = useState(5)
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: '',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    rating,
                }),
            })

            if (res.ok) {
                setSubmitted(true)
                setFormData({ name: '', role: '', message: '' })
                setRating(5)
            } else {
                alert('Failed to submit testimonial. Please try again.')
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-700 mb-4">
                    Your testimonial has been submitted and is pending admin approval.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#6E8C82] font-semibold hover:underline"
                >
                    Submit Another Testimonial
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role/Affiliation (Optional)
                </label>
                <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                    placeholder="e.g., Community Member, Volunteer"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Testimonial *
                </label>
                <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent"
                    placeholder="Share your experience with NRDC..."
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6E8C82] hover:bg-[#587068] text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Testimonial'}
            </button>

            <p className="text-sm text-gray-600 text-center">
                Your testimonial will be reviewed by our team before being published.
            </p>
        </form>
    )
}
