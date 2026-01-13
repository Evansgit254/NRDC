import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email sending will not work.')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
    to: string | string[]
    subject: string
    html: string
    from?: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
    try {
        const from = options.from || process.env.EMAIL_FROM || 'noreply@nrdc.org'

        const { data, error } = await resend.emails.send({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
        })

        if (error) {
            console.error('Email send error:', error)
            throw error
        }


        return { success: true, data }
    } catch (error) {
        console.error('Failed to send email:', error)
        return { success: false, error }
    }
}

/**
 * Send donation receipt email to donor
 */
export async function sendDonationReceipt(params: {
    donorEmail: string
    donorName: string
    amount: number
    currency: string
    transactionId: string
    date: Date
    paymentMethod: string
}) {
    const { donorEmail, donorName, amount, currency, transactionId, date, paymentMethod } = params

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
    }).format(amount)

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6E8C82 0%, #2E8B57 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #6E8C82; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Thank You for Your Donation!</h1>
        </div>
        <div class="content">
            <p>Dear ${donorName || 'Friend'},</p>
            
            <p>Thank you for your generous donation of <strong>${formattedAmount}</strong> to the Nutrition Relief and Development Center (NRDC).</p>
            
            <p>Your contribution directly supports our mission to provide nutrition programs and health services to refugees and vulnerable communities across East Africa.</p>
            
            <div class="details">
                <h3 style="margin-top: 0;">Transaction Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">${formattedAmount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">${transactionId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${paymentMethod}</span>
                </div>
            </div>
            
            <p><strong>Your Impact:</strong></p>
            <ul>
                <li>Provides nutrition support to vulnerable families</li>
                <li>Enables health screenings and medical care</li>
                <li>Supports education and livelihood programs</li>
                <li>Helps build resilient communities</li>
            </ul>
            
            <p>Please keep this email as your receipt for tax purposes.</p>
            
            <p>If you have any questions about your donation, please don't hesitate to contact us.</p>
            
            <p>With heartfelt gratitude,<br>
            <strong>The NRDC Team</strong></p>
        </div>
        <div class="footer">
            <p>Nutrition Relief and Development Center (NRDC)<br>
            Email: ${process.env.ADMIN_EMAIL || 'info@nrdc.org'}</p>
            <p style="font-size: 12px; color: #999;">
                This is an automated receipt. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
    `

    return sendEmail({
        to: donorEmail,
        subject: `Thank you for your ${formattedAmount} donation to NRDC`,
        html,
    })
}

/**
 * Send donation alert to admin
 */
export async function sendDonationAlertToAdmin(params: {
    donorEmail: string
    donorName: string
    amount: number
    currency: string
    transactionId: string
    paymentMethod: string
}) {
    const { donorEmail, donorName, amount, currency, transactionId, paymentMethod } = params

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
    }).format(amount)

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E8B57; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #2E8B57; text-align: center; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">🎉 New Donation Received!</h2>
        </div>
        <div class="content">
            <div class="amount">${formattedAmount}</div>
            
            <div class="details">
                <p><strong>Donor Information:</strong></p>
                <p>Name: ${donorName || 'Anonymous'}<br>
                Email: ${donorEmail}<br>
                Payment Method: ${paymentMethod}<br>
                Transaction ID: ${transactionId}</p>
            </div>
            
            <p style="text-align: center; color: #666;">
                View full details in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/donations">Admin Dashboard</a>
            </p>
        </div>
    </div>
</body>
</html>
    `

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nrdc.org'

    return sendEmail({
        to: adminEmail,
        subject: `New Donation: ${formattedAmount} from ${donorName || 'Anonymous'}`,
        html,
    })
}

/**
 * Send contact form confirmation to submitter
 */
export async function sendContactConfirmation(params: {
    name: string
    email: string
}) {
    const { name, email } = params

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6E8C82; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Message Received</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for contacting the Nutrition Relief and Development Center (NRDC).</p>
            
            <p>We have received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
            
            <p>If your inquiry is urgent, please call us directly or visit our office.</p>
            
            <p>Best regards,<br>
            <strong>The NRDC Team</strong></p>
        </div>
    </div>
</body>
</html>
    `

    return sendEmail({
        to: email,
        subject: 'Thank you for contacting NRDC',
        html,
    })
}

/**
 * Send contact form alert to admin
 */
export async function sendContactAlertToAdmin(params: {
    name: string
    email: string
    message: string
}) {
    const { name, email, message } = params

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6E8C82; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .message { background: white; padding: 15px; border-left: 4px solid #6E8C82; margin: 15px 0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
        </div>
        <div class="content">
            <p><strong>From:</strong> ${name}<br>
            <strong>Email:</strong> ${email}</p>
            
            <div class="message">
                ${message}
            </div>
            
            <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contact" style="display: inline-block; background: #6E8C82; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin</a>
            </p>
        </div>
    </div>
</body>
</html>
    `

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nrdc.org'

    return sendEmail({
        to: adminEmail,
        subject: `New Contact Form: ${name}`,
        html,
    })
}

/**
 * Send password reset email to user
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6E8C82; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #6E8C82; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset your password for the NRDC Admin Portal. Click the button below to set a new password:</p>
            
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <p>If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
            
            <p>For security, please do not share this link with anyone.</p>
            
            <p>Best regards,<br>
            <strong>The NRDC Team</strong></p>
        </div>
        <div class="footer">
            <p>Nutrition Relief and Development Center (NRDC)</p>
        </div>
    </div>
</body>
</html>
    `

    return sendEmail({
        to: email,
        subject: 'Reset your NRDC Admin password',
        html,
    })
}

export { resend }
