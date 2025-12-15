import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, BarChart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const program = await prisma.program.findUnique({
        where: { slug },
    })

    if (!program) {
        notFound()
    }

    const objectives = JSON.parse(program.objectives || '[]')
    const metrics = JSON.parse(program.metrics || '{}')
    const photos = JSON.parse(program.photos || '[]')

    return (
        <div className="pb-16">
            <section className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/programs" className="inline-flex items-center text-gray-600 hover:text-[#6E8C82] mb-8">
                        <ArrowLeft size={16} className="mr-2" /> Back to Programs
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{program.title}</h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="prose max-w-none mb-12">
                            <h2 className="text-2xl font-bold text-[#6E8C82] mb-4">About the Program</h2>
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-[#6E8C82] mb-6">Key Objectives</h2>
                            <ul className="space-y-4">
                                {objectives.map((obj: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="text-[#2E8B57] mt-1 flex-shrink-0" size={20} />
                                        <span className="text-gray-700 text-lg">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <BarChart className="text-[#6E8C82]" /> Impact Metrics
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(metrics).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="text-3xl font-bold text-[#2E8B57]">{String(value)}</div>
                                        <div className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
