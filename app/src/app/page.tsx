'use client';

import { StarknetProvider } from '@/components/Providers';
import DepositUI from '@/components/DepositUI';
import PageWrapper from '@/components/PageWrapper';

export default function Home() {

  return <StarknetProvider>
    <PageWrapper title="Email Money In STealth">
      <DepositUI />
    </PageWrapper>
  </StarknetProvider>;
}
