import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ user: null })
    }
    return NextResponse.json({ user: session })
}

export async function POST() {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return NextResponse.json({ success: true })
}
