'use client';

import { useSearchParams } from 'next/navigation';

export default function ReceivePage() {
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const secret = searchParams.get('secret');

	return (
		<div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center">
			<div className="max-w-2xl w-full p-8 bg-white rounded-2xl shadow-lg border border-cyan-100">
				<h1 className="text-3xl font-bold mb-6 text-gray-900">Receive</h1>
				<div className="space-y-4">
					{email && (
						<div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
							<label className="block text-sm font-medium text-cyan-900 mb-1">
								Email:
							</label>
							<p className="text-gray-900">{email}</p>
						</div>
					)}
					{secret && (
						<div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
							<label className="block text-sm font-medium text-rose-900 mb-1">
								Secret:
							</label>
							<p className="text-gray-900 font-mono break-all">{secret}</p>
						</div>
					)}
					{!email && !secret && (
						<p className="text-gray-700">
							No parameters provided. Use ?email=...&secret=... in the URL.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
