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
			console.log('newLeaves', newLeaves);
			setLeaves(newLeaves);
			const emailHash = hashEmail(email);
			const claimingKey = await hash(emailHash, BigInt(random));

			const tx = await txHash(claimingKey.toString(), MIDDLEWARE_CONTRACT, USDC_TOKEN.id, fmtAmtToBigInt(amount, USDC_TOKEN.decimals || 6).toString());

			const index = newLeaves.indexOf(tx);
			setLeafIndex(index);
		})();

	}, [amount, email, random]);

	const handleGenerateProof = async () => {
		setError('');
		setLoading(true);
	}

	return <>
		{leafIndex == -2 ?
			<p>Loading...</p>
			: leafIndex == -1 ?
				<p className="text-sm text-red-800 font-medium">Error: Could not find the transaction in the leaves.</p>
				:
				<>
					<p className="text-sm text-green-800 font-medium mb-2">Success! Your transaction is included in the Merkle tree.</p>
					<p className="text-sm text-gray-700 mb-4">Leaf Index: {leafIndex}</p>
					<Button onClick={() => {/* Logic to generate and display proof */ }}>Generate Proof</Button>
				</>
		}
	</>;
}
