# Stellar Wave Program - Open Issues

Below are the issues available for contributors to work on as part of the Stellar Wave Program. All issues are labeled `Stellar Wave` on GitHub.

## Trivial Issues (100 Points)

### 1. Add proper error handling for Stellar network failures
**Description**: Currently, if the Stellar Horizon API is unavailable or returns an error, the wallet doesn't show user-friendly error messages. Add comprehensive error handling with toast notifications for all Stellar operations.

**Files to modify**:
- `src/utils/stellar.ts` - Add try/catch with meaningful error messages
- `src/components/stellar/StellarWallet.tsx` - Improve error display

**Skills needed**: TypeScript, React, basic Stellar SDK knowledge

---

### 2. Improve Stellar wallet mobile responsiveness
**Description**: The StellarWallet component needs better responsive design for mobile devices. The two-column layout breaks on smaller screens.

**Files to modify**:
- `src/components/stellar/StellarWallet.tsx` - Update grid layout for mobile
- Tailwind CSS classes adjustment

**Skills needed**: CSS/Tailwind, React

---

### 3. Add security warning when copying secret key
**Description**: When users copy their Stellar secret key, show a warning about never sharing it with anyone. Add a confirmation dialog that explains the risks before copying.

**Files to modify**:
- `src/components/stellar/StellarWallet.tsx`

**Skills needed**: React, TypeScript

---

### 4. Add Stellar Explorer links to transactions
**Description**: For each transaction in the history, add a link to Stellar Explorer (https://stellar.expert/explorer/testnet/tx/[TX_ID]) so users can view transaction details.

**Files to modify**:
- `src/components/stellar/StellarWallet.tsx`

**Skills needed**: React, basic Stellar knowledge

---

## Medium Issues (150 Points)

### 5. Add USDC support on Stellar
**Description**: Extend the wallet to support USDC (the native USD stablecoin on Stellar). Add the ability to view USDC balances and send USDC payments between accounts.

**Resources**: 
- Stellar USDC contract: `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`

**Files to modify**:
- `src/utils/stellar.ts` - Add USDC asset definition
- `src/components/stellar/StellarWallet.tsx` - Update UI to show multiple assets

**Skills needed**: TypeScript, Stellar SDK, React

---

### 6. Implement Stellar path payments
**Description**: Add support for Stellar path payments to allow cross-asset transfers. This lets users send one asset and the recipient receives another, with automatic conversion.

**Files to modify**:
- `src/utils/stellar.ts` - Add path payment operation
- `src/components/stellar/StellarWallet.tsx` - Add UI for cross-asset sends

**Skills needed**: Advanced Stellar SDK, TypeScript

---

### 7. Add transaction status indicators
**Description**: Show visual indicators for transaction status (pending, confirmed, failed). Add real-time status polling until transactions are confirmed on the network.

**Files to modify**:
- `src/utils/stellar.ts` - Add transaction status checking
- `src/components/stellar/StellarWallet.tsx` - Add status UI

**Skills needed**: React, Stellar SDK

---

## High Issues (200 Points)

### 8. Add Stellar anchor integration
**Description**: Integrate with a Stellar testnet anchor to demonstrate fiat onramps/offramps. Connect to a testnet anchor to allow depositing and withdrawing fiat via traditional payment methods.

**Resources**:
- Stellar Anchor Documentation: https://developers.stellar.org/docs/anchors

**Files to modify**:
- `src/utils/stellar.ts` - Add SEP-10, SEP-24 integration
- `src/components/stellar/` - Add anchor UI components

**Skills needed**: Advanced Stellar (SEP standards), TypeScript, React

---

### 9. Multi-signature wallet support
**Description**: Add support for Stellar multi-signature accounts. Allow users to create multi-sig accounts, add signers, and require multiple signatures for transactions.

**Files to modify**:
- `src/utils/stellar.ts` - Add multi-sig operations
- `src/components/stellar/` - Create multi-sig management UI

**Skills needed**: Advanced Stellar features, TypeScript, React

---

### 10. Add Stellar smart contract (Soroban) integration
**Description**: Integrate with Soroban, Stellar's smart contract platform. Add the ability to deploy and interact with simple smart contracts from the wallet.

**Resources**:
- Soroban Documentation: https://developers.stellar.org/docs/soroban

**Files to modify**:
- `src/utils/stellar.ts` - Add Soroban SDK integration
- `src/components/stellar/` - Add smart contract interaction UI

**Skills needed**: Soroban/Smart Contracts, Advanced Stellar, TypeScript