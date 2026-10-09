import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import { BASE_FEE_STROOPS, createStellarAccount, getSuggestedFee, sendXLM, submitTransaction } from './stellar.ts';

interface CapturedRequest {
  url: string;
  init: RequestInit;
}

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
          asset: Asset.native(),
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

describe('getSuggestedFee', () => {
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;

  const mockFeeStats = (stats: unknown) => {
    globalThis.fetch = (async () => ({
      ok: true,
      status: 200,
      json: async () => stats,
      text: async () => JSON.stringify(stats),
    })) as typeof fetch;
  };

  const mockFailure = () => {
    globalThis.fetch = (async () => ({
      ok: false,
      status: 503,
      json: async () => ({}),
      text: async () => 'service unavailable',
    })) as typeof fetch;
  };

  beforeEach(() => {
    console.warn = () => {};
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
  });

  test('queries the fee_stats endpoint', async () => {
    let requestedUrl = '';
    globalThis.fetch = (async (url: any) => {
      requestedUrl = String(url);
      return {
        ok: true,
        status: 200,
        json: async () => ({ min_fee: { base_fee: '100' }, fee_charged: { p90: '200' } }),
      } as any;
    }) as typeof fetch;

    await getSuggestedFee();

    assert.match(requestedUrl, /\/fee_stats$/);
  });

  test('uses the p90 fee when it exceeds the base fee', async () => {
    mockFeeStats({
      min_fee: { base_fee: '100' },
      fee_charged: { p90: '5000' },
    });

    assert.strictEqual(await getSuggestedFee(), '5000');
  });

  test('falls back to the base fee when the network is quiet', async () => {
    mockFeeStats({
      min_fee: { base_fee: '100' },
      fee_charged: { p90: '100' },
    });

    assert.strictEqual(await getSuggestedFee(), '100');
  });

  test('never returns a fee below the base fee', async () => {
    mockFeeStats({
      min_fee: { base_fee: '250' },
      fee_charged: { p90: '10' },
    });

    assert.strictEqual(await getSuggestedFee(), '250');
  });

  test('falls back to the base fee when the fee endpoint fails', async () => {
    mockFailure();

    assert.strictEqual(await getSuggestedFee(), BASE_FEE_STROOPS);
  });

  test('falls back to the base fee when the response is malformed', async () => {
    mockFeeStats({});

    assert.strictEqual(await getSuggestedFee(), BASE_FEE_STROOPS);
  });
});

describe('sendXLM', () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const horizonUrl = 'https://horizon.test';

  let sender: { publicKey: string; secretKey: string };
  let requests: CapturedRequest[] = [];

  const jsonResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

  // Responds to the account lookup, the fee stats call and the submission.
  const mockHorizon = (feeStats?: unknown, feeStatsOk = true) => {
    globalThis.fetch = (async (url: any, init: any) => {
      const target = String(url);
      requests.push({ url: target, init: init ?? {} });

      if (target.endsWith('/transactions')) {
        return jsonResponse({ hash: 'abc123' }) as any;
      }
      if (target.endsWith('/fee_stats')) {
        return (feeStatsOk
          ? jsonResponse(feeStats ?? {})
          : { ok: false, status: 500, json: async () => ({}), text: async () => 'boom' }) as any;
      }
      return jsonResponse({
        account_id: sender.publicKey,
        sequence: '12345',
        balances: [],
      }) as any;
    }) as typeof fetch;
  };

  beforeEach(async () => {
    sender = await createStellarAccount();
    requests = [];
    console.error = () => {};
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  });

  const submissionRequest = () => requests.find((request) => request.url.endsWith('/transactions'));
  const submittedFee = () => {
    const body = String(submissionRequest()?.init.body);
    const xdr = new URLSearchParams(body).get('tx');
    return TransactionBuilder.fromXDR(xdr as string, Networks.TESTNET).fee;
  };

  test('builds the transaction with the fee from /fee_stats', async () => {
    mockHorizon({ min_fee: { base_fee: '100' }, fee_charged: { p90: '4200' } });

    await sendXLM(sender.secretKey, Keypair.random().publicKey(), '1', { horizonUrl });

    assert.strictEqual(submittedFee(), '4200');
  });

  test('builds the transaction with the base fee when /fee_stats fails', async () => {
    mockHorizon(undefined, false);

    await sendXLM(sender.secretKey, Keypair.random().publicKey(), '1', { horizonUrl });

    assert.strictEqual(submittedFee(), BASE_FEE_STROOPS);
  });

  test('uses an explicitly provided fee without calling /fee_stats', async () => {
    mockHorizon({ min_fee: { base_fee: '100' }, fee_charged: { p90: '4200' } });

    await sendXLM(sender.secretKey, Keypair.random().publicKey(), '1', {
      horizonUrl,
      fee: '777',
    });

    assert.strictEqual(submittedFee(), '777');
    assert.strictEqual(requests.some((request) => request.url.endsWith('/fee_stats')), false);
  });

  test('submits the signed transaction as form-urlencoded XDR', async () => {
    mockHorizon({ min_fee: { base_fee: '100' }, fee_charged: { p90: '100' } });

    const destination = Keypair.random().publicKey();
    const result = await sendXLM(sender.secretKey, destination, '2.5', { horizonUrl });

    assert.deepStrictEqual(result, { hash: 'abc123' });

    const submission = submissionRequest();
    assert.strictEqual((submission?.init.headers as Record<string, string>)['Content-Type'], 'application/x-www-form-urlencoded');

    const transaction = TransactionBuilder.fromXDR(
      new URLSearchParams(String(submission?.init.body)).get('tx') as string,
      Networks.TESTNET
    );

    const payment = transaction.operations[0];
    const paymentDestination = payment.destination as { accountId: () => string } | undefined;

    assert.strictEqual(paymentDestination?.accountId(), destination);
    assert.strictEqual(payment.amount, '2.5');
  });
});