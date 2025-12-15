import nodemailer from 'nodemailer';

// Create a test account for development (Ethereal Email)
// In production, replace with real SMTP credentials
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // For development, use Ethereal (fake SMTP)
  // In production, use real SMTP credentials from env
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Use Ethereal (fake SMTP for testing)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const transport = await getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nrdc.org',
    to: email,
    subject: 'Reset Your Password - NRDC',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6E8C82; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #2E8B57; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your NRDC Admin account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NRDC. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  const info = await transport.sendMail(mailOptions);

  // Log preview URL for development (Ethereal only)
  if (!process.env.SMTP_HOST) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('📧 Password Reset Email Preview URL: %s', previewUrl);

    // Write to a file for easier debugging
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'email-debug.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Preview URL: ${previewUrl}\n`);
  }

  return info;
}
