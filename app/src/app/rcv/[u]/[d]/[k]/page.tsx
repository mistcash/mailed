'use client';

import { use } from 'react';
import GmailAuthButton from '@/components/GmailAuthButton';
import PageWrapper from '@/components/PageWrapper';

export default function ReceivePage({ params }: { params: Promise<{ u: string; d: string; k: string }> }) {
	const { u, d, k } = use(params);
	const [random, amount] = k.split('-');

	return <PageWrapper title={`Hi ${u},`}>
		<h3 className="text-3xl font-bold mb-6 text-gray-900"></h3>
		<p className="text-gray-700 mb-6">
			To claim your transfer of ${amount}, please connect your google account.
		</p>
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
	</PageWrapper>;
}
