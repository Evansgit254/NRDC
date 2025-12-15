import { prisma } from '@/lib/prisma';

interface AuditContext {
    userId?: string;
    details?: any;
}

export async function logAudit(
    action: string,
    entity: string,
    entityId: string | null,
    context: AuditContext = {}
) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details: context.details ? JSON.stringify(context.details) : null,
                userId: context.userId,
            },
        });
    } catch (error) {
        console.error('❌ Failed to log audit:', error);
    }
}
