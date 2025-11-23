import React, { useState } from 'react'
import { WalletGate } from './WalletGate';
import Button from './Button';
import { hashEmail } from '../../lib/hash-email';

export default function DepositUI() {
	const [email, setEmail] = useState('');
	const [amount, setAmount] = useState('');

	const handleSend = () => {
		const emailHash = hashEmail(email);
		console.log({ email, emailHash: emailHash.toString(16), amount });
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
	</div>;
}
