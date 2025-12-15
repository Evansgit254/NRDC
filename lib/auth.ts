import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

interface JwtPayload {
    id: string
    userId: string
    email: string
    role: string
}

export function signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (e) {
        return null
    }
}

export async function getSession(): Promise<JwtPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    return verifyToken(token)
}

// Permission helpers
export function isAdmin(user: JwtPayload | null): boolean {
    return user?.role === 'ADMIN'
}

export function canManageContent(user: JwtPayload | null): boolean {
    return user?.role === 'ADMIN' || user?.role === 'EDITOR'
}

export function canManageUsers(user: JwtPayload | null): boolean {
    return user?.role === 'ADMIN'
}

export function canManageSettings(user: JwtPayload | null): boolean {
    return user?.role === 'ADMIN'
}

