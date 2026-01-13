# NRDC Platform

Welcome to the **Nutrition for Refugee & Displaced Communities (NRDC)** digital platform. This project is built with Next.js 15+, TypeScript, and Prisma ORM.

## 🚀 Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in the required keys.
   ```bash
   cp .env.example .env
   ```
3. **Database Setup**:
   Initialize the local SQLite database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔍 Forensic & Audit Documentation

This codebase has been specifically prepared for final review and integration optimization by the bank's digital department.

- **[Forensic Audit Summary](file:///home/evans/.gemini/antigravity/brain/5a5f4403-af98-4a6b-a754-969875ac6f14/forensic_audit_summary.md)**: Highlights of recent cleanups, optimizations, and security checks.
- **[Technical Spec Sheet](file:///home/evans/Projects/NRDC/Technical_Spec_Sheet_NRDC.pdf)**: Detailed requirements for bank transfer automation.
- **[Integration Readiness](file:///home/evans/Projects/NRDC/Technical_Implementation_Proof_NRDC.pdf)**: Proof of current "Ready to Integrate" architecture.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: Prisma (ORM) with SQLite/PostgreSQL
- **Styling**: Tailwind CSS
- **Media**: Cloudinary
- **Emails**: Resend / NodeMailer

---
*For any technical queries during the audit, please refer to the documentation in the `/docs` or root directory.*
