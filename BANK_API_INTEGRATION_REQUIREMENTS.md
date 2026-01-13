# Technical Requirements: Automated Bank Reconciliation API 🚀

This document outlines the requirements for integrating the NRDC donation platform directly with the bank's API/Webhook system. The goal is to move from manual verification to **Real-Time Automated Reconciliation**.

---

## 1. Project Overview
The NRDC platform generates unique **Donation Reference Numbers** (e.g., `NRDC-BT-XXXXXXXXXX`) for every bank transfer pledge. We require an automated way to receive a notification when a transaction matching a reference number is successfully posted to our account.

---

## 2. Integration Requirements

### A. Real-Time Webhooks (Preferred)
The bank's system should trigger a `POST` request to our secure callback URL whenever a credit transaction hits the account.

- **Endpoint**: `https://www.nrdc.org/api/payments/bank-transfer/callback`
- **Payload Requirements**:
    - `transaction_id`: The bank's unique transaction reference.
    - `amount`: The amount credited.
    - `currency`: Currency of the transaction (e.g., KES).
    - `narration/reference`: The field containing our `NRDC-BT-` reference.
    - `timestamp`: Date and time of the transaction.

### B. Transaction Query API (Alternative/Fallback)
If webhooks are not available, we require an API to query transactions programmatically.
- **Resource**: `GET /transactions`
- **Filter**: Should allow filtering by `TransactionDate` or `ReferenceID`.
- **Response**: List of transactions in JSON format.

---

## 3. Security Protocols
To ensure the integrity of financial data, we require the following security measures:
- **Authentication**: OAuth2.0 (Client Credentials Flow) or Secure API Keys.
- **Message Integrity**: HMAC signatures for webhook payloads to prevent spoofing.
- **IP Whitelisting**: The bank should provide an IP range for their callback servers.
- **Encryption**: All communication must be over TLS 1.2 or higher.

---

## 4. Operational Logic
1.  **Donation Initiation**: NRDC system creates a "Pending" record with a reference ID.
2.  **Credit Notification**: Bank API sends a successful credit notification.
3.  **Matching Logic**: NRDC system extracts the reference from the narration field.
4.  **Auto-Update**: If reference matches, the donation is marked as **"Success"**.
5.  **Receipt Generation**: System automatically emails the donor a tax-deductible receipt.

---

## 5. Next Steps for Bank Tech Team
We would appreciate documentation on:
1.  Available API Sandboxes/Testing environments.
2.  The standard schema for your Webhook payloads.
3.  Onboarding requirements (IP whitelists, Digital Certificates, etc.).
