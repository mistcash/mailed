'use client';

import { use } from 'react';
import GmailAuthButton from '@/components/GmailAuthButton';
import PageWrapper from '@/components/PageWrapper';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@/components/Button';
import ClaimProof from '@/components/ClaimProof';

export default function ReceivePage({ params }: { params: Promise<{ u: string; d: string; k: string }> }) {
	const { logout, isAuthenticated, user } = useAuth0();
	const { u, d, k } = use(params);
	const email = `${u}@${d}`;
	const [random, amount] = k.split('-');

	return <PageWrapper title={`Hi ${u},`}>
		<h3 className="text-3xl font-bold mb-6 text-gray-900"></h3>
		<p className="text-gray-700 mb-6">
			To claim your transfer of ${amount}, please connect your google account.
		</p>
		<div className="space-y-6">
			{!isAuthenticated ? <GmailAuthButton /> : <>
				{user?.email == email ? (
					<div className="p-4 bg-green-50 rounded-lg border border-green-200">
						<ClaimProof email={user.email!} amount={amount} random={random} />
					</div>
				) : (
					<div className="p-4 bg-red-50 rounded-lg border border-red-200">
						<p className="text-sm text-red-800 font-medium mb-2">Error: The authenticated email <code>{user?.email}</code> does not match the recipient email <code>{u}@{d}</code>.</p>
						<Button onClick={() => logout()}>Logout</Button>
					</div>
				)}
			</>}
		</div>
	</PageWrapper>;
}
