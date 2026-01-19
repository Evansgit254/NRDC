import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'NRDC - Nutrition for Refugees and Displaced Communities'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const logoUrl = `${siteUrl}/logo-512.png`

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#f9fafb',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={logoUrl}
                        alt="NRDC Logo"
                        width="200"
                        height="200"
                        style={{ borderRadius: '20px' }}
                    />
                </div>
                <div
                    style={{
                        fontSize: 60,
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: 20,
                        textAlign: 'center',
                        padding: '0 40px',
                    }}
                >
                    NRDC.KENYA
                </div>
                <div
                    style={{
                        fontSize: 30,
                        color: '#4B5563',
                        textAlign: 'center',
                        padding: '0 40px',
                        maxWidth: '1000px',
                    }}
                >
                    Nutrition for Refugees and Displaced Communities
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: '#059669', // Brand green
                        marginTop: 40,
                        background: 'rgba(5, 150, 105, 0.1)',
                        padding: '10px 30px',
                        borderRadius: '50px',
                        border: '1px solid #059669'
                    }}
                >
                    www.nrdc.africa
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
