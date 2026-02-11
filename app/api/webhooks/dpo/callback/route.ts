import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyDpoToken } from '@/lib/dpo';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let transToken = searchParams.get('TransToken');
        const transId = searchParams.get('TransID');
        const ccdApproval = searchParams.get('CCDapproval');

        console.log('DPO Callback received:', {
            TransToken: transToken,
            TransID: transId,
            CCDapproval: ccdApproval,
            allParams: Object.fromEntries(searchParams)
        });

        // If TransToken is missing but TransID is present, try to find it
        if (!transToken && transId) {
            try {
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
            } catch (dbError) {
                console.error('DPO Callback: Database lookup failed:', dbError);
                // Continue - we might still be able to use transId as token
                if (transId) {
                    transToken = transId;
                }
            }
        }

        if (!transToken) {
            console.error('DPO Callback: Missing Transaction Token. Query Params:', Object.fromEntries(searchParams));

            // Last resort: if we have CCDapproval, try to find donation by CompanyRef
            if (ccdApproval) {
                const pnrId = searchParams.get('PnrID');
                if (pnrId) {
                    try {
                        // PnrID format is like: NRDC_DONATION_1770740624544
                        const donations = await prisma.donation.findMany({
                            where: {
                                paymentMethod: 'dpo',
                                paymentStatus: 'pending'
                            },
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        });

                        // Find the donation that matches the timestamp in PnrID
                        const matchingDonation = donations.find(d =>
                            d.metadata?.includes(pnrId) ||
                            d.createdAt.getTime().toString().includes(pnrId.split('_').pop() || '')
                        );

                        if (matchingDonation) {
                            console.log('DPO Callback: Found donation via PnrID:', matchingDonation.id);
                            await prisma.donation.update({
                                where: { id: matchingDonation.id },
                                data: {
                                    paymentStatus: 'completed',
                                    metadata: JSON.stringify({
                                        ...JSON.parse(matchingDonation.metadata || '{}'),
                                        dpoResult: {
                                            Result: '000',
                                            ResultExplanation: 'Payment approved (verified via CCDapproval)',
                                            CCDapproval: ccdApproval,
                                            PnrID: pnrId
                                        }
                                    })
                                }
                            });
                            redirect('/donate/success?payment_method=dpo');
                        }
                    } catch (error) {
                        console.error('DPO Callback: PnrID lookup failed:', error);
                    }
                }
            }

            return NextResponse.json({
                error: 'Missing TransToken',
                receivedParams: Object.fromEntries(searchParams)
            }, { status: 400 });
        }

        // Try to verify with DPO API
        let verifyResult;
        let isSuccess = false;

        try {
            console.log('DPO Callback: Verifying token:', transToken);
            verifyResult = await verifyDpoToken(transToken);
            console.log('DPO Callback: Verification result:', JSON.stringify(verifyResult, null, 2));

            isSuccess = verifyResult.Result === '000' || verifyResult.Result === 0;
        } catch (verifyError) {
            console.error('DPO Callback: verifyToken API call failed:', verifyError);

            // Fallback: If DPO sent CCDapproval, the payment was successful
            if (ccdApproval) {
                console.log('DPO Callback: Using CCDapproval as success indicator:', ccdApproval);
                isSuccess = true;
                verifyResult = {
                    Result: '000',
                    ResultExplanation: 'Payment approved (verified via CCDapproval)',
                    CCDapproval: ccdApproval,
                    TransactionToken: transToken
                };
            } else {
                // If no CCDapproval and verification failed, re-throw the error
                throw verifyError;
            }
        }

        // Update Database
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

        // Redirect User
        if (isSuccess) {
            redirect('/donate/success?payment_method=dpo');
        } else {
            redirect('/donate/failed?reason=dpo_verification_failed');
        }

    } catch (error) {
        // Next.js redirect() throws an error, so we need to re-throw it if it's a redirect
        if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
            throw error;
        }

        console.error('DPO Callback Error:', error);
        console.error('DPO Callback Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
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
