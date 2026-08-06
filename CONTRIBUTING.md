# Contributing to OrionPay

Thank you for your interest in contributing to OrionPay! We're part of the **Stellar Wave Program** and welcome contributions from the community.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Basic understanding of Stellar blockchain
- Familiarity with Next.js and React

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/orionpay-UI.git`
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Stellar Wave Issues
Look for issues labeled `Stellar Wave` to find tasks you can work on. Issues are categorized by complexity:

### Complexity Levels
- **Trivial (100 points)**: Small fixes, typos, documentation updates
- **Medium (150 points)**: New features, bug fixes, UI improvements  
- **High (200 points)**: Complex integrations, major features, architecture changes

## Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── common/          # Shared UI components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── stellar/         # Stellar blockchain integration
│   └── ui/              # Base UI components (Button, Input, Card)
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── store/               # Redux store
└── utils/               # Utility functions
    └── stellar.ts       # Stellar SDK utilities
```

## Stellar Integration Tasks
All issues related to Stellar blockchain integration start in the `src/utils/stellar.ts` and `src/components/stellar/StellarWallet.tsx` files.

### Current Stellar Features Implemented
- ✅ Create Stellar accounts
- ✅ Fund testnet accounts via Friendbot
- ✅ Check account balances
- ✅ Send XLM payments
- ✅ View transaction history

## Code Standards
- Use TypeScript for all new code
- Follow existing code style and formatting
- Write meaningful commit messages
- Test your changes before submitting a PR

## Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Submit a PR with a clear description of what you've built
4. Wait for review from maintainers
5. Address any feedback and get your PR merged

## Questions?
If you have questions about any issue, please ask in the issue comments. We're happy to help you get started!