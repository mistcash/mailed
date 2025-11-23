import { useStarknetkitConnectModal } from "starknetkit";
import { useConnect, useAccount, } from '@starknet-react/core';

import { useState } from 'react';
import Button from "./Button";

interface WalletGateProps {
	children: React.ReactNode;
	label?: string | React.ReactNode;
	connectedClass?: string;
}
export function WalletGate({ children, label }: WalletGateProps) {
	const [isConnecting, setIsConnecting] = useState(false);
	const { connect, connectors } = useConnect();
	const { address } = useAccount();
	const { starknetkitConnectModal } = useStarknetkitConnectModal({
		connectors: connectors
	})

	async function connectWallet() {
		setIsConnecting(true)
		try {
			const { connector } = await starknetkitConnectModal()
			if (connector) {
				connect({ connector })
			}
		} catch (error) {
			console.error("Failed to connect wallet:", error)
		} finally {
			setIsConnecting(false)
		}
	}

	return address ?
		children
		:
		<Button disabled={isConnecting} onClick={connectWallet}>
			{label || 'Connect Wallet'}
		</Button>;
}