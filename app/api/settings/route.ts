import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canManageSettings } from '@/lib/auth'

// GET - Fetch all settings
export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const settings = await prisma.siteContent.findMany()

        // Convert array to object for easier frontend consumption
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json(settingsMap)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

// POST - Update settings
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session || !canManageSettings(session)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const updates = Object.entries(body)

        // Process updates in transaction
        await prisma.$transaction(
            updates.map(([key, value]) =>
                prisma.siteContent.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: {
                        key,
                        value: String(value),
                        type: 'TEXT'
                    }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        )
    }
}
