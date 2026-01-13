import { prisma } from './prisma'

export async function logAudit(
    action: string,
    entity: string,
    entityId: string | null = null,
    metadata: { userId?: string; details?: any } = {}
) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                userId: metadata.userId || null,
                details: metadata.details ? JSON.stringify(metadata.details) : null,
            },
        })
    } catch (error) {
        // Fallback to console if database logging fails to prevent breaking the main flow
        console.error('Failed to log audit:', error)
    }
}
