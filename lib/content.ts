import { prisma } from '@/lib/prisma'

export async function getContent(key: string, defaultValue: string) {
    try {
        const content = await prisma.pageContent.findUnique({
            where: { key },
        })
        return content?.value || defaultValue
    } catch (error) {
        return defaultValue
    }
}
