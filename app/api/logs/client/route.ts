import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    // We allow even unauthenticated logging of client errors for debugging, 
    // but we tag it with the user ID if available.

    try {
        const body = await request.json()
        const log = await prisma.errorLog.create({
            data: {
                message: body.message || 'Client Error',
                stack: body.stack,
                path: `[CLIENT] ${body.path || 'unknown'}`,
                userId: session?.id || null,
                // Add details if we had a field for it, or append to message
            }
        })

        // If there are extra details, we can't easily store them in standard ErrorLog fields 
        // without a schema change. For now, we'll prefix them in the message.
        if (body.details) {
            await prisma.errorLog.update({
                where: { id: log.id },
                data: {
                    message: `${log.message} | Details: ${body.details}`
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to log client error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
