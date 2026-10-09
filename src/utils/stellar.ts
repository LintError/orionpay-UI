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

// Send XLM payment
export const sendXLM = async (
  senderSecret: string,
  destinationPublicKey: string,
  amount: string
) => {
  try {
    const sourceKeypair = Keypair.fromSecret(senderSecret);
    const sourceAccountResponse = await fetchJson(`${HORIZON_URL}/accounts/${sourceKeypair.publicKey()}`);
    const sourceAccount = new Account(sourceAccountResponse.account_id, sourceAccountResponse.sequence);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);

    const result = await submitTransaction(transaction);

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