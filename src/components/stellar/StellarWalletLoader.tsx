"use client";

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import StellarWallet with SSR disabled to fix Stellar SDK issues
const StellarWallet = dynamic(() => import('@/src/components/stellar/StellarWallet'), {
  ssr: false,
  loading: () => <div className="text-center py-12">Loading wallet...</div>
});

export default function WalletSection() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading wallet...</div>}>
      <StellarWallet />
    </Suspense>
  );
}
