import React, { useMemo, useState } from 'react'
import { WalletGate } from './WalletGate';
import Button from './Button';
import SuccessModal from './SuccessModal';
import { hashEmail } from '../../lib/hash-email';
import { hash, txSecret } from '@mistcash/crypto';
import { ERC20_ABI } from '@mistcash/config';
import { ChamberTypedContract, CHAMBER_ADDR_MAINNET } from '@mistcash/config';
import { Asset, fmtAmtToBigInt, getChamber } from '@mistcash/sdk';
import { useContract, useProvider, useSendTransaction } from '@starknet-react/core';
import { USDC_TOKEN, MIDDLEWARE_CONTRACT } from '@/lib/conf';

export default function DepositUI() {
	const [email, setEmail] = useState('');
	const [amount, setAmount] = useState('');
	const [random, setRandom] = useState(BigInt(Math.floor(Math.random() * 1e20)));
	// const [showSuccess, setShowSuccess] = useState(false);
	// const [shareLink, setShareLink] = useState('');
	const [showSuccess, setShowSuccess] = useState(true);
	const [shareLink, setShareLink] = useState(`${window.location.origin}/rcv/asdfsfd/example.com/425325`);
	const { sendAsync } = useSendTransaction({});
	const providerResult = useProvider();
	const provider = 'provider' in providerResult ? providerResult.provider : providerResult;

	const contract = useMemo(() => {
		return getChamber(provider);
	}, [provider]) as ChamberTypedContract;
	const { contract: usdcContract } = useContract({ abi: ERC20_ABI, address: USDC_TOKEN.id as `0x${string}` });

	const mistTransaction = async (secretInput: bigint, recipient: `0x${string}`, asset: Asset) => {
		if (!usdcContract) return;

		const txSecretValue = await txSecret(secretInput.toString(), recipient);

		// Execute the Mist deposit transaction (exactly like TransferUI)
		return await sendAsync([
			usdcContract.populate('approve', [CHAMBER_ADDR_MAINNET, asset.amount]),
			contract.populate('deposit', [txSecretValue, asset])
		]);
	}

	const handleSend = async () => {
		try {
			const emailHash = hashEmail(email);
			const result = await mistTransaction(
				await hash(emailHash, random),
				MIDDLEWARE_CONTRACT,
				{ amount: fmtAmtToBigInt(amount, USDC_TOKEN.decimals || 6), addr: USDC_TOKEN.id }
			);

			if (result) {
				// Parse email to extract user and domain
				const [emailUser, emailDomain] = email.split('@');
				const link = `${window.location.origin}/rcv/${emailUser}/${emailDomain}/${random}`;

				setShareLink(link);
				setShowSuccess(true);
			}
		} catch (error) {
			console.error('Transaction failed:', error);
			alert('❌ Transaction failed. Please try again.');
		}
	};

	return <div className="space-y-4">
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

		<SuccessModal
			isOpen={showSuccess}
			onClose={() => setShowSuccess(false)}
			shareLink={shareLink}
		/>
	</div>;
}
