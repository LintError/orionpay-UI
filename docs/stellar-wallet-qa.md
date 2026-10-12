# Stellar Wallet — Manual QA Notes

Covers the refresh-failure path (#17) and the transaction-history mapping (#16)
in `src/components/stellar/StellarWallet.tsx`.

## Refresh failure path (#17)

1. Create/import an account so balances and history load normally.
2. Confirm the balance card shows `Last updated <time>`.
3. Open browser DevTools → Network, enable **Offline** (or block
   `horizon-testnet.stellar.org`).
4. Wait for the next 30s poll, or click **Refresh**.
5. Expected:
   - A single `Failed to refresh balances` error toast appears.
   - The balance card switches to `Stale data — refresh failed`.
   - The previous balance stays visible (it is not blanked out).
   - `console.error('Error loading account data:', ...)` is still logged.
   - Additional poll ticks while still offline do **not** stack more toasts.
6. Go back **Online** and click **Refresh**.
7. Expected: a `Balances refreshed` success toast, the timestamp updates, and
   the stale indicator disappears.

## Transaction history (#16)

1. Send a small XLM payment to another account (`sendXLM`).
2. Expected: a history row appears showing the real amount (`<n> XLM`) and a
   truncated destination — never `unknown` / `0 XLM`.
3. On a brand-new account with no history, expected: `No transactions yet.`
4. While offline (see above), expected: `Could not load transactions. Try
   refreshing.` instead of stale rows presented as live data.

## Regression checks

- `npm run build` / typecheck still pass (no local `node_modules` needed for
  review, CI runs it).
- Account creation still reports success even when the follow-up balance load
  fails.
