import {
  Account,
  Asset,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';
const networkPassphrase = Networks.TESTNET;

const fetchJson = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stellar request failed (${response.status}): ${errorText}`);
  }

  return response.json();
};

// Create a new Stellar keypair
export const createStellarAccount = async () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
};

// Get account balance
export const getAccountBalance = async (publicKey: string) => {
  try {
    const account = await fetchJson(`${HORIZON_URL}/accounts/${publicKey}`);
    const balances = account.balances.map((balance: any) => ({
      asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
      balance: parseFloat(balance.balance),
    }));
    return balances;
  } catch (error) {
    console.error('Error loading account:', error);
    throw error;
  }
};

// Fund testnet account (only works on testnet)
export const fundTestnetAccount = async (publicKey: string) => {
  try {
    return await fetchJson(`${FRIENDBOT_URL}?addr=${publicKey}`);
  } catch (error) {
    console.error('Error funding account:', error);
    throw error;
  }
};

// Base fee used when Horizon's fee statistics are unavailable.
export const BASE_FEE_STROOPS = '100';

// Fee (in stroops) that a transaction should pay. Networks reject transactions
// that pay less than the current minimum, so we prefer a live estimate.
export const getSuggestedFee = async (horizonUrl: string = HORIZON_URL): Promise<string> => {
  try {
    const feeStats = await fetchJson(`${horizonUrl}/fee_stats`);
    const baseFee = Number(feeStats?.min_fee?.base_fee);
    const p90Fee = Number(feeStats?.fee_charged?.p90 ?? feeStats?.max_fee?.fee_percentile_95);

    if (!Number.isFinite(baseFee) && !Number.isFinite(p90Fee)) {
      return BASE_FEE_STROOPS;
    }

    const fee = Math.max(
      Number.isFinite(p90Fee) ? p90Fee : 0,
      Number.isFinite(baseFee) ? baseFee : 0,
      Number(BASE_FEE_STROOPS)
    );

    return String(fee);
  } catch (error) {
    console.warn('Failed to fetch fee stats, falling back to base fee:', error);
    return BASE_FEE_STROOPS;
  }
};

// Submit a signed transaction to Horizon.
// Horizon accepts either:
//   - `application/x-www-form-urlencoded` with a `tx` field containing base64 XDR
//   - `application/x-stellar-xdr` with the raw base64 XDR body
// `application/xdr` is NOT a valid content type and results in a 400 from Horizon.
export const submitTransaction = async (
  transaction: Transaction,
  horizonUrl: string = HORIZON_URL
) => {
  return fetchJson(`${horizonUrl}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ tx: transaction.toXDR() }).toString(),
  });
};

export interface SendXLMOptions {
  /** Fee in stroops. Defaults to a live estimate from /fee_stats. */
  fee?: string;
  /** Transaction validity window in seconds. */
  timeout?: number;
  /** Override the Horizon base url (used in tests). */
  horizonUrl?: string;
}

export const DEFAULT_TX_TIMEOUT_SECONDS = 30;

// Timeout stays env-configurable so it can be tuned per deployment without a
// code change. Falls back to the default when the value is unset or invalid.
const resolveTimeout = (timeout?: number) => {
  if (typeof timeout === 'number' && Number.isFinite(timeout)) {
    return timeout;
  }

  // In Next.js, NEXT_PUBLIC_* env vars are embedded at build time, so we can
  // read them through process.env in both server and client bundles.
  // The type guard avoids a TS error when running in a non-Node environment.
  const configured = (typeof process !== 'undefined' && process.env
    ? process.env.NEXT_PUBLIC_STELLAR_TX_TIMEOUT
    : undefined) as string | undefined;
  const fromEnv = Number(configured);

  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_TX_TIMEOUT_SECONDS;
};

// Send XLM payment
export const sendXLM = async (
  senderSecret: string,
  destinationPublicKey: string,
  amount: string,
  options: SendXLMOptions = {}
) => {
  const horizonUrl = options.horizonUrl ?? HORIZON_URL;

  try {
    const sourceKeypair = Keypair.fromSecret(senderSecret);
    const sourceAccountResponse = await fetchJson(`${horizonUrl}/accounts/${sourceKeypair.publicKey()}`);
    const sourceAccount = new Account(sourceAccountResponse.account_id, sourceAccountResponse.sequence);

    const fee = options.fee ?? (await getSuggestedFee(horizonUrl));

    const transaction = new TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount,
        })
      )
      .setTimeout(resolveTimeout(options.timeout))
      .build();

    transaction.sign(sourceKeypair);

    const result = await submitTransaction(transaction, horizonUrl);

    return result;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (publicKey: string) => {
  try {
    const transactions = await fetchJson(
      `${HORIZON_URL}/accounts/${publicKey}/transactions?order=desc&limit=10&include_failed=false`
    );
    return transactions._embedded?.records ?? [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};