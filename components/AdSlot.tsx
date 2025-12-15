'use client';

import { useEffect, useState } from 'react';

interface AdSlotProps {
    placement: string;
    className?: string;
}

interface Ad {
    id: string;
    code: string;
    type: string;
}

export default function AdSlot({ placement, className }: AdSlotProps) {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Fetch all ads for this placement
        fetch(`/api/ads?placement=${placement}`)
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => {
                if (data && data.ad) {
                    // Store as array for potential rotation
                    setAds([data.ad]);
                    setIsVisible(true);

                    // Track impression
                    fetch(`/api/ads/track`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ adId: data.ad.id, type: 'impression' })
                    });
                }
            })
            .catch(err => console.error('Error loading ad:', err));
    }, [placement]);

    // Auto-rotate ads if multiple (future enhancement)
    useEffect(() => {
        if (ads.length > 1) {
            const interval = setInterval(() => {
                setIsAnimating(true);
                setTimeout(() => {
                    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
                    setIsAnimating(false);
                }, 300);
            }, 8000); // Rotate every 8 seconds

            return () => clearInterval(interval);
        }
    }, [ads.length]);

    if (!isVisible || ads.length === 0) return null;

    const currentAd = ads[currentAdIndex];

    const handleAdClick = () => {
        // Track click
        fetch(`/api/ads/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: currentAd.id, type: 'click' })
        }).catch(err => console.error('Error tracking click:', err));
    };

    return (
        <div
            className={`ad-container relative cursor-pointer ${className || ''}`}
            data-ad-placement={placement}
            onClick={handleAdClick}
        >
            {/* Advertisement label */}
            <div className="text-xs text-gray-400 text-center mb-2 uppercase tracking-wide">
                Advertisement
            </div>

            {/* Ad content with animations */}
            <div
                className={`
                    transform transition-all duration-500 ease-out
                    ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                    hover:scale-[1.02] hover:shadow-2xl
                    rounded-lg overflow-hidden
                `}
                style={{
                    animation: 'fadeInUp 0.6s ease-out'
                }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: currentAd.code }}
                    className="flex justify-center"
                />
            </div>

            {/* Add keyframe animation */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
