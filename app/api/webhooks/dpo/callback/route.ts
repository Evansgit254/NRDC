import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyDpoToken } from '@/lib/dpo';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let transToken = searchParams.get('TransToken');
    const transId = searchParams.get('TransID');

    // If TransToken is missing but TransID is present, DPO might be using it as the token or reference
    if (!transToken && transId) {
        // Try to find the donation by reference (which stores DPO's TransRef)
        const donationByRef = await prisma.donation.findUnique({
            where: { reference: transId },
        });

        if (donationByRef) {
            transToken = donationByRef.dpoTransToken;
        } else {
            // Fallback: Check if TransID itself is the TransToken
            const donationByToken = await prisma.donation.findUnique({
                where: { dpoTransToken: transId },
            });
            if (donationByToken) {
                transToken = transId;
            }
        }
    }

    if (!transToken) {
        console.error('DPO Callback: Missing Transaction Token. Query Params:', Object.fromEntries(searchParams));
        return NextResponse.json({
            error: 'Missing TransToken',
            receivedParams: Object.fromEntries(searchParams)
        }, { status: 400 });
    }


    try {
        // 1. Verify Token with DPO
        console.log('DPO Callback: Verifying token:', transToken);
        const verifyResult = await verifyDpoToken(transToken);
        console.log('DPO Callback: Verification result:', JSON.stringify(verifyResult, null, 2));

        // Result '000' means successful payment
        // Result '900' means transaction not paid yet
        const isSuccess = verifyResult.Result === '000' || verifyResult.Result === 0;

        // 2. Update Database
        // Find donation by token
        const donation = await prisma.donation.findUnique({
            where: { dpoTransToken: transToken },
        });

        console.log('DPO Callback: Found donation:', donation?.id, 'Status:', isSuccess ? 'completed' : 'failed');

        if (donation) {
            await prisma.donation.update({
                where: { id: donation.id },
                data: {
                    paymentStatus: isSuccess ? 'completed' : 'failed',
                    metadata: JSON.stringify({
                        ...JSON.parse(donation.metadata || '{}'),
                        dpoResult: verifyResult,
                    }),
                },
            });
        }

        // 3. Redirect User
        if (isSuccess) {
            redirect('/donate/success?payment_method=dpo');
        } else {
            redirect('/donate/failed?reason=dpo_verification_failed');
        }

    } catch (error) {
        console.error('DPO Callback Error:', error);
        console.error('DPO Callback Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('DPO Callback TransToken:', transToken);
        return NextResponse.json(
            {
                error: 'Verification failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const text = await request.text();
        const { XMLParser } = await import('fast-xml-parser');
        const parser = new XMLParser();
        const result = parser.parse(text);

        // DPO Webhook structure might vary, but typically contains TransToken
        const transToken = result.API3G?.TransactionToken || result.API3G?.TransToken;

        if (!transToken) {
            return new Response('Missing Token', { status: 400 });
        }

        const verifyResult = await verifyDpoToken(transToken);
        const isSuccess = verifyResult.Result === '000';

        const donation = await prisma.donation.findUnique({
            where: { dpoTransToken: transToken },
        });

        if (donation) {
            await prisma.donation.update({
                where: { id: donation.id },
                data: {
                    paymentStatus: isSuccess ? 'completed' : 'failed',
                    metadata: JSON.stringify({
                        ...JSON.parse(donation.metadata || '{}'),
                        dpoWebhookResult: verifyResult,
                    }),
                },
            });
        }

        // DPO expects an XML response to acknowledge the webhook sometimes
        // But a simple 200 OK is often enough
        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('DPO Webhook Error:', error);
        return new Response('Error', { status: 500 });
    }
}
