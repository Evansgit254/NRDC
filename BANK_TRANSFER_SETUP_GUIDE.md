# Bank Transfer Payment Setup Guide 🏦

This guide explains how to manage the Bank Transfer payment option on the NRDC platform. This feature allows donors to make direct deposits to your bank account and submit proof of payment for manual verification.

---

## Table of Contents
1. [Overview](#overview)
2. [Managing Bank Details](#managing-bank-details)
3. [The Donor Experience](#the-donor-experience)
4. [Verifying Donations](#verifying-donations)
5. [Reconciliation](#reconciliation)

---

## Overview

Unlike M-Changa which is automated, **Bank Transfers** are a manual process:
1. Donor selects "Bank Transfer" on the website.
2. System shows them your bank account details.
3. System saves a "Pending" donation record with a unique **Reference Number**.
4. Donor goes to their bank app/agent and makes the transfer.
5. Donor sends proof of payment (receipt) to your email.
6. Admin verifies the payment and marks the donation as "Completed".

**Why use this?**
- Good for large corporate donations.
- Alternative for donors who can't use Mobile Money.
- No platform fees (unlike paying through a gateway).

---

## Managing Bank Details

You can easily update the bank account information shown to donors from your Admin Dashboard.

### How to Update Bank Details
1. Log in to the **Admin Dashboard** (`/admin`).
2. Navigate to **Settings**.
3. Scroll down to the **Bank Account Details** section.
4. Fill in the fields:
   - **Account Name**: e.g., NRDC
   - **Account Number**: e.g., 01207150002
   - **Bank Name**: e.g., ABC Bank
   - **Branch**: e.g., Nairobi
   - **Swift Code**: (Optional, for international transfers)
   - **Bank Code & Branch Code**: (Helpful for local transfers)
5. Click **Save Changes**.

> [!IMPORTANT]
> Double-check these numbers! If they are wrong, donors might send money to the wrong account.

---

## The Donor Experience

1. **Selection**: On the Donate page, the donor clicks "Bank Transfer".
2. **Details**: They see your bank details immediately.
3. **Pledge**: They enter their amount and contact info.
4. **Instructions**: After clicking "Donate", they are taken to a summary page showing:
   - A unique **Reference Number** (e.g., `NRDC-BT-1734978...`).
   - Instructions to include this reference in their bank transfer narration.
   - Instructions to email proof of payment to you.

---

## Verifying Donations

Since the system cannot automatically check your bank account, you must verify these donations manually.

### Step-by-Step Verification
1. **Receive Email**: Watch for emails from donors with the subject "Bank Transfer Donation".
2. **Check Reference**: Note the Reference Number in the email.
3. **Check Bank Statement**: Log in to your actual online banking or check your statement. Look for a transaction matching the **Amount** and **Reference Number**.
4. **Update System**:
   - Go to **Admin Dashboard > Donations**.
   - Search for the donor's email or the Reference Number.
   - The donation status will be **Pending**.
   - If you received the money, change status to **Success** (or Completed).
   - If you never received the money after a few days, you can mark it as **Failed** or leave it as Pending.

> [!TIP]
> Create a standardized "Thank You" email to reply to donors once you've verified their payment.

---

## Reconciliation

It is recommended to reconcile bank transfer donations weekly.

1. Export "Pending" bank transfer donations from the Admin Panel.
2. Compare the list against your weekly bank statement.
3. Mark matched payments as "Success".
4. Follow up with donors whose payments haven't arrived if necessary.

---

## Support

If you need to change the technical bank transfer flow or email templates, please contact your technical support team.
