import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');

    if (!placement) {
        return NextResponse.json({ error: 'Placement is required' }, { status: 400 });
    }

    try {
        // Find active ads for this placement
        const ads = await prisma.advertisement.findMany({
            where: {
                placement,
                active: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: new Date() } }
                ],
                AND: [
                    { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }
                ]
            },
            orderBy: {
                priority: 'desc'
            }
        });

        if (ads.length === 0) {
            return NextResponse.json({ ad: null });
        }

        // Simple rotation logic: pick random ad from top priority ones
        // In a real system, you might want weighted rotation
        const randomIndex = Math.floor(Math.random() * ads.length);
        const selectedAd = ads[randomIndex];

        return NextResponse.json({ ad: selectedAd });
    } catch (error) {
        console.error('Error fetching ad:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Admin endpoint to create ads
    try {
        const body = await request.json();
        const { name, type, placement, code, priority, startDate, endDate } = body;

        const ad = await prisma.advertisement.create({
            data: {
                name,
                type,
                placement,
                code,
                priority: priority || 0,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            }
        });

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error creating ad:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
