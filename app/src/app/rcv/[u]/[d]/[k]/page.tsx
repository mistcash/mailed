'use client';

import { use } from 'react';
import GmailAuthButton from '@/components/GmailAuthButton';

export default function ReceivePage({ params }: { params: Promise<{ u: string; d: string; k: string }> }) {
	const { u, d, k } = use(params);

	return (
		<div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center">
			<div className="max-w-2xl w-full p-8 bg-white rounded-2xl shadow-lg border border-cyan-100">
				<h1 className="text-3xl font-bold mb-6 text-gray-900">Receive</h1>
				<div className="space-y-6">
					<GmailAuthButton />

					{u && (
						<div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
							<label className="block text-sm font-medium text-cyan-900 mb-1">
								Email:
							</label>
							<p className="text-gray-900">{u}@{d}</p>
						</div>
					)}
					{k && (
						<div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
							<label className="block text-sm font-medium text-rose-900 mb-1">
								Secret:
							</label>
							<p className="text-gray-900 font-mono break-all">{k}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
