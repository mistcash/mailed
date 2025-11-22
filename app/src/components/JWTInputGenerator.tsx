'use client';

import { generateInputs } from 'noir-jwt';
import { useState } from 'react';

export default function JWTInputGenerator() {
	const [jwt, setJwt] = useState('');
	const [maxDataLength, _] = useState(900);
	const [precomputeKeys, setPrecomputeKeys] = useState('');
	const [inputs, setInputs] = useState<unknown>(null);
	const [error, setError] = useState<string | null>(null);

	const handleGenerate = async () => {
		setInputs('');
		setError('');

		try {
			const pubkey: JsonWebKey =
			{
				"kty": "RSA",
				"n": "nQgDFJeH3PKMGebsY1vUBhTTb8Cvlg45yt_0FSz035dWjMOVi-0OSaybWc4i8EhJ0w_5530vkyqDCibFzKDLdwOzQOqvJZGyBbjBCaQ9LdqBJWSBbi_a62KoJbIXeHvFERgElD2xilIf9KMweN-Ug-a1BDfBNR6AQnZkyQP4BQ5LojIejGx_GWo4rZ3b6LrzE0GHaGNktYlwg7KeTDH49vKqoTpHqGf_T3JUEaWU30DQTw52U6EPD4X_R9n93fYahrmcrozLIJ2Tqiz5b8BFM3wRi5LF_qbWC_zeo74bnKeXEUt8RNmG4HtNvfAL5oEGxpYgH6R92T9kvx4YVZGkWQ",
				"e": "AQAB",
				"ext": true,
				// "kid": "2fb6fd565a8482f7d24801222f91",
				"alg": "RS256",
				"use": "sig"
			};
			const keys = precomputeKeys.trim() ? precomputeKeys.split(',').map(k => k.trim()) : undefined;

			const result = await generateInputs({
				jwt,
				pubkey,
				maxSignedDataLength: maxDataLength,
				shaPrecomputeTillKeys: keys,
			});

			setInputs(result);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(inputs, null, 2));
		alert('Copied!');
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6 space-y-6">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
				<h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
					JWT to Circuit Input Generator
				</h1>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							JWT Token
						</label>
						<textarea
							value={jwt}
							onChange={(e) => setJwt(e.target.value)}
							placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
							className="w-full h-24 p-3 border rounded-lg font-mono text-sm"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
							SHA Precompute Keys (optional)
						</label>
						<input
							type="text"
							value={precomputeKeys}
							onChange={(e) => setPrecomputeKeys(e.target.value)}
							placeholder="nonce,email"
							className="w-full p-3 border rounded-lg"
						/>
					</div>

					<button
						onClick={handleGenerate}
						className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
					>
						Generate Inputs
					</button>
				</div>

				{error && (
					<div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				)}

				{inputs !== null && (
					<div className="mt-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Generated Inputs</h3>
							<button
								onClick={copyToClipboard}
								className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
							>
								Copy JSON
							</button>
						</div>
						<pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs overflow-x-auto max-h-96">
							{JSON.stringify(inputs, null, 2)}
						</pre>
					</div>
				)}
			</div>

			<div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm">
				<p>Uses the official <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">noir-jwt</code> package.</p>
			</div>
		</div>
	);
}
