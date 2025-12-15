import { prisma } from '@/lib/prisma'
import { Images } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 1800

export default async function GalleryPage() {
    const images = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="pb-16">
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">Photo Gallery</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/80 animate-fadeInUp animation-delay-200">
                        Moments of hope, resilience, and transformation from our communities.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((image: { id: string; url: string; caption: string | null }) => (
                            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow bg-gray-200 hover-scale">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundImage: `url("${image.url}")` }}
                                />
                                {image.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-sm">{image.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12 animate-fadeIn">
                        <Images size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No images in the gallery yet.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
