'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('nrdc_cookie_consent');
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('nrdc_cookie_consent', 'accepted');
        setIsVisible(false);
        // Here you would initialize analytics (e.g., GA, Pixel)
        // initializeAnalytics();
    };

    const handleDecline = () => {
        localStorage.setItem('nrdc_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideUp">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                <div className="flex items-start gap-4">
                    <div className="bg-[#6E8C82]/10 p-3 rounded-full text-[#6E8C82] flex-shrink-0">
                        <Cookie size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">We use cookies</h3>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                            We use cookies to enhance your experience, analyze site traffic, and support our humanitarian mission.
                            By clicking "Accept", you agree to our use of cookies. Read our{' '}
                            <Link href="/privacy-policy" className="text-[#6E8C82] font-semibold hover:underline">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center whitespace-nowrap"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2.5 rounded-lg bg-[#6E8C82] text-white font-medium hover:bg-[#587068] transition-colors shadow-lg shadow-[#6E8C82]/20 text-center whitespace-nowrap"
                    >
                        Accept Cookies
                    </button>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
