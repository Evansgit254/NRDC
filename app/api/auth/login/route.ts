import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { logAudit } from '@/lib/audit'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = signToken({ id: user.id, userId: user.id, email: user.email, role: user.role })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400, // 1 day
            path: '/',
        })


        await logAudit('LOGIN', 'User', user.id, { userId: user.id, details: { email: user.email } })

        return NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
