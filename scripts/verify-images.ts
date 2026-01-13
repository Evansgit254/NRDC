import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Blog Posts ---')
    const posts = await prisma.blogPost.findMany({
        select: { id: true, title: true, slug: true, image: true }
    })
    posts.forEach(p => {
        console.log(`[${p.slug}] Image: ${p.image}`)
    })

    console.log('\n--- Gallery Images ---')
    const gallery = await prisma.galleryImage.findMany({
        select: { id: true, caption: true, url: true }
    })
    gallery.forEach(g => {
        console.log(`[${g.caption}] URL: ${g.url}`)
    })

    console.log('\n--- Programs ---')
    const programs = await prisma.program.findMany({
        select: { slug: true, photos: true }
    })
    programs.forEach(p => {
        console.log(`[${p.slug}] Photos: ${p.photos}`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
