'use client';

import Image from 'next/image';
import { StarknetProvider } from '@/components/Providers';
import DepositUI from '@/components/DepositUI';

export default function Home() {

  return <StarknetProvider>
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <Image src="/logo.png" alt="mailMIST Logo" width={128} height={128} className="mx-auto mb-4" />
        <h3 className="text-3xl font-light mb-6 text-gray-900 text-center">Email Money In STealth</h3>

        <DepositUI />
      </div>
    </div>
  </StarknetProvider>;
}
