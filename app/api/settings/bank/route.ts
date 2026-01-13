import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const bankDetails = await prisma.bankDetails.findFirst({
            where: { active: true },
            orderBy: { createdAt: 'desc' }
        })

        if (!bankDetails) {
            return NextResponse.json(null)
        }

        return NextResponse.json(bankDetails)
    } catch (error) {
        console.error('Error fetching bank details:', error)
        return NextResponse.json({ error: 'Failed to fetch bank details' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        const {
            accountName,
            accountNumber,
            branch,
            bankCode,
            branchCode,
            swiftCode,
            phoneNumber,
            bankName
        } = data

        // Validate required fields
        if (!accountName || !accountNumber || !branch) {
            return NextResponse.json(
                { error: 'Account name, number, and branch are required' },
                { status: 400 }
            )
        }

        // Deactivate all existing bank details
        await prisma.bankDetails.updateMany({
            where: { active: true },
            data: { active: false }
        })

        // Create new bank details
        const bankDetails = await prisma.bankDetails.create({
            data: {
                accountName,
                accountNumber,
                branch,
                bankCode: bankCode || null,
                branchCode: branchCode || null,
                swiftCode: swiftCode || null,
                phoneNumber: phoneNumber || null,
                bankName: bankName || null,
                active: true
            }
        })

        return NextResponse.json(bankDetails)
    } catch (error) {
        console.error('Error saving bank details:', error)
        return NextResponse.json({ error: 'Failed to save bank details' }, { status: 500 })
    }
}
