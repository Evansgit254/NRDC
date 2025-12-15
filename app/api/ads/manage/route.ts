import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const ads = await prisma.advertisement.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name, type, placement, code, priority, active, startDate, endDate } = body;

        if (!name || !type || !placement || !code) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const data = {
            name,
            type,
            placement,
            code,
            priority: priority || 1,
            active: active !== undefined ? active : true,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        let ad;
        if (id) {
            ad = await prisma.advertisement.update({
                where: { id },
                data
            });
        } else {
            ad = await prisma.advertisement.create({
                data
            });
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error saving ad:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    return POST(request);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await prisma.advertisement.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting ad:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
