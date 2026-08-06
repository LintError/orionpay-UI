import StellarSDK from '@stellar/stellar-sdk';
const { Server, Keypair, TransactionBuilder, Operation, Asset, Networks } = StellarSDK;

// Initialize Stellar server (using testnet for development)
const server = new Server('https://horizon-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;

// Create a new Stellar keypair
export const createStellarAccount = () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
};

// Get account balance
export const getAccountBalance = async (publicKey: string) => {
  try {
    const account = await server.loadAccount(publicKey);
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
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    return await response.json();
  } catch (error) {
    console.error('Error funding account:', error);
    throw error;
  }
};

// Send XLM payment
export const sendXLM = async (
  senderSecret: string,
  destinationPublicKey: string,
  amount: string
) => {
  try {
    const sourceKeypair = Keypair.fromSecret(senderSecret);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

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
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (publicKey: string) => {
  try {
    const transactions = await server.transactions()
      .forAccount(publicKey)
      .limit(10)
      .order('desc')
      .call();
    return transactions.records;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};