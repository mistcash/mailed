'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
	const { isAuthenticated, isLoading } = useAuth0();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			// Get the stored return path from sessionStorage
			const returnPath = sessionStorage.getItem('auth_return_path') || '/';
			sessionStorage.removeItem('auth_return_path');

			// Redirect to the stored path
			router.push(returnPath);
		}
	}, [isAuthenticated, isLoading, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-700 font-medium">Completing authentication...</p>
			</div>
		</div>
	);
}
