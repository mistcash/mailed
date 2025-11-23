'use client';

import { StarknetConfig, alchemyProvider, voyager } from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';
import { ReactNode } from 'react';

export function StarknetProvider({ children }: { children: ReactNode }) {
	const provider = alchemyProvider({ apiKey: 'D3fHj1li_ynslzT0L1fYt' });

	return (
		<StarknetConfig chains={[mainnet]} provider={provider} explorer={voyager} autoConnect={true}>
			{children}
		</StarknetConfig>
	);
}
