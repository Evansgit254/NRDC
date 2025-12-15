import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendContactConfirmation, sendContactAlertToAdmin } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const submission = await prisma.contactSubmission.create({
            data: {
                name: body.name,
                email: body.email,
                message: body.message,
            },
        })

        // Send email notifications
        try {
            // Send confirmation to submitter
            await sendContactConfirmation({
                name: body.name,
                email: body.email,
            })

            // Send alert to admin
            await sendContactAlertToAdmin({
                name: body.name,
                email: body.email,
                message: body.message,
            })

            console.log(`✅ Contact form submitted and emails sent: ${submission.id}`)
        } catch (emailError) {
            console.error('Email sending failed:', emailError)
            // Don't fail the contact submission if email fails
        }

        return NextResponse.json({ success: true, id: submission.id })
    } catch (error) {
        return NextResponse.json({ error: 'Error submitting form' }, { status: 500 })
    }
}

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(submissions)
}
