'use client';

if (!Buffer.prototype.writeBigUInt64BE) {
	Buffer.prototype.writeBigUInt64BE = function (value: unknown, offset = 0) {
		if (typeof value !== 'bigint') {
			throw new TypeError('value must be a BigInt');
		}
		if (offset < 0 || offset + 8 > this.length) {
			throw new RangeError('offset out of range');
		}

		const view = new DataView(new ArrayBuffer(8));
		view.setBigUint64(0, value, false); // false = big-endian
		const bytes = new Uint8Array(view.buffer);
		for (let i = 0; i < 8; i++) {
			this[offset + i] = bytes[i];
		}
		return offset + 8;
	};
}

import React, { useState, useEffect, use } from 'react';
import { useMist, useNoirProof } from '@mistcash/react';
import { useProvider, useSendTransaction } from '@starknet-react/core';
import { calculateMerkleRootAndProof, hash, txHash, txSecret } from '@mistcash/crypto';
import { hashEmail } from '../../lib/hash-email';
import { MIDDLEWARE_CONTRACT, USDC_TOKEN } from '@/lib/conf';
import Button from './Button';
import { init as garagaInit } from 'garaga';
import { fmtAmtToBigInt } from '@mistcash/sdk';
import { WitnessData } from '@mistcash/config';

interface ClaimProofProps {
	email: string;
	amount: string;
	random: string;
}

let emailHash = 0n, amt = 0n, claimingKey = 0n, tx_hash = 0n, index = -2;

export default function ClaimProof({ email, amount, random }: ClaimProofProps) {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const [txLeaves, setLeaves] = useState<bigint[]>([]);
	const [proofData, setProofData] = useState<object | null>(null);
	const [recipient, setRecipient] = useState('');
	const [leafIndex, setLeafIndex] = useState(-2);

	const { contract } = useMist(useProvider(), useSendTransaction({}));
	const { generateProof, generateCalldata } = useNoirProof();

	const { setTo, setKey, fetchAsset, updateTxLeaves } = useMist(useProvider(), useSendTransaction({}));

	useEffect(() => {
		garagaInit();
		(async () => {
			const newLeaves = await updateTxLeaves();
			setLeaves(newLeaves);
			emailHash = hashEmail(email);
			claimingKey = await hash(emailHash, BigInt(random));
			amt = fmtAmtToBigInt(amount, USDC_TOKEN.decimals || 6);

			tx_hash = await txHash(claimingKey.toString(), MIDDLEWARE_CONTRACT, USDC_TOKEN.id, amt.toString());

			index = newLeaves.indexOf(tx_hash);
			setLeafIndex(index);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amount, email, random]);

	const handleGenerateProof = async () => {
		setError('');
		setLoading(true);
		setLoadingText('Checking transaction...');

		const merkle_root = await contract?.merkle_root() as bigint;
		// const new_tx_secret = await txSecret(claimingKey.toString(), recipient);
		const tx_index = txLeaves.indexOf(tx_hash);
		const merkleProofWRoot = calculateMerkleRootAndProof(txLeaves, tx_index);
		const merkleProof = merkleProofWRoot.slice(0, merkleProofWRoot.length - 1).map(bi => bi.toString());

		const witness: WitnessData = {
			claiming_key: claimingKey.toString(),
			recipient,
			asset: {
				addr: USDC_TOKEN.id,
				amount: amt.toString(),
			},
			proof: [...merkleProof, ...new Array(20 - merkleProof.length).fill('0')],
			root: merkle_root.toString(),
			new_tx_secret: '0xbababa', // For demo
			new_tx_amount: amt.toString(),
		};

		try {
			setLoadingText('Generating ZK proof...');
			const proof = generateProof(witness);
			const claimData = {
				proof,
				email,
				leafIndex,
			};

			// Send to backend API
			const response = await fetch('/api/claim', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(claimData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to process claim');
			}

			const result = await response.json();
			setProofData(result);
		} catch (error) {
			console.error("Failed to process withdraw:", error);
		} finally {
			setLoading(false);
			setLoadingText('');
		};
	};

	if (proofData) {
		return (
			<div className="space-y-4">
				<div className="text-center">
					<p className="text-green-600 font-medium mb-2">✅ Claim successful!</p>
					<p className="text-sm text-gray-600 mb-4">
						{amount} {USDC_TOKEN.name} has been claimed to {recipient}.
					</p>
				</div>
				<div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
					<pre className="text-xs overflow-auto max-h-64">{JSON.stringify(proofData, null, 2)}</pre>
				</div>
			</div>
		);
	}

	return <>
		{leafIndex == -2 ?
			<p>Loading...</p>
			: leafIndex == -1 ?
				<p className="text-sm text-red-800 font-medium">Error: Could not find the transaction in the leaves.</p>
				:
				<div className="space-y-4">
					<p className="text-sm text-green-800 font-medium mb-2">Success! Your transaction is included in the Merkle tree.</p>
					<p className="text-sm text-gray-700 mb-4">Leaf Index: {leafIndex}</p>

					<div>
						<label className="block text-sm font-semibold mb-2 text-gray-800">
							Recipient Address
						</label>
						<input
							type="text"
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
							placeholder="0x..."
							className="w-full p-3 border border-black/30 focus:border-cyan-500 focus:outline-none rounded-lg bg-white text-gray-900"
						/>
					</div>

					<Button
						onClick={handleGenerateProof}
						disabled={loading || !recipient}
					>
						{loading ? loadingText : 'Claim Funds'}
					</Button>

					{error && (
						<div className="p-3 bg-red-50 rounded-lg border border-red-200">
							<p className="text-sm text-red-800">{error}</p>
						</div>
					)}
				</div>
		}
	</>;
}
