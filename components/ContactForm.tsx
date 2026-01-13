'use client'

import { useState, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactForm() {
    const t = useTranslations('contactForm')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            })

            if (res.ok) {
                setSuccess(true)
                formRef.current?.reset()
            }
        } catch (error) {
            console.error('Error submitting form', error)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">{t('successTitle')}</h3>
                <p>{t('successMessage')}</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm underline hover:text-green-900"
                >
                    {t('sendAnother')}
                </button>
            </div>
        )
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                <textarea
                    name="message"
                    id="message"
                    rows={6}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6E8C82] focus:border-transparent outline-none transition-all"
                ></textarea>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6E8C82] hover:bg-[#587068] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {t('send')}
            </button>
        </form>
    )
}
