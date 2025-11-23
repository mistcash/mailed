'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StarknetProvider } from '@/components/Providers';
import { WalletGate } from '../components/WalletGate';
import Button from '@/components/Button';

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    console.log({ email, amount });
  };

  return <StarknetProvider>
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <Image src="/logo.png" alt="mailMIST Logo" width={128} height={128} className="mx-auto mb-4" />
        <h3 className="text-3xl font-light mb-6 text-gray-900 text-center">Email Money In STealth</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full p-3 border border-black/30 focus:border-cyan-500 focus:outline-none rounded-lg bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min={0}
              className="w-full p-3 border border-black/30 focus:border-cyan-500 focus:outline-none rounded-lg bg-white text-gray-900"
            />
          </div>

          <WalletGate>
            <Button onClick={handleSend}>
              Send
            </Button>
          </WalletGate>
        </div>
      </div>
    </div>
  </StarknetProvider>;
}
