import React from 'react';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#6E8C82] py-8 px-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-[#6E8C82]/10 text-white/80">Last Updated: December 2025</p>
                </div>

                <div className="p-8 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">1. Introduction</h2>
                        <p>
                            Welcome to the Nutrition Relief & Development Centre (NRDC). We are committed to protecting
                            your privacy and ensuring the security of your personal information. This Privacy Policy
                            outlines how we collect, use, and safeguard your data when you visit our website or
                            engage with our programs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">2. Information We Collect</h2>
                        <p className="mb-4">We collect information that helps us provide better support and communicate effectively with our donors and community members:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and location when you donate or subscribe.</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website, including IP address, browser type, and pages visited.</li>
                            <li><strong>Cookies:</strong> Small data files stored on your device to enhance site functionality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To process donations and issue receipts.</li>
                            <li>To send updates about our programs, impact stories, and newsletters (with your consent).</li>
                            <li>To improve our website functionality and user experience.</li>
                            <li>To comply with legal obligations and ensure security.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">4. Cookies and Tracking</h2>
                        <p>
                            We use cookies to analyze site traffic and personalize content. You can choose to accept or
                            decline cookies through our Cookie Consent banner. Essential cookies may remain active
                            to ensure the website functions correctly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information
                            from unauthorized access, alteration, disclosure, or destruction. However, no internet
                            transmission is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">6. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access usage data we hold about you.</li>
                            <li>Request correction of inaccurate information.</li>
                            <li>Request deletion of your data (subject to legal retention requirements).</li>
                            <li>Opt-out of marketing communications at any time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="font-semibold text-[#6E8C82]">Nutrition Relief & Development Centre</p>
                            <p>Email: nrdcofficial12@gmail.com</p>
                            <p>Phone: +254 727 001 702 / +254 702 121 310</p>
                            <p>Address: Nairobi, Kenya</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
