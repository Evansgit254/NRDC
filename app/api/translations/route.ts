import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const namespace = searchParams.get('namespace');

    try {
        const where: any = {};
        if (locale) where.locale = locale;
        if (namespace) where.namespace = namespace;

        const translations = await prisma.translation.findMany({
            where,
            orderBy: { key: 'asc' }
        });

        return NextResponse.json(translations);
    } catch (error) {
        console.error('Error fetching translations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, locale, value, namespace } = body;

        if (!key || !locale || !value) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const translation = await prisma.translation.upsert({
            where: {
                key_locale_namespace: {
                    key,
                    locale,
                    namespace: namespace || 'common'
                }
            },
            update: { value },
            create: {
                key,
                locale,
                value,
                namespace: namespace || 'common'
            }
        });

        return NextResponse.json(translation);
    } catch (error) {
        console.error('Error saving translation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await prisma.translation.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting translation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
