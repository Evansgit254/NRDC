'use client'

import VolunteerForm from '@/components/VolunteerForm'
import { Heart, Handshake, Users } from 'lucide-react'
import Link from 'next/link'

export default function GetInvolvedPage() {
    return (
        <div className="pb-16">
            <section className="bg-[#2E8B57] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
                        <p className="text-xl max-w-3xl mx-auto text-green-100">
                            Join us in making a difference. Your time, skills, and support can change lives.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ways to Support</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-[#6E8C82]/20 p-3 rounded-full text-[#6E8C82] h-fit">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Donate</h3>
                                    <p className="text-gray-600 mb-4">
                                        Your financial contribution directly supports our nutrition and health programs. Every dollar counts.
                                    </p>
                                    <Link
                                        href="/donate"
                                        className="text-[#6E8C82] font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        View Donation Options &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-[#2E8B57] h-fit">
                                    <Handshake size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Partner With Us</h3>
                                    <p className="text-gray-600 mb-4">
                                        We collaborate with organizations, governments, and businesses to amplify our impact.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="text-[#6E8C82] font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        Become a Partner &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600 h-fit">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Volunteer</h3>
                                    <p className="text-gray-600">
                                        Share your skills and time. We are always looking for passionate individuals to join our team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Application</h2>
                        <VolunteerForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

