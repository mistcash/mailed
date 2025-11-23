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

import React, { useState, useEffect } from 'react';
import { useMist } from '@mistcash/react';
import { useProvider, useSendTransaction } from '@starknet-react/core';
import { hash, txHash } from '@mistcash/crypto';
import { hashEmail } from '../../lib/hash-email';
import { MIDDLEWARE_CONTRACT, USDC_TOKEN } from '@/lib/conf';
import Button from './Button';
import { init as garagaInit } from 'garaga';
import { fmtAmtToBigInt } from '@mistcash/sdk';

interface ClaimProofProps {
	email: string;
	amount: string;
	random: string;
}

export default function ClaimProof({ email, amount, random }: ClaimProofProps) {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [leaves, setLeaves] = useState<object | null>(null);
	const [proofData, setProofData] = useState<object | null>(null);
	const [recipient, setRecipient] = useState('');
	const [leafIndex, setLeafIndex] = useState(-2);

	const { setTo, setKey, fetchAsset, updateTxLeaves } = useMist(useProvider(), useSendTransaction({}));

	useEffect(() => {
		garagaInit();
		(async () => {
			const newLeaves = await updateTxLeaves();
			setLeaves(newLeaves);
			const emailHash = hashEmail(email);
			const claimingKey = await hash(emailHash, BigInt(random));

			const tx = await txHash(claimingKey.toString(), MIDDLEWARE_CONTRACT, USDC_TOKEN.id, fmtAmtToBigInt(amount, USDC_TOKEN.decimals || 6).toString());

			const index = newLeaves.indexOf(tx);
			setLeafIndex(index);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amount, email, random]);

	const handleGenerateProof = async () => {
		setError('');
		setLoading(true);
		try {
			const emailHash = hashEmail(email);
			const claimingKey = await hash(emailHash, BigInt(random));

			// Prepare proof data
			const claimData = {
				emailHash: emailHash.toString(),
				claimingKey: claimingKey.toString(),
				recipient,
				asset: {
					addr: USDC_TOKEN.id,
					amount: fmtAmtToBigInt(amount, USDC_TOKEN.decimals || 6).toString(),
				},
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
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to generate proof');
		} finally {
			setLoading(false);
		}
	}

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
						{loading ? 'Claiming...' : 'Claim Funds'}
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
