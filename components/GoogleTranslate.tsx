'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations in development
    if (initialized.current) return;
    initialized.current = true;

    // Define the initialization function for Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Load the Google Translate script if it hasn't been loaded already
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="google-translate-container" />
      <style jsx global>{`
        /* Hide the Google Translate branding and header if possible */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .google-translate-container {
          min-height: 40px;
          display: flex;
          align-items: center;
        }
        /* Customize the dropdown style slightly to match the theme */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid #e5e7eb !important;
          padding: 4px 8px !important;
          border-radius: 0.5rem !important;
          font-family: inherit !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .goog-te-menu-value {
          margin: 0 !important;
          color: #4b5563 !important;
          font-weight: 500 !important;
        }
        .goog-te-menu-value span {
          color: #4b5563 !important;
        }
        .goog-te-gadget-simple img {
            display: none !important;
        }
        .goog-te-menu-value:before {
            content: "🌐";
            margin-right: 4px;
        }
      `}</style>
    </div>
  );
}
