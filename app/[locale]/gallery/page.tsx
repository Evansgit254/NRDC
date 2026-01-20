import { prisma } from '@/lib/prisma'
import { Images } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 1800

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const images = await prisma.galleryImage.findMany({
        include: {
            translations: {
                where: { locale }
            }
        },
        orderBy: { createdAt: 'desc' },
    })

    const translatedImages = images.map(image => ({
        ...image,
        caption: image.translations?.[0]?.caption || image.caption
    }))

    return (
        <div className="pb-16">
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Photo Gallery</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/80">
                        Moments of hope, resilience, and transformation from our communities.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {translatedImages.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-6">
                        {translatedImages.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-200 w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px]"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${image.url}")` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    {image.caption && (
                                        <p className="text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {image.caption}
                                        </p>
                                    )}
                                </div>
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
