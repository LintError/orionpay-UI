# 🌌 OrionPay Frontend

**Stellar-Powered AI Multi-Chain Payment Dashboard**

## Overview

OrionPay is a comprehensive payment platform built on the Stellar network, featuring AI-powered tools for modern crypto payments. Our platform leverages Stellar's fast, low-cost transactions to deliver a seamless payment experience.

- **Native Stellar Integration**: Complete wallet functionality for creating accounts, checking balances, and sending XLM payments
- Multi-chain support beyond Stellar (Ethereum, Polygon, Solana)
- Bulk payments & payroll automation
- AI fraud detection & risk scoring
- Voice-initiated transactions
- Modular marketplace for extended features

---

## Features

### 💸 Payments
- Send payments
- Payment links
- Transaction history
- Wallet management

### 📦 Bulk Payments
- CSV uploads
- Payroll payouts
- Batch payments

### 🎙️ Voice Commands
- Voice‑initiated payments
- Natural language transactions
- AI intent detection

Example:
"Send 50 USDC to John"

### 🤖 AI Features
- Fraud detection
- Risk scoring
- Price analysis
- Smart routing

### ⭐ Stellar Network Features
- **Complete Wallet Integration**: Create Stellar accounts, fund testnet accounts, and manage balances
- **Native XLM Payments**: Send and receive XLM with Stellar's ultra-fast transaction finality
- **Transaction History**: Real-time transaction tracking with Horizon API integration
- **Testnet Ready**: Full testnet support for development and testing
- Built on Stellar's low-fee, high-throughput network

### 🔗 Additional Multi-Chain Support
- Ethereum
- Polygon
- Solana

### 🧩 Module Marketplace
- Escrow
- Payroll
- Subscriptions
- Split payments

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind
- React Query

---

## Project Structure

orionpay-frontend/

app/
components/
lib/
hooks/
styles/

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Configuration

The Stellar endpoints are environment-driven with testnet defaults, so you can point the
app at a local Horizon server or a different network without editing `src/utils/stellar.ts`.
Copy the committed `.env.example` to `.env.local` and set the values you need:

```bash
cp .env.example .env.local
```

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon endpoint for account, fee, and transaction calls |
| `NEXT_PUBLIC_FRIENDBOT_URL` | `https://friendbot.stellar.org` | Friendbot endpoint used to fund a testnet account (leave empty where there is none) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` | `testnet` (default) or `public`/`mainnet`; a non-testnet value also needs a matching `NEXT_PUBLIC_HORIZON_URL` |
| `NEXT_PUBLIC_STELLAR_TX_TIMEOUT` | `30` | settlement timeout in seconds |

`NEXT_PUBLIC_*` values are inlined into the browser bundle at build time, so keep them
non-sensitive. A value that is unset, empty, or whitespace falls back to the default above.

## Stellar Integration Features

Our Stellar implementation includes:
- Account creation using Stellar SDK
- Testnet funding via Friendbot
- Real-time balance tracking
- XLM payment processing
- Transaction history retrieval
- Secure key management

All Stellar operations connect to the Stellar testnet for safe development and demonstration. Visit our [Stellar documentation](https://developers.stellar.org/) to learn more about the Stellar network.

---

## License

MIT