import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is where prisma client is
import { createDpoToken } from '@/lib/dpo';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, email, name, phone, paymentReason } = body;

        // 1. Create a pending donation record
        const donation = await prisma.donation.create({
            data: {
                amount: parseFloat(amount),
                currency: currency || 'KES',
                donorEmail: email,
                donorName: name,
                donorPhone: phone,
                paymentMethod: 'dpo',
                paymentStatus: 'pending',
                metadata: JSON.stringify({ paymentReason }),
            },
        });

        // 2. Request DPO Token
        // Determine base URL dynamically or use env var
        // For now, hardcoding localhost for dev or typical production URL structure needs to be handled
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const dpoResult = await createDpoToken({
            amount: parseFloat(amount),
            currency: currency || 'KES',
            paymentReason: paymentReason || `Donation ${donation.id}`,
            customerEmail: email,
            customerPhone: phone,
            customerFirstName: name?.split(' ')[0],
            customerLastName: name?.split(' ').slice(1).join(' '),
            redirectUrl: `${baseUrl}/api/webhooks/dpo/callback`, // DPO redirects here after payment
            backUrl: `${baseUrl}/donate`, // User clicks "Back" on DPO page
        });

        // 3. Update donation with DPO token
        await prisma.donation.update({
            where: { id: donation.id },
            data: {
                dpoTransToken: dpoResult.transToken,
                reference: dpoResult.transRef,
            },
        });

        return NextResponse.json({
            paymentUrl: dpoResult.paymentUrl,
            transToken: dpoResult.transToken
        });

    } catch (error: any) {
        console.error('DPO Error:', error.message || error);
        return NextResponse.json(
            { error: 'Failed to initiate DPO payment' },
            { status: 500 }
        );
    }
}
