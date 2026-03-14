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
    if (initialized.current) return;
    initialized.current = true;

    console.log('GoogleTranslate component mounted');

    window.googleTranslateElementInit = () => {
      console.log('googleTranslateElementInit called');
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // Temporarily removing layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            // to see if the default layout shows up.
          },
          'google_translate_element'
        );
        console.log('TranslateElement initialized successfully');
      } catch (error) {
        console.error('Error initializing TranslateElement:', error);
      }
    };

    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      console.log('Loading Google Translate script');
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.body.appendChild(script);
    } else {
      console.log('Google Translate script already exists');
      if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
      }
    }
  }, []);

  return (
    <div className="flex items-center gap-2 border border-red-500 min-w-[100px] min-h-[40px]">
      <div id="google_translate_element" className="google-translate-container" />
      <style jsx global>{`
        /* Temporarily disable hiding CSS to see the widget */
        /*
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon {
          display: none !important;
        }
        */
        body {
          top: 0 !important;
        }
        .google-translate-container {
          min-height: 40px;
          display: flex !important;
          align-items: center !important;
        }
      `}</style>
    </div>
  );
}
