import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createStellarAccount } from './stellar';

describe('Stellar Utilities', () => {
  test('should create a valid Stellar keypair', () => {
    const account = createStellarAccount();
    
    // Public key should start with G (Stellar public key format)
    assert.match(account.publicKey, /^G/);
    assert.strictEqual(account.publicKey.length, 56);
    
    // Secret key should start with S (Stellar secret key format)
    assert.match(account.secretKey, /^S/);
    assert.strictEqual(account.secretKey.length, 56);
  });

  test('should create unique accounts on each call', () => {
    const account1 = createStellarAccount();
    const account2 = createStellarAccount();
    
    assert.notStrictEqual(account1.publicKey, account2.publicKey);
    assert.notStrictEqual(account1.secretKey, account2.secretKey);
  });
});