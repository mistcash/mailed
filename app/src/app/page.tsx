'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    console.log({ email, amount });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Send money</h1>

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
              className="w-full p-3 border border-black/30 focus:border-cyan-500 focus:outline-none rounded-lg bg-white text-gray-900"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
