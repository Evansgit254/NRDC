import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adId, type } = body;

        if (!adId || !['impression', 'click'].includes(type)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        if (type === 'impression') {
            await prisma.advertisement.update({
                where: { id: adId },
                data: { impressions: { increment: 1 } }
            });
        } else {
            await prisma.advertisement.update({
                where: { id: adId },
                data: { clicks: { increment: 1 } }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking ad:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
