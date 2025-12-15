import { prisma } from '@/lib/prisma';

interface ErrorContext {
    path?: string;
    userId?: string;
    stack?: string;
}

export async function logError(error: unknown, context: ErrorContext = {}) {
    try {
        const message = error instanceof Error ? error.message : String(error);
        const stack = context.stack || (error instanceof Error ? error.stack : undefined);

        await prisma.errorLog.create({
            data: {
                message,
                stack,
                path: context.path,
                userId: context.userId,
            },
        });

        // Also log to console for immediate visibility in dev
        console.error('🚨 Error logged to DB:', message, context);
    } catch (loggingError) {
        // Fallback if DB logging fails
        console.error('❌ Failed to log error to DB:', loggingError);
        console.error('Original Error:', error);
    }
}
