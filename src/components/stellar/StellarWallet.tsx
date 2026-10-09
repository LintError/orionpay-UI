'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Wallet, Send, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import { 
  createStellarAccount, 
  getAccountBalance, 
  fundTestnetAccount, 
  sendXLM,
  getTransactionHistory
} from '@/src/utils/stellar';
import toast from 'react-hot-toast';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import Card from '@/src/components/ui/Card';
import { useAccountPolling } from '@/src/hooks/useAccountPolling';

interface Transaction {
  id: string;
  created_at: string;
  source_account: string;
  to: string;
  amount: string;
}

export default function StellarWallet() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<string>('');
  const [sendForm, setSendForm] = useState({
    destination: '',
    amount: ''
  });
  const [showSecret, setShowSecret] = useState<boolean>(false);
  // Incremented per request so responses that arrive out of order (slow Horizon,
  // slow connection) are discarded instead of overwriting fresher state.
  const requestIdRef = useRef<number>(0);

  // Create new account
  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const account = await createStellarAccount();
      setPublicKey(account.publicKey);
      setSecretKey(account.secretKey);
      toast.success('New Stellar account created!');
      
      // Fund testnet account
      await fundTestnetAccount(account.publicKey);
      toast.success('Testnet XLM added to your account!');
      
      // Load balances
      await loadAccountData(account.publicKey);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Load account data
  const loadAccountData = useCallback(async (pubKey: string) => {
    const requestId = ++requestIdRef.current;

    try {
      const [accountBalances, txHistory] = await Promise.all([
        getAccountBalance(pubKey),
        getTransactionHistory(pubKey),
      ]);

      // A newer request already started (or the account changed); this response
      // is stale, so drop it instead of flashing older state.
      if (requestId !== requestIdRef.current) {
        return;
      }

      setBalances(accountBalances);
      setTransactions(
        txHistory.map((tx: any) => ({
          id: tx.id,
          created_at: tx.created_at,
          source_account: tx.source_account,
          to: tx.operations?.records?.[0]?.destination || 'unknown',
          amount: tx.operations?.records?.[0]?.amount || '0'
        }))
      );
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      console.error('Error loading account data:', error);
    }
  }, []);

  // Refresh data periodically without overlapping requests
  const { refresh } = useAccountPolling({
    publicKey,
    loadAccountData,
  });

  // Refresh balances
  const handleRefresh = async () => {
    if (publicKey) {
      await refresh();
      toast.success('Balances refreshed');
    }
  };

  // Send payment
  const handleSendPayment = async () => {
    if (!secretKey || !sendForm.destination || !sendForm.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await sendXLM(secretKey, sendForm.destination, sendForm.amount);
      toast.success('Payment sent successfully!');
      setSendForm({ destination: '', amount: '' });
      // Show the new balance right away instead of waiting for the next poll.
      await refresh();
    } catch (error) {
      toast.error('Failed to send payment');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const xlmBalance = balances.find(b => b.asset === 'XLM')?.balance || 0;

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-blue-500" />
          Stellar Wallet
        </h2>
        {publicKey && (
          <Button 
            onClick={handleRefresh} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
      </div>

      {!publicKey ? (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create your Stellar account</h3>
          <p className="text-gray-500 mb-6">Start sending and receiving XLM on the Stellar network</p>
          <Button onClick={handleCreateAccount} disabled={loading} className="px-8">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Public Key</span>
                <button 
                  onClick={() => copyToClipboard(publicKey, 'public')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {copied === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono break-all">{publicKey}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Secret Key</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(secretKey, 'secret')}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {copied === 'secret' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono break-all">
                {showSecret ? secretKey : '•'.repeat(56)}
              </p>
            </div>

            {/* Balance */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80 mb-1">Available Balance</p>
              <p className="text-4xl font-bold">{xlmBalance.toFixed(2)} XLM</p>
            </div>
          </div>

          {/* Send Payment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send XLM
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="Destination Public Key"
                value={sendForm.destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendForm({...sendForm, destination: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Amount (XLM)"
                value={sendForm.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendForm({...sendForm, amount: e.target.value})}
              />
              <Button 
                onClick={handleSendPayment} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Payment'}
              </Button>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Recent Transactions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs">
                      <div className="flex justify-between">
                        <span className="font-mono truncate">{tx.id.slice(0, 12)}...</span>
                        <span className="text-green-500">{tx.amount} XLM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};