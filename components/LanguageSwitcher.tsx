'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial check for admin path - usually this causes hydration mismatch if done naively
    // but returning null should be safe if we want to hide it completely.
    if (pathname.startsWith('/admin')) {
        return null;
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onSelectChange = (nextLocale: string) => {
        setIsOpen(false); // Close dropdown immediately

        startTransition(() => {
            // Replace the locale in the pathname
            // e.g. /en/about -> /fr/about
            // or /about -> /fr/about (if default locale is hidden)

            let newPath = pathname;
            const segments = pathname.split('/');

            // Check if the first segment is a locale
            if (['en', 'fr', 'es', 'ar', 'sw'].includes(segments[1])) {
                segments[1] = nextLocale;
                newPath = segments.join('/');
            } else {
                newPath = `/${nextLocale}${pathname}`;
            }

            router.replace(newPath);
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#6E8C82] transition-colors p-2 rounded-lg hover:bg-gray-50"
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <Globe size={20} />
                <span className="uppercase font-medium">{locale}</span>
                <ChevronDown
                    size={16}
                    className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    <button
                        onClick={() => onSelectChange('en')}
                        disabled={isPending}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${locale === 'en' ? 'text-[#6E8C82] font-bold bg-[#6E8C82]/10' : 'text-gray-700'
                            }`}
                    >
                        <span>English</span>
                        {locale === 'en' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                        onClick={() => onSelectChange('fr')}
                        disabled={isPending}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${locale === 'fr' ? 'text-[#6E8C82] font-bold bg-[#6E8C82]/10' : 'text-gray-700'
                            }`}
                    >
                        <span>Français</span>
                        {locale === 'fr' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                        onClick={() => onSelectChange('es')}
                        disabled={isPending}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${locale === 'es' ? 'text-[#6E8C82] font-bold bg-[#6E8C82]/10' : 'text-gray-700'
                            }`}
                    >
                        <span>Español</span>
                        {locale === 'es' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                        onClick={() => onSelectChange('ar')}
                        disabled={isPending}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${locale === 'ar' ? 'text-[#6E8C82] font-bold bg-[#6E8C82]/10' : 'text-gray-700'
                            }`}
                    >
                        <span>العربية</span>
                        {locale === 'ar' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                        onClick={() => onSelectChange('sw')}
                        disabled={isPending}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${locale === 'sw' ? 'text-[#6E8C82] font-bold bg-[#6E8C82]/10' : 'text-gray-700'
                            }`}
                    >
                        <span>Kiswahili</span>
                        {locale === 'sw' && <span className="text-xs">✓</span>}
                    </button>
                </div>
            )}
        </div>
    );
}
