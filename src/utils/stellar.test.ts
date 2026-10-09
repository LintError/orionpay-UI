import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { Account, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import { createStellarAccount, submitTransaction } from './stellar.ts';

describe('Stellar Utilities', () => {
  test('should create a valid Stellar keypair', async () => {
    const account = await createStellarAccount();

    // Public key should start with G (Stellar public key format)
    assert.match(account.publicKey, /^G/);
    assert.strictEqual(account.publicKey.length, 56);

    // Secret key should start with S (Stellar secret key format)
    assert.match(account.secretKey, /^S/);
    assert.strictEqual(account.secretKey.length, 56);
  });

  test('should create unique accounts on each call', async () => {
    const account1 = await createStellarAccount();
    const account2 = await createStellarAccount();

    assert.notStrictEqual(account1.publicKey, account2.publicKey);
    assert.notStrictEqual(account1.secretKey, account2.secretKey);
  });
});

interface CapturedRequest {
  url: string;
  init: RequestInit;
}

describe('submitTransaction', () => {
  const originalFetch = globalThis.fetch;
  let requests: CapturedRequest[] = [];

  const buildSignedTransaction = () => {
    const keypair = Keypair.random();
    const source = new Account(keypair.publicKey(), '1');
    const transaction = new TransactionBuilder(source, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: Keypair.random().publicKey(),
          asset: 'native',
          amount: '1',
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(keypair);
    return transaction;
  };

  beforeEach(() => {
    requests = [];
    globalThis.fetch = (async (url: any, init: any) => {
      requests.push({ url: String(url), init: init ?? {} });
      return {
        ok: true,
        status: 200,
        json: async () => ({ hash: 'fake-hash' }),
        text: async () => JSON.stringify({ hash: 'fake-hash' }),
      };
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('posts to the transactions endpoint', async () => {
    await submitTransaction(buildSignedTransaction());

    assert.strictEqual(requests.length, 1);
    assert.match(requests[0].url, /\/transactions$/);
    assert.strictEqual(requests[0].init.method, 'POST');
  });

  test('uses the documented form-urlencoded content type, not application/xdr', async () => {
    await submitTransaction(buildSignedTransaction());

    const headers = requests[0].init.headers as Record<string, string>;
    assert.strictEqual(headers['Content-Type'], 'application/x-www-form-urlencoded');
  });

  test('sends the base64 XDR in a form-urlencoded `tx` field', async () => {
    const transaction = buildSignedTransaction();
    await submitTransaction(transaction);

    const body = String(requests[0].init.body);
    const params = new URLSearchParams(body);

    assert.strictEqual(params.get('tx'), transaction.toXDR());
    assert.ok(body.startsWith('tx='));
  });

  test('respects a custom horizon url', async () => {
    await submitTransaction(buildSignedTransaction(), 'https://horizon.example.com');

    assert.strictEqual(requests[0].url, 'https://horizon.example.com/transactions');
  });
});