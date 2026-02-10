import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Test credentials from the bank's email
const DPO_COMPANY_TOKEN = process.env.DPO_COMPANY_TOKEN || 'B3F59BE7-0756-420E-BB88-1D98E7A6B040';
const DPO_SERVICE_TYPE = process.env.DPO_SERVICE_TYPE || '54841'; // Test Product
const DPO_BASE_URL = 'https://secure.3gdirectpay.com/API/v6/';

interface CreateTokenParams {
    amount: number;
    currency: string;
    paymentReason: string; // The "Service Description"
    redirectUrl: string;
    backUrl: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail: string;
    customerPhone?: string;
}

export async function createDpoToken(params: CreateTokenParams) {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true
    });

    const xmlRequest = builder.build({
        API3G: {
            CompanyToken: DPO_COMPANY_TOKEN,
            Request: 'createToken',
            Transaction: {
                PaymentAmount: params.amount,
                PaymentCurrency: params.currency,
                CompanyRef: 'NRDC_DONATION_' + Date.now(), // Generate a unique ref
                // For live credentials, we MUST use production URLs to avoid CloudFront blocking localhost
                RedirectURL: process.env.NODE_ENV === 'production'
                    ? params.redirectUrl
                    : 'https://www.nrdc.africa/api/webhooks/dpo/callback',
                BackURL: process.env.NODE_ENV === 'production'
                    ? params.backUrl
                    : 'https://www.nrdc.africa/donate',
                CompanyRefUnique: 0,
                PTL: 5, // Payment Time Limit in hours
                customerFirstName: params.customerFirstName || '',
                customerLastName: params.customerLastName || '',
                customerEmail: params.customerEmail || '',
                customerPhone: params.customerPhone || '',
                customerZip: '',
                customerCity: '',
                customerCountry: 'KE',
                customerAddress: ''
            },
            Services: {
                Service: {
                    ServiceType: DPO_SERVICE_TYPE,
                    ServiceDescription: params.paymentReason,
                    ServiceDate: new Date().toISOString().split('T')[0] + ' 00:00'
                }
            }
        }
    });

    try {
        const response = await fetch(DPO_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "User-Agent": "NRDC-Platform/1.0"
            },
            body: xmlRequest
        });

        const textHtml = await response.text();

        const parser = new XMLParser();
        const result = parser.parse(textHtml);
        console.log('DPO Parsed Result:', JSON.stringify(result, null, 2));

        // API3G.Result, API3G.TransToken, API3G.TransRef
        const apiResult = result.API3G;

        if (!apiResult) {
            throw new Error(`DPO Error: Unexpected response structure - ${textHtml.substring(0, 200)}`);
        }

        // Result can be a string '000' or a number 0 depending on XML parsing
        const resultCode = String(apiResult.Result);
        if (resultCode !== '000' && resultCode !== '0') {
            throw new Error(`DPO Error: ${apiResult.ResultExplanation || 'Unknown error'}`);
        }

        return {
            transToken: apiResult.TransToken,
            transRef: apiResult.TransRef,
            paymentUrl: `https://secure.3gdirectpay.com/payv3.php?ID=${apiResult.TransToken}`
        };

    } catch (error) {
        console.error("DPO CreateToken Error:", error);
        throw error;
    }
}

export async function verifyDpoToken(transToken: string) {
    const builder = new XMLBuilder({});
    const xmlRequest = builder.build({
        API3G: {
            CompanyToken: DPO_COMPANY_TOKEN,
            Request: 'verifyToken',
            TransactionToken: transToken
        }
    });

    try {
        const response = await fetch(DPO_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "User-Agent": "NRDC-Platform/1.0"
            },
            body: xmlRequest
        });

        const textHtml = await response.text();
        const parser = new XMLParser();
        const result = parser.parse(textHtml);

        // Check Result field
        return result.API3G;
    } catch (error) {
        console.error("DPO VerifyToken Error:", error);
        throw error;
    }
}
