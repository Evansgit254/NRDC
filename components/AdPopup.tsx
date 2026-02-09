'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface Ad {
    id: string
    code: string
    type: string
}

export default function AdPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [ad, setAd] = useState<Ad | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        // Don't show on admin pages
        if (pathname.startsWith('/admin')) return

        const checkAndFetchAd = async () => {
            // Check session storage first
            const hasSeenPopup = sessionStorage.getItem('popup_ad_seen')
            if (hasSeenPopup) return

            try {
                const res = await fetch('/api/ads?placement=HOME_POPUP')
                if (!res.ok) return

                const data = await res.json()
                if (data && data.ad) {
                    setAd(data.ad)

                    // Delay showing the popup for a smoother experience
                    setTimeout(() => {
                        setIsVisible(true)

                        // Track impression
                        fetch('/api/ads/track', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ adId: data.ad.id, type: 'impression' })
                        }).catch(e => console.error('Track error:', e))
                    }, 2000)
                }
            } catch (error) {
                console.error('Failed to load popup ad:', error)
            }
        }

        checkAndFetchAd()
    }, [pathname])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('popup_ad_seen', 'true')
    }

    const handleAdClick = () => {
        if (!ad) return

        // Track click
        fetch('/api/ads/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: ad.id, type: 'click' })
        }).catch(e => console.error('Track click error:', e))

        handleClose()
    }

    if (!ad) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-12 right-0 md:-right-12 p-2 text-white/80 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>

                        {/* Ad Content */}
                        <div
                            onClick={handleAdClick}
                            className="cursor-pointer"
                            dangerouslySetInnerHTML={{ __html: ad.code }}
                        />

                        <div className="text-center mt-4">
                            <button
                                onClick={handleClose}
                                className="text-white/60 hover:text-white text-sm underline decoration-dotted underline-offset-4 transition-colors"
                            >
                                No thanks, maybe later
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
