# M-Changa Payment Gateway Setup Guide 💳

Welcome to the comprehensive guide for setting up and using the M-Changa payment gateway on your NRDC donation platform. This guide will walk you through everything from creating your M-Changa account to going live with donations.

---

## Table of Contents
1. [What is M-Changa?](#what-is-mchanga)
2. [Why M-Changa for NRDC?](#why-m-changa-for-nrdc)
3. [Getting Started: Account Setup](#getting-started-account-setup)
4. [Integrating M-Changa with Your Platform](#integrating-m-changa-with-your-platform)
5. [Testing Your Integration](#testing-your-integration)
6. [Going Live](#going-live)
7. [Managing Donations](#managing-donations)
8. [Troubleshooting](#troubleshooting)
9. [Support & Resources](#support--resources)

---

## What is M-Changa?

**M-Changa** is East Africa's leading fundraising platform, purpose-built for the African market. It provides seamless integration with:

- 📱 **M-PESA** (Safaricom)
- 💳 **Mobile Money** (Airtel Money, T-Kash)
- 🏦 **Bank Transfers**
- 💰 **Card Payments** (Visa, Mastercard)

### Key Benefits
- ✅ **Zero setup fees** - Create your fundraiser for free
- ✅ **Local payment methods** - Optimized for Kenyan donors
- ✅ **Instant notifications** - Real-time updates on donations
- ✅ **Mobile-first** - 90% of donors use mobile phones
- ✅ **Secure & trusted** - Used by thousands of organizations across Kenya

---

## Why M-Changa for NRDC?

The NRDC platform has been specifically designed to work with M-Changa because:

1. **M-PESA is King**: Over 80% of Kenyan donations happen via M-PESA
2. **Trust Factor**: M-Changa is a recognized brand donors already trust
3. **No Technical Complexity**: No need to become a payment processor yourself
4. **Compliance**: M-Changa handles all KYC and regulatory requirements
5. **Quick Payouts**: Funds are available within 24-48 hours

---

## Getting Started: Account Setup

### Step 1: Create Your M-Changa Account

1. **Visit M-Changa**
   - Go to [https://www.mchanga.africa](https://www.mchanga.africa)
   - Click on **"Start a Fundraiser"** or **"Sign Up"**

2. **Choose Organization Type**
   - Select **"Non-Profit Organization"** or **"Charity"**
   - Fill in your organization details:
     - Organization Name: **NRDC** (or your full registered name)
     - Registration Number (if applicable)
     - Contact Email
     - Phone Number

3. **Verify Your Account**
   - Check your email for a verification link
   - Click the link to verify your account
   - You may be asked to provide:
     - Certificate of Registration
     - KRA PIN Certificate
     - ID of the organization representative

> [!TIP]
> Have your organization's registration documents ready. Verification typically takes 24-48 hours.

### Step 2: Create Your Fundraiser

1. **Log in to M-Changa Dashboard**
   - Go to [https://www.mchanga.africa/login](https://www.mchanga.africa/login)
   - Enter your credentials

2. **Create New Fundraiser**
   - Click **"Create Fundraiser"**
   - Fill in the details:
     - **Title**: "Support NRDC's Mission" (or your preferred title)
     - **Category**: Select "Charity" or "Community Development"
     - **Target Amount**: Set a realistic fundraising goal (e.g., KES 1,000,000)
     - **Description**: Tell your story (the platform will auto-fill this from your About page, but you can customize)
     - **End Date**: Optional - you can run an ongoing campaign

3. **Upload Campaign Image**
   - Use your NRDC logo or a compelling campaign image
   - Recommended size: 1200 x 630 pixels
   - Format: JPG or PNG

4. **Save Your Fundraiser**
   - Click **"Publish"** or **"Save"**
   - You'll receive a **Fundraiser ID** (also called Paybill or Campaign ID)
   - **IMPORTANT**: Copy and save this ID - you'll need it for integration

> [!IMPORTANT]
> Your **Fundraiser ID** is a unique identifier (e.g., `12345` or `NRDC-2024`). This is the most critical piece of information you need. Without it, the integration won't work.

### Step 3: Get Your API Credentials

1. **Access Developer Settings**
   - In your M-Changa dashboard, look for **"Settings"** or **"Developer"** section
   - Some accounts might have this under **"API Keys"** or **"Integrations"**

2. **Generate API Key** (if available)
   - Click **"Generate API Key"** or **"Create New Key"**
   - Copy the API key immediately (it may only be shown once)
   - Store it securely - treat it like a password

> [!NOTE]
> Not all M-Changa accounts have direct API access. If you don't see an API section, don't worry - the platform can work with just your Fundraiser ID using the hosted checkout method. Contact M-Changa support at support@mchanga.africa to request API access if needed.

---

## Integrating M-Changa with Your Platform

Now that you have your M-Changa account set up, let's connect it to your NRDC website.

### Step 1: Locate Your Environment File

Your website's configuration is stored in a secure file called `.env`. To update it:

1. **Access Your Project Files**
   - If you're working with a developer, share the credentials with them
   - If you have technical access, open your project folder

2. **Open the `.env` File**
   - This file is in the root directory of your project
   - Look for: `/home/evans/Projects/NRDC/.env` (or similar path on your server)

> [!CAUTION]
> The `.env` file contains sensitive information. Never commit it to public repositories or share it publicly. Only share with trusted team members.

### Step 2: Configure M-Changa Credentials

Open the `.env` file and look for the M-Changa section. It should look like this:

```env
#MCHANGA
MCHANGA_API_KEY=your_key_here
MCHANGA_PAYBILL=your_paybill_id
```

**Update these values:**

1. **Replace `your_paybill_id`** with your actual Fundraiser ID from Step 2
   ```env
   MCHANGA_PAYBILL=12345
   ```

2. **Replace `your_key_here`** with your API Key from Step 3 (if you have one)
   ```env
   MCHANGA_API_KEY=sk_live_abc123xyz456
   ```

**Example of properly configured credentials:**
```env
#MCHANGA
MCHANGA_API_KEY=sk_live_a1b2c3d4e5f6g7h8i9j0
MCHANGA_PAYBILL=67890
```

> [!TIP]
> If you don't have an API key, you can leave it as `your_key_here` for now. The platform will use the hosted checkout method, which works without an API key.

### Step 3: Set Your Application URL

In the same `.env` file, look for:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Update this to your actual website URL:**

- **For Testing**: `http://localhost:3000` (keep as is)
- **For Production**: `https://www.nrdc.org` (or your actual domain)

Example:
```env
NEXT_PUBLIC_APP_URL=https://www.nrdc.org
```

This URL is used for payment callbacks - when donors complete their payment, they'll be redirected back to your site.

### Step 4: Restart Your Application

After updating the `.env` file:

1. **Save the file**
2. **Restart your web server**
   - If using a hosting service (Vercel, Netlify), redeploy your application
   - If running locally with `npm run dev`, stop the server (Ctrl+C) and start it again
   - If using PM2 or similar: `pm2 restart nrdc`

> [!IMPORTANT]
> Environment variables are only read when the application starts. You MUST restart for changes to take effect.

---

## Testing Your Integration

Before accepting real donations, it's crucial to test the payment flow.

### Test Mode Setup

M-Changa provides a test/sandbox environment for testing:

1. **Create a Test Fundraiser**
   - In your M-Changa dashboard, create a separate fundraiser for testing
   - Name it something like "NRDC Test Campaign"
   - Use this fundraiser's ID in your `.env` file during testing

2. **Use Test Credentials**
   ```env
   MCHANGA_PAYBILL=test_12345
   MCHANGA_API_KEY=sk_test_abc123xyz456
   ```

> [!NOTE]
> Contact M-Changa support to confirm the exact test environment setup. Some features may require a sandbox account.

### Step-by-Step Testing Process

1. **Navigate to Your Donation Page**
   - Open your website: `https://yoursite.com/donate` (or `http://localhost:3000/donate` for local testing)

2. **Initiate a Test Donation**
   - Enter a test amount: **KES 100**
   - Fill in test donor details:
     - Name: `Test Donor`
     - Email: `test@example.com`
     - Phone: `0712345678` (test number)
   - Click **"Donate Now"**

3. **Verify Redirect**
   - You should be redirected to M-Changa's checkout page
   - The URL should look like: `https://www.mchanga.africa/fundraiser/12345?amount=100&name=Test+Donor...`
   - Verify that all the details are correctly displayed

4. **Complete Test Payment**
   - On the M-Changa page, select M-PESA
   - Use a test phone number provided by M-Changa (if in test mode)
   - OR use a real phone number with a small amount (KES 10-50) for end-to-end testing

5. **Check Callback**
   - After payment, you should be redirected back to: `https://yoursite.com/donate/verify?reference=NRDC-MC-...`
   - The verification page should show the payment status

6. **Verify in Admin Dashboard**
   - Log in to your admin panel: `https://yoursite.com/admin`
   - Go to **Donations** section
   - Verify that the test donation appears with:
     - Correct amount
     - Donor details
     - Payment status (pending or success)
     - M-Changa reference

### Testing Checklist

- [ ] Donation page loads without errors
- [ ] Can enter donation amount and details
- [ ] Redirects to M-Changa checkout page
- [ ] M-Changa page shows correct amount and donor info
- [ ] Can complete payment (or initiate M-PESA prompt)
- [ ] Redirects back to your site after payment
- [ ] Donation appears in admin dashboard
- [ ] Email notification sent to donor (if configured)
- [ ] Different donation amounts work (KES 100, 500, 1000, 5000)

> [!TIP]
> Test with different amounts and donor information to ensure everything works correctly. Also test on mobile devices since most donors will use phones.

---

## Going Live

Once testing is successful, follow these steps to accept real donations:

### Step 1: Switch to Live Fundraiser

1. **Update `.env` with Live Credentials**
   ```env
   MCHANGA_API_KEY=sk_live_YOUR_ACTUAL_LIVE_KEY
   MCHANGA_PAYBILL=YOUR_LIVE_FUNDRAISER_ID
   NEXT_PUBLIC_APP_URL=https://www.nrdc.org
   ```

2. **Remove any test data**
   - In your admin dashboard, delete or archive test donations
   - This keeps your analytics clean

### Step 2: Deploy to Production

1. **Deploy Your Website**
   - If using Vercel/Netlify: Push changes and redeploy
   - If using VPS: Upload files and restart server
   - Ensure environment variables are set in your hosting platform

2. **Verify Live Environment Variables**
   - In your hosting dashboard (Vercel, Heroku, etc.), double-check:
     - `MCHANGA_API_KEY` is set to live key
     - `MCHANGA_PAYBILL` is set to live fundraiser ID
     - `NEXT_PUBLIC_APP_URL` is your actual domain

### Step 3: Final Live Test

1. **Make a Real Small Donation**
   - Use a real phone number
   - Donate a small amount (e.g., KES 50)
   - Complete the M-PESA payment
   - Verify the full flow works end-to-end

2. **Check M-Changa Dashboard**
   - Log in to M-Changa
   - Verify the donation appears there as well
   - Confirm amounts match

### Step 4: Configure Payment Notifications

1. **Set Up M-Changa Webhooks** (if available)
   - In M-Changa dashboard, look for "Webhooks" or "Notifications"
   - Add your webhook URL: `https://www.nrdc.org/api/payments/mchanga/webhook`
   - This enables real-time payment status updates

2. **Test Webhook** (if configured)
   - Make another small test donation
   - Verify that your admin dashboard updates immediately when payment completes

> [!IMPORTANT]
> Keep your `.env` file secure and never commit it to version control. Use environment variables in your hosting platform for production.

---

## Managing Donations

### Viewing Donations in Your Admin Dashboard

1. **Access Admin Panel**
   - Go to: `https://www.nrdc.org/admin/login`
   - Log in with your admin credentials

2. **Navigate to Donations**
   - Click **"Donations"** in the sidebar
   - You'll see a table with all donations including:
     - Donor name and email
     - Amount and currency (KES)
     - Payment status (pending, success, failed)
     - Payment method (M-Changa)
     - Date and time
     - M-Changa reference ID

3. **Filter and Search**
   - Use the **Status Filter** to view:
     - All donations
     - Successful donations only
     - Pending payments
     - Failed transactions
   - Use the **Search Bar** to find specific donors

### Viewing Donations in M-Changa Dashboard

1. **Access M-Changa**
   - Go to: `https://www.mchanga.africa/login`
   - Log in with your M-Changa credentials

2. **View Fundraiser Dashboard**
   - Click on your NRDC fundraiser
   - You'll see:
     - Total raised
     - Number of donors
     - Recent donations
     - Payment methods used

3. **Download Reports**
   - M-Changa provides downloadable reports
   - Export to Excel/CSV for accounting
   - Use for tax receipts and compliance

### Reconciliation

**Best Practice**: Reconcile your platform's records with M-Changa monthly

1. Export donations from your admin panel
2. Export donations from M-Changa dashboard
3. Compare totals and individual transactions
4. Investigate any discrepancies

> [!TIP]
> Set a calendar reminder for monthly reconciliation. This helps catch any issues early and ensures accurate financial records.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "M-Changa API Not Configured" Error

**Symptoms**: Donors see an error when clicking "Donate Now"

**Solution**:
1. Check your `.env` file has correct values:
   ```env
   MCHANGA_PAYBILL=12345  # Should be numbers, not "your_paybill_id"
   ```
2. Ensure you've restarted the application after updating `.env`
3. Verify the environment variables are set in your hosting platform

#### Issue 2: Redirect Loop or "Authorization URL Not Found"

**Symptoms**: Donors are stuck after clicking donate, or redirected to wrong page

**Solution**:
1. Verify your `NEXT_PUBLIC_APP_URL` is correct in `.env`:
   ```env
   NEXT_PUBLIC_APP_URL=https://www.nrdc.org  # NOT http://localhost:3000
   ```
2. Check that your fundraiser is published and active in M-Changa
3. Ensure your Fundraiser ID is correct

#### Issue 3: Donations Show as "Pending" Forever

**Symptoms**: Donations completed on M-Changa but show as pending in admin

**Causes & Solutions**:
- **Webhook not configured**: Set up webhooks in M-Changa dashboard (see Step 4 of Going Live)
- **Manual verification needed**: Payments may need manual verification - check M-Changa dashboard
- **Callback URL incorrect**: Verify `NEXT_PUBLIC_APP_URL` is correct

**Temporary Fix**:
1. Check M-Changa dashboard for actual payment status
2. Manually update status in your database if needed (contact your developer)

#### Issue 4: Mobile Money Not Working

**Symptoms**: Only M-PESA works, other payment methods fail

**Solution**:
1. Verify with M-Changa that your account supports multiple payment methods
2. Some fundraisers may be M-PESA only - check your M-Changa settings
3. Ensure your fundraiser is verified (unverified accounts may have limitations)

#### Issue 5: Amounts Don't Match

**Symptoms**: Donor enters KES 1000 but M-Changa shows KES 1100

**Possible Causes**:
- **Transaction fees**: M-Changa may add fees on top
- **Currency conversion**: If someone tries to pay in USD/EUR
- **Platform fees**: Check M-Changa fee structure

**Solution**:
1. Review M-Changa's fee structure in their dashboard
2. Decide if you want to:
   - Absorb fees (donor pays exact amount, you receive less)
   - Pass fees to donor (add fee percentage to amount)
3. Update your donation page to clarify fee handling

### Getting Help

If you encounter issues not covered here:

1. **Check Application Logs**
   - If you have technical access, check server logs for errors
   - Console errors in browser (F12 → Console tab)

2. **Contact M-Changa Support**
   - Email: support@mchanga.africa
   - Phone: +254 709 983 000
   - Twitter: @MChangaAfrica

3. **Contact Your Developer**
   - Provide specific error messages
   - Screenshots of the issue
   - Steps to reproduce the problem

---

## Support & Resources

### M-Changa Resources

- **Website**: [https://www.mchanga.africa](https://www.mchanga.africa)
- **Help Center**: [https://www.mchanga.africa/help](https://www.mchanga.africa/help)
- **API Documentation**: Request from M-Changa support
- **Support Email**: support@mchanga.africa
- **Support Phone**: +254 709 983 000

### NRDC Platform Documentation

- **Presentation Guide**: See `PRESENTATION_GUIDE.md` in your project
- **Admin Guide**: Available in `/admin/help` section
- **Developer Docs**: Contact your development team

### Security Best Practices

1. **Protect Your Credentials**
   - Never share API keys publicly
   - Use environment variables, not hardcoded values
   - Rotate keys if compromised

2. **Monitor Suspicious Activity**
   - Watch for duplicate donations
   - Alert on unusually large donations
   - Check for failed payment attempts

3. **Regular Backups**
   - Backup your database weekly
   - Export donor data monthly
   - Keep offline copies of financial records

### Fee Structure

As of 2024, M-Changa's typical fee structure (verify current rates):

- **M-PESA**: ~2.5% + KES 10
- **Card Payments**: ~3.5%
- **Bank Transfer**: Flat fee or percentage (varies)

> [!NOTE]
> Fee structures may change. Always verify current rates with M-Changa at [https://www.mchanga.africa/pricing](https://www.mchanga.africa/pricing)

---

## Quick Reference Card

### Essential Information

| Item | Value |
|------|-------|
| **M-Changa Website** | https://www.mchanga.africa |
| **Your Fundraiser ID** | _(Fill in: _____________)_ |
| **Support Email** | support@mchanga.africa |
| **Support Phone** | +254 709 983 000 |
| **Your Admin URL** | https://www.nrdc.org/admin |
| **Donate Page** | https://www.nrdc.org/donate |

### Quick Troubleshooting Steps

1. ✅ Check `.env` file has correct `MCHANGA_PAYBILL`
2. ✅ Restart application after updating `.env`
3. ✅ Verify fundraiser is published in M-Changa dashboard
4. ✅ Test with small amount first
5. ✅ Check both your admin panel AND M-Changa dashboard

### Monthly Checklist

- [ ] Reconcile donations between platform and M-Changa
- [ ] Export financial reports for accounting
- [ ] Review failed/pending transactions
- [ ] Check fundraiser performance metrics
- [ ] Send thank you emails to donors
- [ ] Update fundraising progress on social media

---

## Alternative Payment Methods

### Bank Transfers
While M-Changa handles mobile money and cards, the platform also supports direct **Bank Transfers** for large donations.
- This is a manual process where donors receive your bank details and send proof of payment.
- To set this up, see the separate **[Bank Transfer Setup Guide](BANK_TRANSFER_SETUP_GUIDE.md)**.
- You can manage your bank details in **Admin > Settings > Bank Account Details**.

---

## Conclusion

Congratulations! 🎉 You now have a fully functional M-Changa payment gateway integrated with your NRDC platform. You're ready to:

- ✅ Accept donations via M-PESA and Mobile Money
- ✅ Manage donors and track contributions
- ✅ Generate reports for transparency
- ✅ Grow your fundraising efforts

### Next Steps

1. **Spread the Word**: Share your donation page on social media
2. **Thank Your Donors**: Set up automated thank you emails
3. **Track Progress**: Monitor your fundraising goals in the admin dashboard
4. **Engage Supporters**: Regular updates about how donations are being used

> [!TIP]
> The most successful fundraisers update their supporters regularly. Share stories, photos, and impact reports to keep donors engaged and encourage repeat donations.

---

**Need Help?** Don't hesitate to reach out:
- M-Changa Support: support@mchanga.africa
- Your Development Team: [Insert contact here]

**Document Version**: 1.0 | **Last Updated**: December 2024 | **Platform**: NRDC Donation System
