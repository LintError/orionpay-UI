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

```
orionpay-frontend/

src/
  app/        # Next.js App Router: routes, page components
  components/ # Reusable React components
  contexts/   # React context providers (e.g. theme)
  hooks/      # Shared React hooks
  store/      # State management
  utils/      # Helpers (incl. the Stellar SDK wrapper)
```

Note: there is no top-level `lib/` or `styles/` directory; shared
logic lives under `src/` as shown above. Styling is Tailwind CSS
(utility classes in `tailwind.config.ts`), not a `styles/` folder.

---

## Getting Started

Requires Node.js 18+ (CI runs 18 and 20). All Stellar operations in
this app talk to the **Stellar testnet** only, so you can run it safely
without a funded mainnet account.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Available scripts

```bash
npm run dev         # start the Next.js dev server
npm run build       # production build (next build)
npm run start       # serve the production build
npm run lint        # next lint
npm test            # run the test suite once (vitest run)
npm run test:watch  # run vitest in watch mode
```

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