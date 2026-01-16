import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Initialize Cloudinary only once or reuse
function configureCloudinary() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        const missing = [
            !cloudName && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
            !apiKey && 'CLOUDINARY_API_KEY',
            !apiSecret && 'CLOUDINARY_API_SECRET'
        ].filter(Boolean);
        throw new Error(`Cloudinary configuration missing: ${missing.join(', ')}`);
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        configureCloudinary()
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const dataURI = `data:${file.type};base64,${base64}`

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'nrdc',
            resource_type: 'auto',
        })

        return NextResponse.json({ url: result.secure_url })
    } catch (error: any) {
        console.error('Upload error:', error)

        // Log to database for forensic audit
        try {
            const { prisma } = require('@/lib/prisma')
            await prisma.errorLog.create({
                data: {
                    message: error.message || 'Upload error',
                    stack: error.stack,
                    path: '/api/upload (POST)',
                    userId: session.id
                }
            })
        } catch (logError) {
            console.error('Failed to log error to DB:', logError)
        }

        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
