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
			<div className="bg-white rounded-2xl shadow-xl p-8 border border-black/10">
				<h1 className="text-3xl font-bold mb-4 text-gray-900">
					JWT to Circuit Input Generator
				</h1>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2 text-gray-700">
							JWT Token
						</label>
						<textarea
							value={jwt}
							onChange={(e) => setJwt(e.target.value)}
							placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
							className="w-full h-24 p-3 border border-black/25 focus:border-gray-400 focus:outline-none rounded-lg font-mono text-sm bg-white"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2 text-gray-700">
							SHA Precompute Keys (optional)
						</label>
						<input
							type="text"
							value={precomputeKeys}
							onChange={(e) => setPrecomputeKeys(e.target.value)}
							placeholder="nonce,email"
							className="w-full p-3 border border-black/25 focus:border-gray-400 focus:outline-none rounded-lg bg-white"
						/>
					</div>

					<button
						onClick={handleGenerate}
						className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
					>
						Generate Inputs
					</button>
				</div>

				{error && (
					<div className="mt-4 p-4 bg-rose-100 border border-rose-300 rounded-lg">
						<p className="text-rose-800 text-sm font-medium">{error}</p>
					</div>
				)}

				{inputs !== null && (
					<div className="mt-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Generated Inputs</h3>
							<button
								onClick={copyToClipboard}
								className="px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
							>
								Copy JSON
							</button>
						</div>
						<pre className="p-4 bg-gray-50 border border-black/25 rounded-lg text-xs overflow-x-auto max-h-96">
							{JSON.stringify(inputs, null, 2)}
						</pre>
					</div>
				)}
			</div>

			<div className="bg-linear-to-r from-cyan-50 to-blue-50 rounded-lg p-4 text-sm border border-gray-200">
				<p className="text-gray-800">Uses the official <code className="bg-cyan-100 px-2 py-1 rounded text-cyan-900 font-medium">noir-jwt</code> package.</p>
			</div>
		</div>
	);
}
