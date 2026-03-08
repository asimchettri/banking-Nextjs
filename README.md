# 🏦 Horizon — Banking Web Application

A full-stack banking platform built with **Next.js 14** that lets users securely link multiple bank accounts, view transactions, and transfer money to other users.

---

## 📸 Overview

Horizon is a modern financial SaaS application that connects to real bank accounts via **Plaid**, processes fund transfers through **Dwolla**, uses **Appwrite** for backend services, and monitors errors in real-time with **Sentry**.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-up and sign-in with Appwrite
- 🏛️ **Bank Linking** — Connect multiple bank accounts via Plaid Link
- 💳 **Bank Cards** — View all linked bank accounts with card UI
- 💸 **Money Transfer** — Send funds to other users via Dwolla
- 📊 **Transaction History** — Paginated, filterable transaction table per bank
- 📈 **Dashboard** — Animated balance counter, doughnut chart, and recent transactions
- 📱 **Responsive** — Mobile navigation + full desktop sidebar

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Auth & Database | [Appwrite](https://appwrite.io/) |
| Bank Data | [Plaid](https://plaid.com/) |
| Fund Transfers | [Dwolla](https://www.dwolla.com/) |
| Error Monitoring | [Sentry](https://sentry.io/) |
| Styling | Tailwind CSS |



## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- Accounts on: [Appwrite](https://appwrite.io/), [Plaid](https://plaid.com/), [Dwolla](https://www.dwolla.com/), [Sentry](https://sentry.io/)

### Installation

```bash
git clone https://github.com/your-username/banking.git
cd banking
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=
NEXT_APPWRITE_KEY=

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

# Dwolla
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox

# Sentry
SENTRY_AUTH_TOKEN=
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Key Integrations

### Plaid
Used for linking bank accounts and fetching real transaction data. `PlaidLink.tsx` handles the OAuth flow and `bank.actions.ts` exchanges the public token for an access token stored in Appwrite.

### Dwolla
Handles ACH fund transfers between users. `dwolla.actions.ts` manages customer creation and transfer initiation. Uses sandbox mode by default.

### Appwrite
Serves as the backend: authentication, user database, bank account storage, and transaction records. The server client in `lib/server/appwrite.ts` is used exclusively in Server Actions.

### Sentry
Monitors runtime errors. The `/api/sentry-example-api` route can be used to test your Sentry integration.

---

## 📄 License

This project is for educational and portfolio purposes.
